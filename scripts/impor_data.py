"""Ubah dataset Data/ menjadi CSV per tabel sesuai supabase/migrations/*_skema_awal.sql.

Pakai:  python scripts/impor_data.py [folder_keluaran]   (default: build/impor)
Hasil:  <tabel>.csv + muat.sql (perintah psql \\copy dalam satu transaksi).
Hanya standard library. Skrip berhenti dengan galat bila ada kunci yang tidak cocok.
"""
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "Data"
NULL = r"\N"

# Jumlah prodi per klaster menurut PRD v2.1 bagian 5 (dipakai sebagai cek).
KLASTER_PRD = {1: 1004, 2: 879, 3: 665, 4: 640, 5: 590, 6: 479, 7: 467, 8: 237, 9: 189}


def baca(nama):
    with open(DATA / nama, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def kosong(v):
    return v is None or str(v).strip() == ""


def teks(v):
    return None if kosong(v) else str(v).strip()


def angka(v, fungsi=float):
    return None if kosong(v) else fungsi(str(v).strip())


def bulat(v):
    return None if kosong(v) else int(float(str(v).strip()))


def boolean(v):
    return None if kosong(v) else str(v).strip() in ("1", "true", "True")


def pg_array(nilai):
    isi = ('"' + x.replace("\\", "\\\\").replace('"', '\\"') + '"' for x in nilai)
    return "{" + ",".join(isi) + "}"


def gagal(pesan):
    sys.exit(f"GAGAL: {pesan}")


class Keluaran:
    def __init__(self, folder):
        self.folder = folder
        self.urutan = []  # (tabel, kolom, jumlah baris)

    def tulis(self, tabel, kolom, baris):
        with open(self.folder / f"{tabel}.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            w.writerow(kolom)
            for b in baris:
                w.writerow([NULL if b[k] is None else b[k] for k in kolom])
        self.urutan.append((tabel, kolom, len(baris)))

    def tulis_muat_sql(self):
        baris = [
            "-- Dibuat oleh scripts/impor_data.py. Jalankan dari folder ini:",
            "--   psql \"$SUPABASE_DB_URL\" -f muat.sql",
            "\\set ON_ERROR_STOP on",
            "begin;",
        ]
        for tabel, kolom, _ in self.urutan:
            baris.append(
                f"\\copy {tabel} ({', '.join(kolom)}) from '{tabel}.csv' "
                f"with (format csv, header true, null '\\N', encoding 'UTF8')"
            )
        baris += ["commit;", "analyze;", ""]
        (self.folder / "muat.sql").write_text("\n".join(baris), encoding="utf-8")


def main():
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "build" / "impor"
    folder.mkdir(parents=True, exist_ok=True)
    out = Keluaran(folder)

    # ---------- Provinsi ----------
    cw = baca("ak_provinsi_crosswalk.csv")
    kode_kanonik = {}
    for x in cw:
        lama = kode_kanonik.setdefault(x["provinsi_kanonik"], x["kode_bps"])
        if lama != x["kode_bps"]:
            gagal(f"kode BPS ganda untuk {x['provinsi_kanonik']}")
    provinsi = {}
    for x in cw:
        provinsi[x["kode_bps"]] = {
            "kode_bps": x["kode_bps"],
            "nama": x["provinsi_kanonik"],
            "kode_bps_induk": kode_kanonik[x["provinsi_induk_sebelum_pemekaran_2022"]],
        }
    # Resolver nama provinsi dari file mana pun -> kode_bps.
    nama_ke_kode = dict(kode_kanonik)
    for x in cw:
        lama = nama_ke_kode.setdefault(x["nama_di_sumber"], x["kode_bps"])
        if lama != x["kode_bps"]:
            gagal(f"nama provinsi '{x['nama_di_sumber']}' merujuk dua kode")

    def kode_prov(nama, konteks):
        if kosong(nama):
            return None
        if nama not in nama_ke_kode:
            gagal(f"provinsi '{nama}' ({konteks}) tidak ada di crosswalk")
        return nama_ke_kode[nama]

    # Induk harus ditulis sebelum anak pemekaran (FK ke tabel sendiri).
    prov_urut = sorted(provinsi.values(), key=lambda p: (p["kode_bps"] != p["kode_bps_induk"], p["kode_bps"]))
    out.tulis("provinsi", ["kode_bps", "nama", "kode_bps_induk"], prov_urut)
    out.tulis(
        "provinsi_alias",
        ["sumber_file", "nama_di_sumber", "kode_bps"],
        [{"sumber_file": x["sumber_file"], "nama_di_sumber": x["nama_di_sumber"], "kode_bps": x["kode_bps"]} for x in cw],
    )

    # ---------- Kabupaten/kota ----------
    kab = [
        {
            "kode_kab": x["kode_kab"],
            "nama": x["nama_kab"],
            "kode_bps": kode_prov(x["provinsi"], "kabupaten_kota"),
            "lat": angka(x["lat"]),
            "lon": angka(x["lon"]),
            "sumber_koordinat": teks(x["sumber"]),
        }
        for x in baca("ak_kabupaten_kota.csv")
    ]
    out.tulis("kabupaten_kota", list(kab[0]), kab)
    kode_kab_ada = {k["kode_kab"] for k in kab}

    # ---------- PTN ----------
    ptn = [
        {
            "id_ptn": int(x["id_ptn"]),
            "kode_ptn": x["kode_ptn"],
            "nama": x["nama_ptn"],
            "jenis": x["jenis"],
            "is_ptnbh": boolean(x["is_ptnbh"]),
            "is_ptkin": boolean(x["is_ptkin"]),
            "web": teks(x["web"]),
            "alamat": teks(x["alamat"]),
            "kode_bps": kode_prov(x["provinsi"], "ptn"),
            "kode_bps_2": kode_prov(x["provinsi_2"], "ptn.provinsi_2"),
            "kode_prov_snpmb": x["kode_prov"],
            "kota": teks(x["kota"]),
            "ikut_snbp": boolean(x["ikut_snbp"]),
            "ikut_snbt": boolean(x["ikut_snbt"]),
            "lat": angka(x["lat"]),
            "lon": angka(x["lon"]),
            "presisi_lokasi": teks(x["presisi_lokasi"]),
        }
        for x in baca("ak_ptn.csv")
    ]
    out.tulis("ptn", list(ptn[0]), ptn)
    id_ptn_ada = {p["id_ptn"] for p in ptn}

    # ---------- Klaster & rumpun ----------
    klaster = [{"klaster_id": int(x["klaster_id"]), "nama": x["nama"]} for x in baca("klaster.csv")]
    out.tulis("klaster", ["klaster_id", "nama"], klaster)
    rumpun_klaster = {x["rumpun_id"]: int(x["klaster_id"]) for x in baca("rumpun_klaster.csv")}

    rumpun = []
    for x in baca("rumpun_riasec.csv"):
        if x["rumpun_id"] not in rumpun_klaster:
            gagal(f"rumpun {x['rumpun_id']} belum dipetakan di rumpun_klaster.csv")
        rumpun.append(
            {
                "rumpun_id": x["rumpun_id"],
                "nama": x["rumpun"],
                "kelompok": x["kelompok"],
                **{k.lower(): angka(x[k]) for k in "RIASEC"},
                "kode_holland": x["kode_holland"],
                "jumlah_okupasi_onet": bulat(x["jumlah_okupasi_onet"]),
                "mapel_pendukung": teks(x["mapel_pendukung"]),
                "klaster_id": rumpun_klaster[x["rumpun_id"]],
            }
        )
    out.tulis("rumpun", list(rumpun[0]), rumpun)
    rumpun_ada = {r["rumpun_id"] for r in rumpun}
    rumpun_per_nama = {r["nama"]: r["rumpun_id"] for r in rumpun}

    okupasi = [
        {
            "rumpun_id": x["rumpun_id"],
            "onet_soc": x["onet_soc"],
            "okupasi": x["okupasi_onet"],
            **{k.lower(): angka(x[k]) for k in "RIASEC"},
        }
        for x in baca("onet_rumpun_okupasi.csv")
    ]
    out.tulis("rumpun_okupasi_onet", list(okupasi[0]), okupasi)

    # ---------- Prodi ----------
    snbp = {x["id_prodi"]: x for x in baca("ak_snbp_prodi.csv")}
    snbt = {x["id_prodi"]: x for x in baca("ak_snbt_prodi.csv")}
    prodi = []
    for x in baca("ak_prodi_master.csv"):
        sumber = snbp.get(x["id_prodi"]) or snbt[x["id_prodi"]]
        rid = teks(x["rumpun_id"]) or rumpun_per_nama.get(x["rumpun"])  # 237 prodi kependidikan: lewat nama
        if rid not in rumpun_ada:
            gagal(f"prodi {x['id_prodi']} rumpun '{x['rumpun']}' tidak dikenal")
        if int(x["id_ptn"]) not in id_ptn_ada:
            gagal(f"prodi {x['id_prodi']} id_ptn {x['id_ptn']} tidak ada")
        prodi.append(
            {
                "id_prodi": int(x["id_prodi"]),
                "id_ptn": int(x["id_ptn"]),
                "kode_prodi": sumber["kode_prodi"],
                "nama": x["nama_prodi"],
                "jenjang": x["jenjang"],
                "rumpun_id": rid,
                "rumpun_pendidikan": teks(x["rumpun_pendidikan"]),
                "is_keguruan": not kosong(x["rumpun_pendidikan"]),
                "kelompok": x["kelompok"],
                **{k.lower(): angka(x[k]) for k in "RIASEC"},
                "kode_holland": x["kode_holland"],
                "mapel_pendukung_snbp": teks(x["mapel_pendukung_snbp"]),
                "kode_portofolio": bulat(sumber["kode_portofolio"]),
                "portofolio": teks(x["portofolio"]),
                "is_baru": boolean(sumber["is_new"]),
                "ada_snbp": boolean(x["ada_snbp"]),
                "ada_snbt": boolean(x["ada_snbt"]),
                "dt_snbp_2026": bulat(x["dt_snbp_2026"]),
                "peminat_snbp_2025": bulat(x["peminat_snbp_2025"]),
                "diterima_snbp_2025": bulat(x["diterima_snbp_2025"]),
                "rasio_terima_snbp_2025": angka(x["rasio_terima_snbp_2025"]),
                "rasio_terima_snbp_rata3th": angka(x["rasio_terima_snbp_rata3th"]),
                "peminat_snbp_rata3th": angka(x["peminat_snbp_rata3th"]),
                "dt_snbt_2026": bulat(x["dt_snbt_2026"]),
                "peminat_snbt_2025": bulat(x["peminat_snbt_2025"]),
                "dt_snbt_2025": bulat(x["dt_snbt_2025"]),
                "keketatan_snbt_2025": angka(x["keketatan_snbt_2025"]),
                "tren_peminat_snbt_3th": angka(x["tren_peminat_snbt_3th"]),
                "est_skor_utbk": bulat(x["est_skor_utbk"]),
                "est_skor_utbk_bawah": bulat(x["est_skor_utbk_bawah"]),
                "est_skor_utbk_atas": bulat(x["est_skor_utbk_atas"]),
                "metode_est_utbk": teks(x["metode_est_utbk"]),
            }
        )
    out.tulis("prodi", list(prodi[0]), prodi)
    id_prodi_ada = {p["id_prodi"] for p in prodi}

    statistik = []
    for jalur, sumber in (("snbp", snbp), ("snbt", snbt)):
        for x in sumber.values():
            for tahun in range(2021, 2027):
                b = {
                    "id_prodi": int(x["id_prodi"]),
                    "jalur": jalur,
                    "tahun": tahun,
                    "daya_tampung": bulat(x.get(f"daya_tampung_{tahun}")),
                    "peminat": bulat(x.get(f"peminat_{tahun}")),
                    "diterima": bulat(x.get(f"diterima_{tahun}")),
                }
                if any(b[k] is not None for k in ("daya_tampung", "peminat", "diterima")):
                    statistik.append(b)
    out.tulis("prodi_statistik_tahunan", list(statistik[0]), statistik)

    peminat_prov = []
    for x in baca("ak_snbt_peminat_provinsi.csv"):
        if int(x["id_prodi"]) not in id_prodi_ada:
            gagal(f"peminat provinsi: id_prodi {x['id_prodi']} tidak ada")
        peminat_prov.append(
            {
                "id_prodi": int(x["id_prodi"]),
                "tahun": int(x["tahun"]),
                "kode_prov_snpmb": x["kode_prov"],
                "kode_bps": kode_prov(x["nama_prov"], "snbt_peminat_provinsi"),
                "jml_peminat": int(x["jml_peminat"]),
            }
        )
    out.tulis("snbt_peminat_provinsi", list(peminat_prov[0]), peminat_prov)

    # ---------- Akreditasi & PDDikti ----------
    akr = {}
    for x in baca("ak_akreditasi_map.csv"):
        akr[x["nilai_di_sumber"].strip()] = {
            "nilai_di_sumber": x["nilai_di_sumber"].strip(),
            "kanonik": x["akreditasi_kanonik"],
            "skor": int(x["skor_ordinal"]),
            "catatan": teks(x["catatan"]),
        }
    out.tulis("akreditasi_map", ["nilai_di_sumber", "kanonik", "skor", "catatan"], list(akr.values()))

    def mhs_per_dosen(v):
        if kosong(v) or v.strip() == "-":  # "-" = tidak ada data
            return None
        m = re.fullmatch(r"\s*1\s*:\s*([\d.]+)\s*", v)
        if not m:
            gagal(f"format rasio_dosen_mhs tidak dikenal: {v!r}")
        return float(m.group(1))

    pddikti = []
    for x in baca("ak_pddikti_prodi.csv"):
        nilai = (x["akreditasi"] or "").strip()
        if nilai not in akr:
            gagal(f"akreditasi '{nilai}' tidak ada di ak_akreditasi_map.csv")
        pddikti.append(
            {
                "id_prodi": int(x["id_prodi"]),
                "cocok_pddikti": boolean(x["cocok_pddikti"]),
                "skor_cocok": angka(x["skor_cocok"]),
                "nama_prodi_pddikti": teks(x["nama_prodi_pddikti"]),
                "kode_prodi_pddikti": teks(x["kode_prodi_pddikti"]),
                "kelompok_bidang": teks(x["kelompok_bidang"]),
                "akreditasi": teks(nilai),
                "akreditasi_kanonik": akr[nilai]["kanonik"],
                "akreditasi_skor": akr[nilai]["skor"],
                "akreditasi_internasional": teks(x["akreditasi_internasional"]),
                "jumlah_dosen": bulat(x["jumlah_dosen"]),
                "jumlah_mahasiswa": bulat(x["jumlah_mahasiswa"]),
                "rasio_dosen_mhs": None if x["rasio_dosen_mhs"].strip() == "-" else teks(x["rasio_dosen_mhs"]),
                "mhs_per_dosen": mhs_per_dosen(x["rasio_dosen_mhs"]),
                "rata_masa_studi_th": angka(x["rata_masa_studi_th"]),
                "tgl_berdiri": teks(x["tgl_berdiri"]),
                "kode_bps_prodi": kode_prov(x["provinsi_prodi"], "pddikti_prodi"),
                "kab_kota_prodi": teks(x["kab_kota_prodi"]),
                "lat": angka(x["lat_prodi"]),
                "lon": angka(x["lon_prodi"]),
                "website": teks(x["website"]),
                "ada_teks_kompetensi": boolean(x["ada_teks_kompetensi"]),
            }
        )
    out.tulis("prodi_pddikti", list(pddikti[0]), pddikti)

    with open(DATA / "ak_profil_prodi_ptn.json", encoding="utf-8") as f:
        profil_json = json.load(f)
    profil = []
    for x in profil_json:
        if x["id_prodi"] not in id_prodi_ada:
            gagal(f"profil: id_prodi {x['id_prodi']} tidak ada")
        profil.append(
            {
                "id_prodi": x["id_prodi"],
                "nama_prodi_pddikti": teks(x.get("nama_prodi_pddikti")),
                "deskripsi": teks(x.get("deskripsi")),
                "visi": teks(x.get("visi")),
                "misi": teks(x.get("misi")),
                "kompetensi": pg_array([k for k in x.get("kompetensi") or [] if not kosong(k)]),
                "capaian_belajar": pg_array([k for k in x.get("capaian_belajar") or [] if not kosong(k)]),
                "website": teks(x.get("website")),
            }
        )
    out.tulis("prodi_profil", list(profil[0]), profil)

    # ---------- Sekolah ----------
    sekolah = []
    for x in baca("ak_sekolah_kuota_snbp_2026.csv"):
        if x["kode_kab"] not in kode_kab_ada:
            gagal(f"sekolah {x['npsn']}: kode_kab {x['kode_kab']} tidak ada")
        kuota = {k: int(v) for k, v in json.loads(x["jurusan_kuota_json"]).items()}
        sekolah.append(
            {
                "npsn": x["npsn"],
                "nama": x["nama_sekolah"],
                "jenis": x["jenis"],
                "akreditasi": teks(x["akreditasi"]),
                "akreditasi_kadaluarsa": teks(x["akreditasi_kadaluarsa"]),
                "persen_kuota": int(x["persen_kuota"].rstrip("%")) / 100,
                "total_siswa_eligible_basis": int(x["total_siswa_eligible_basis"]),
                "kuota_siswa": int(x["kuota_siswa"]),
                "kode_kab": x["kode_kab"],
                "kode_bps": kode_prov(x["provinsi"], "sekolah"),
                "jurusan_kuota": json.dumps(kuota, ensure_ascii=False),
            }
        )
    out.tulis("sekolah", list(sekolah[0]), sekolah)
    npsn_ada = {s["npsn"] for s in sekolah}

    # ---------- Soal ----------
    soal = []
    kolom_soal = ["soal", "opsi_a", "opsi_b", "opsi_c", "opsi_d", "kunci", "pembahasan"]
    for nama, lapisan in (("ak_soal_spesifik_prodi_ptn_v2.csv", "spesifik"), ("ak_soal_umum_prodi.csv", "umum")):
        for x in baca(nama):
            if int(x["id_prodi"]) not in id_prodi_ada:
                gagal(f"{nama}: id_prodi {x['id_prodi']} tidak ada")
            soal.append(
                {
                    "id_soal": x["id_soal"],
                    "lapisan": lapisan,
                    "id_prodi": int(x["id_prodi"]),
                    "rumpun_id": None,
                    "kategori": None,
                    "tipe": teks(x["tipe"]),
                    **{k: teks(x[k]) for k in kolom_soal},
                    "sumber": teks(x["sumber_teks"]),
                    "status": teks(x["status"]),
                }
            )
    for x in baca("bank_soal_simulasi.csv"):
        rumpun_soal = x["jenis"] == "cicip_jurusan"
        if rumpun_soal and x["kategori"] not in rumpun_ada:
            gagal(f"bank soal {x['id']}: rumpun {x['kategori']} tidak ada")
        soal.append(
            {
                "id_soal": x["id"],
                "lapisan": "rumpun" if rumpun_soal else "utbk",
                "id_prodi": None,
                "rumpun_id": x["kategori"] if rumpun_soal else None,
                "kategori": x["kategori"],
                "tipe": x["jenis"],
                **{k: teks(x[k]) for k in kolom_soal},
                "sumber": teks(x["sumber"]),
                "status": None,
            }
        )
    ganda = [k for k, n in Counter(s["id_soal"] for s in soal).items() if n > 1]
    if ganda:
        gagal(f"id_soal ganda: {ganda[:5]}")
    out.tulis("soal", list(soal[0]), soal)

    # ---------- Pelengkap ----------
    out.tulis(
        "alias_pencarian",
        ["alias", "jenis", "arti"],
        [{"alias": x["alias"], "jenis": x["jenis"], "arti": x["arti"]} for x in baca("alias_pencarian.csv")],
    )
    out.tulis(
        "minat_item",
        ["item_id", "urutan_tampil", "skala", "teks_id", "teks_en_asli", "mini_ip_30", "sumber"],
        [
            {
                "item_id": x["item_id"],
                "urutan_tampil": int(x["urutan_tampil"]),
                "skala": x["skala"],
                "teks_id": x["teks_id"],
                "teks_en_asli": x["teks_en_asli"],
                "mini_ip_30": boolean(x["mini_ip_30"]),
                "sumber": x["sumber"],
            }
            for x in baca("form_minat_riasec_items.csv")
        ],
    )
    out.tulis(
        "mapel_pendukung",
        ["rumpun_prodi", "mapel_pendukung", "dasar_hukum", "sumber_rekap"],
        [
            {
                "rumpun_prodi": x["rumpun_prodi"],
                "mapel_pendukung": x["mapel_pendukung_kurikulum_merdeka"],
                "dasar_hukum": teks(x["dasar_hukum"]),
                "sumber_rekap": teks(x["sumber_rekap"]),
            }
            for x in baca("mapel_pendukung_snbp.csv")
        ],
    )
    out.tulis(
        "utbk_anchor_kampus",
        ["tahun", "jenjang", "kampus", "rata_rata_utbk", "sumber"],
        [
            {"tahun": int(x["tahun"]), "jenjang": x["jenjang"], "kampus": x["kampus"],
             "rata_rata_utbk": angka(x["rata_rata_utbk"]), "sumber": teks(x["sumber"])}
            for x in baca("utbk_anchor_kampus.csv")
        ],
    )
    out.tulis(
        "utbk_nasional",
        ["tahun", "jenjang", "skor_min", "skor_rerata", "skor_max", "sumber"],
        [
            {"tahun": int(x["tahun"]), "jenjang": x["jenjang"], "skor_min": angka(x["skor_min"]),
             "skor_rerata": angka(x["skor_rerata"]), "skor_max": angka(x["skor_max"]), "sumber": teks(x["sumber"])}
            for x in baca("utbk_nasional_2025.csv")
        ],
    )

    alumni = []
    for x in baca("ak_alumni_sintetis_snbp.csv"):
        if x["npsn"] not in npsn_ada or int(x["id_prodi"]) not in id_prodi_ada:
            gagal(f"alumni sintetis: npsn {x['npsn']} / id_prodi {x['id_prodi']} tidak ada")
        alumni.append(
            {
                "npsn": x["npsn"],
                "tahun": int(x["tahun"]),
                "id_prodi": int(x["id_prodi"]),
                "jalur": x["jalur"],
                "nilai_rapor_rata": angka(x["nilai_rapor_rata"]),
                "status": x["status"],
                "ipk_tahun1": angka(x["ipk_tahun1"]),
                "label_data": x["label_data"],
            }
        )
    out.tulis("alumni_sintetis", list(alumni[0]), alumni)

    out.tulis_muat_sql()

    # ---------- Cek klaster terhadap PRD ----------
    klaster_rumpun = {r["rumpun_id"]: r["klaster_id"] for r in rumpun}
    hitung = Counter(klaster_rumpun[p["rumpun_id"]] for p in prodi)
    print("Klaster (data vs PRD):")
    beda = False
    for k in sorted(KLASTER_PRD):
        tanda = "" if hitung[k] == KLASTER_PRD[k] else "  <-- BEDA"
        beda |= bool(tanda)
        print(f"  {k}: {hitung[k]:>5} vs {KLASTER_PRD[k]:>5}{tanda}")
    print(f"Prodi keguruan (tag): {sum(p['is_keguruan'] for p in prodi)}")
    print("\nTabel ditulis ke", folder)
    for tabel, _, n in out.urutan:
        print(f"  {tabel:<26}{n:>8}")
    if beda:
        gagal("jumlah prodi per klaster tidak sama dengan PRD")


if __name__ == "__main__":
    main()

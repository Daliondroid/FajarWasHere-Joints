"""Implementasi referensi (deterministik) untuk form minat & pencocokan prodi ArahKuliah.
Pakai sebagai acuan saat menulis versi TypeScript/Python di backend."""
import csv, math
SKALA = "RIASEC"
HEX = {a:i for i,a in enumerate(SKALA)}  # urutan heksagon Holland

def skor_minat(jawaban: dict, items_csv="form_minat_riasec_items.csv", mode="mini_ip_30"):
    """jawaban: {item_id: 0..4}. Return dict skala -> skor 1..7 (sebanding O*NET OI)."""
    items=[r for r in csv.DictReader(open(items_csv,encoding="utf-8")) if mode!="mini_ip_30" or r["mini_ip_30"]=="1"]
    tot={a:0 for a in SKALA}; n={a:0 for a in SKALA}
    for r in items:
        if r["item_id"] in jawaban:
            tot[r["skala"]]+=jawaban[r["item_id"]]; n[r["skala"]]+=1
    return {a:(round(tot[a]/(4*n[a])*6+1,2) if n[a] else None) for a in SKALA}

def kode_holland(profil: dict, k=3):
    return "".join(a for a,_ in sorted(profil.items(), key=lambda t:-t[1])[:k])

def pearson(x, y):
    mx=sum(x)/len(x); my=sum(y)/len(y)
    sxy=sum((a-mx)*(b-my) for a,b in zip(x,y)); sxx=sum((a-mx)**2 for a in x); syy=sum((b-my)**2 for b in y)
    return 0.0 if sxx==0 or syy==0 else sxy/math.sqrt(sxx*syy)

def c_index(kode_siswa, kode_prodi):
    """Brown & Gore (1994): 3*d1 + 2*d2 + 1*d3, d = 3 (sama), 2 (bersebelahan), 1 (selang satu), 0 (berseberangan). Rentang 0..18."""
    def d(a,b):
        k=abs(HEX[a]-HEX[b]); k=min(k,6-k); return 3-k
    return sum(w*d(a,b) for w,a,b in zip((3,2,1),kode_siswa,kode_prodi))

def kecocokan(profil_siswa: dict, vektor_prodi: list, skor_hobi=None):
    r=pearson([profil_siswa[a] for a in SKALA], vektor_prodi)
    skor=(r+1)/2*100
    if skor_hobi is not None: skor=0.8*skor+0.2*skor_hobi
    label="Sangat cocok" if skor>=80 else "Cocok" if skor>=65 else "Cukup" if skor>=50 else "Kurang cocok"
    return round(skor,1), label

def peluang_snbt(est_skor_utbk_prodi, skor_to_siswa, sebaran=35.0):
    """Peluang lolos SNBT sebagai logistik dari selisih skor TO siswa vs estimasi skor prodi (ESTIMASI)."""
    z=(skor_to_siswa-est_skor_utbk_prodi)/sebaran
    return round(100/(1+math.exp(-1.7*z)),1)

if __name__=="__main__":
    prof={"R":3.1,"I":6.2,"A":2.4,"S":3.0,"E":2.2,"C":5.1}
    print(kode_holland(prof), kecocokan(prof,[3.73,6.01,2.58,1.98,2.11,5.35]), c_index("ICR","ICR"), peluang_snbt(650,680))

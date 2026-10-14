import json, re
_d = json.load(open(__file__.rsplit('/',1)[0]+'/families.json'))
F = _d['F']
# order fix: specific kedokteran variants first; olahraga before kesehatan_lain
ids=[f[0] for f in F]
def _move(a,b):
    i=ids.index(a); f=F.pop(i); ids.pop(i); j=ids.index(b); F.insert(j,f); ids.insert(j,a)
_move('kedokteran_gigi','kedokteran'); _move('kedokteran_hewan','kedokteran'); _move('olahraga','kesehatan_lain')
FAMRE=[(f[0],re.compile(f[2]+(r'|KEDOKTERAN$|^ILMU KEDOKTERAN' if f[0]=='kedokteran' else ''))) for f in F]
LABEL={f[0]:f[1] for f in F}; MAPEL={f[0]:f[4] for f in F}; KEL={f[0]:f[5] for f in F}
XR=[(a,re.compile(b)) for a,b in [
 ("sosiologi",r"HUMANITAS"),("farmasi",r"KOSMETIK"),("teknik_kimia",r"PULP|KERTAS"),
 ("biologi",r"BIOMEDIS|ILMU DAN TEKNOLOGI HAYATI|\bSITH\b|HAYATI"),("kimia",r"LABORATORIUM SAINS"),
 ("informatika",r"SISTEM KOMPUTER|\bSTEI\b|ELEKTRO DAN INFORMATIKA"),
 ("politik_hi",r"PANCASILA|KEWARGANEGARAAN|\bPPKN\b|\bPKN\b"),
 ("kebumian",r"ATMOSFIR|ATMOSFER|KEPLANETAN|\bFITB\b|OCEANOGRAFI"),("teknik_industri",r"TEKNOLOGI INDUSTRI|\bFTI\b"),
 ("pariwisata",r"MEETING|CONVENTION|KONVENSI|ACARA"),("teknik_pertanian",r"AGRO ?INDUSTRI|SMART AGRICULTURE"),
 ("perikanan",r"\bIKAN\b|BUDI ?DAYA LAUT"),("perpustakaan",r"SAINS INFORMASI"),("pertanian",r"AGROTEKNO"),
 ("kesos",r"KELUARGA|KONSUMEN"),("planologi",r"TATA RUANG|PERTANAHAN|PEMBANGUNAN WILAYAH|PERUMAHAN|PEMUKIMAN|PERMUKIMAN|SUMBER DAYA LAHAN"),
 ("tari_teater",r"KOREOGRAFI"),("seni_rupa",r"KERIS|SENJATA TRADISIONAL"),("teknik_fisika",r"TEKNOLOGI KEDOKTERAN"),
 ("sistem_informasi",r"INOVASI DIGITAL"),("fisioterapi",r"MASASE|FISOTERAPI"),("manajemen",r"ENTER?PRENEUR"),
 ("teknik_mesin",r"PERKAKAS|PENGECORAN"),("ekonomi",r"\bEKO\b"),("fisika",r"ILMU FISIKA"),("akuntansi",r"AKUTANSI"),
 ("sastra_indo",r"TRADISI LISAN"),
]]
EK=[(re.compile(a),b) for a,b in [
 (r"PAUD|ANAK USIA DINI|GURU PENDIDIKAN ANAK|PIAUD|RAUDHATUL","PAUD"),
 (r"LUAR BIASA|KHUSUS|INKLUSI|\bPLB\b|\bPKH\b","LUAR BIASA"),
 (r"BIMBINGAN|KONSELING","BIMBINGAN DAN KONSELING"),
 (r"TEKNOLOGI PENDIDIKAN|KURIKULUM|ADMINISTRASI PENDIDIKAN|MANAJEMEN PENDIDIKAN|PENDIDIKAN MASYARAKAT|NONFORMAL|LUAR SEKOLAH|\bPLS\b","TEKNOLOGI PENDIDIKAN"),
 (r"PGSD|GURU SEKOLAH DASAR|GURU SEK DASAR|SEKOLAH DASAR|PENDIDIKAN DASAR|MADRASAH IBTIDAIYAH|PGMI","PGSD"),
 (r"VOKASIONAL|KEJURUAN|TEKNIK|OTOMOTIF|MESIN|ELEKTRO|BANGUNAN|TATA BOGA|TATA BUSANA|TATA RIAS|KESEJAHTERAAN KELUARGA","VOKASIONAL"),
]]
EDU_RE=re.compile(r"^(PENDIDIKAN|TADRIS|P GURU|PG ?PAUD|PGSD|PGMI|PIAUD|PAUD$|PLS$|PLB\b|BIMBINGAN (DAN )?KONSELING|TEKNOLOGI PENDIDIKAN|MANAJEMEN PENDIDIKAN|ADMINISTRASI PENDIDIKAN|KURIKULUM)")
def norm(n):
    n=n.upper().replace('&',' DAN ')
    n=re.sub(r"\bPENDD?\b\.?|\bPENDIDKAN\b",'PENDIDIKAN',n); n=re.sub(r"\bP\.\s*GURU",'P GURU',n)
    for a,b in [(r"\bBIMB\b\.?","BIMBINGAN"),(r"\bADM\b\.?","ADMINISTRASI"),(r"\bBHS\b\.?","BAHASA"),(r"\bSATRA\b","SASTRA"),(r"\bIND\b\.?","INDONESIA"),(r"LINGKUNGAAN","LINGKUNGAN"),(r"KEWIRUSAHAAN","KEWIRAUSAHAAN"),(r"\bP\.KH\b","PKH")]:
        n=re.sub(a,b,n)
    n=re.sub(r"[.,/()\-]",' ',n); return re.sub(r"\s+",' ',n).strip()
def cls(n):
    for f,r in XR:
        if r.search(n): return f
    for f,r in FAMRE:
        if r.search(n): return f
    return None
def classify(raw):
    n=norm(raw)
    if EDU_RE.search(n) and not re.search(r"DOKTER|PROFESI|KEDOKTERAN",n):
        t='default'
        for r,k in EK:
            if r.search(n): t=k; break
        rest=re.sub(r"^(PENDIDIKAN|TADRIS|P GURU)\s+",'',n)
        subj=None if t in ('PAUD','PGSD','BIMBINGAN DAN KONSELING','TEKNOLOGI PENDIDIKAN') else cls(rest)
        if subj=='kesos' and t=='VOKASIONAL': pass
        if not subj and re.search(r"AGAMA|ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA|KONGHUCU|QUR|ARAB",rest): subj='filsafat_agama'
        return subj, 'edu:'+t
    return cls(n), None

# ---- Lapisan koreksi (identik dengan versi JS yang dipakai membangun prodi_master.csv) ----
def strip_campus(raw):
    u=raw.upper()
    if re.match(r"^KEDOKTERAN\s*\(",u): return "KEDOKTERAN"
    u=re.sub(r"\((?![^)]*\b(PGSD|PPKN|PKN|PJKR|DKV|SITH|FTI|STEI|FITB|PAUD|PLB|PLS)\b)[^)]*\)",' ',u)
    u=re.sub(r"\b(PSDKU|KAMPUS|KAMP|KAB\.|KABUPATEN|KOTA)\b.*$",'',u)
    return re.sub(r"\s+",' ',u).strip() or raw.upper()
_EXTRA=[('informatika',r"KOMPUTER|PERANGKAT LUNAK|\bAI\b"),('sistem_informasi',r"INTERNET|DIGITAL|TEKNOLOGI INFORMASI"),('geografi',r"SURVEY|PEMETAAN"),('film_animasi',r"MULTIMEDIA|GRAFIKA|GRAFIS"),('teknik_mesin',r"PENGELASAN|FABRIKASI|PERMESINAN|PRODUKSI|MEKANIK"),('teknik_sipil',r"\bAIR\b|PERUMAHAN|BANGUNAN|JALAN|JEMBATAN"),('teknik_tambang',r"NANO")]
_OV=[(r"DESAIN|DKV",'desain'),(r"KAJIAN (SASTRA|BUDAYA)",'sastra_indo'),(r"KAJIAN FILM",'film_animasi'),(r"KESEHATAN HEWAN",'kedokteran_hewan'),(r"GEO ?FISIKA",'kebumian'),(r"MINERAL",'teknik_tambang'),(r"LEPAS PANTAI",'teknik_kelautan'),(r"PENDINGIN|TATA UDARA|PERPIPAAN|UTILITAS",'teknik_mesin'),(r"AERIAL|NIRAWAK|DRONE",'penerbangan'),(r"TENUN",'seni_rupa'),(r"PENGEMASAN|KAYU",'teknik_industri')]
def classify_final(raw):
    s=strip_campus(raw)
    if re.match(r"^KEBIJAKAN PENDIDIKAN",s): return (None,'edu:TEKNOLOGI PENDIDIKAN')
    f,e=classify(s)
    if f=='seni_rupa' and 'DESAIN' in s: f='desain'
    if f=='teknik_lain':
        t=re.sub(r"^(PENDIDIKAN|TADRIS)\s+",'',s); g=None
        for a,r in _EXTRA:
            if re.search(r,t): g=a; break
        if not g:
            for a,r in FAMRE:
                if a!='teknik_lain' and r.search(t): g=a; break
        if g: f=g
    for r,a in _OV:
        if re.search(r,s):
            if not (a=='desain' and s.startswith('PENDIDIKAN') and f=='seni_rupa'): f=a
            break
    if re.search(r"TEKNIK KIMIA|TEKNOLOGI KIMIA|BIOPROSES|KIMIA INDUSTRI|PETROKIMIA|POLIMER",s): f='teknik_kimia'
    elif re.search(r"TEKNIK BIOMEDI|REKAYASA BIOMEDI",s): f='teknik_fisika'
    return f,e

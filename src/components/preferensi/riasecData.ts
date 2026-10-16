export interface RiasecQuestion {
  id: string; // "IP01" .. "IP30"
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  typeName: string;
  text: string;
}

export const RIASEC_QUESTIONS: RiasecQuestion[] = [
  // Realistic (R)
  {
    id: 'IP01',
    type: 'R',
    typeName: 'Realistic',
    text: 'Merakit komputer atau memperbaiki barang elektronik yang rusak.',
  },
  {
    id: 'IP02',
    type: 'R',
    typeName: 'Realistic',
    text: 'Memperbaiki mesin motor atau peralatan mekanik rumah tangga.',
  },
  {
    id: 'IP03',
    type: 'R',
    typeName: 'Realistic',
    text: 'Mengoperasikan perkakas teknik atau alat ukur di lapangan.',
  },
  {
    id: 'IP04',
    type: 'R',
    typeName: 'Realistic',
    text: 'Membangun rak atau prakarya fisik dari kayu dan logam.',
  },
  {
    id: 'IP05',
    type: 'R',
    typeName: 'Realistic',
    text: 'Mengurus tanaman di kebun atau merawat sistem hidroponik.',
  },

  // Investigative (I)
  {
    id: 'IP06',
    type: 'I',
    typeName: 'Investigative',
    text: 'Meneliti zat kimia atau mengamati spesimen biologi di laboratorium.',
  },
  {
    id: 'IP07',
    type: 'I',
    typeName: 'Investigative',
    text: 'Menganalisis teka-teki logika atau memecahkan soal matematika rumit.',
  },
  {
    id: 'IP08',
    type: 'I',
    typeName: 'Investigative',
    text: 'Mempelajari cara kerja sistem organ tubuh dan virus penyakit.',
  },
  {
    id: 'IP09',
    type: 'I',
    typeName: 'Investigative',
    text: 'Menulis kode program / algoritma untuk menyelesaikan persoalan data.',
  },
  {
    id: 'IP10',
    type: 'I',
    typeName: 'Investigative',
    text: 'Membaca artikel ilmiah tentang sains alam, astronomi, atau fisika.',
  },

  // Artistic (A)
  {
    id: 'IP11',
    type: 'A',
    typeName: 'Artistic',
    text: 'Menggambar sketsa karakter, komik, atau membuat poster visual.',
  },
  {
    id: 'IP12',
    type: 'A',
    typeName: 'Artistic',
    text: 'Menulis cerita fiksi, puisi bebas, atau skenario video pendek.',
  },
  {
    id: 'IP13',
    type: 'A',
    typeName: 'Artistic',
    text: 'Memainkan instrumen musik, bernyanyi, atau mengaransemen lagu.',
  },
  {
    id: 'IP14',
    type: 'A',
    typeName: 'Artistic',
    text: 'Mengedit video kreatif dengan transisi visual dan efek khusus.',
  },
  {
    id: 'IP15',
    type: 'A',
    typeName: 'Artistic',
    text: 'Mendesain tata letak ruangan, panggung teater, atau rancangan busana.',
  },

  // Social (S)
  {
    id: 'IP16',
    type: 'S',
    typeName: 'Social',
    text: 'Mengajari teman sekelas materi pelajaran yang belum mereka pahami.',
  },
  {
    id: 'IP17',
    type: 'S',
    typeName: 'Social',
    text: 'Menjadi relawan aktif dalam kegiatan bakti sosial kemanusiaan.',
  },
  {
    id: 'IP18',
    type: 'S',
    typeName: 'Social',
    text: 'Mendengarkan curhat dan memberi saran empati kepada teman yang bingung.',
  },
  {
    id: 'IP19',
    type: 'S',
    typeName: 'Social',
    text: 'Melatih atau membimbing adik kelas dalam ekstrakurikuler sekolah.',
  },
  {
    id: 'IP20',
    type: 'S',
    typeName: 'Social',
    text: 'Membantu merawat orang sakit atau memberikan pertolongan pertama (PMR).',
  },

  // Enterprising (E)
  {
    id: 'IP21',
    type: 'E',
    typeName: 'Enterprising',
    text: 'Memulai usaha jualan online atau mempromosikan produk ke orang lain.',
  },
  {
    id: 'IP22',
    type: 'E',
    typeName: 'Enterprising',
    text: 'Memimpin kepanitiaan festival sekolah dan mengoordinasikan tim.',
  },
  {
    id: 'IP23',
    type: 'E',
    typeName: 'Enterprising',
    text: 'Mencari dan menegosiasikan kerja sama sponsor untuk acara sekolah.',
  },
  {
    id: 'IP24',
    type: 'E',
    typeName: 'Enterprising',
    text: 'Berbicara di depan publik untuk meyakinkan audiens terhadap suatu ide.',
  },
  {
    id: 'IP25',
    type: 'E',
    typeName: 'Enterprising',
    text: 'Merancang rencana kampanye promosi di media sosial agar viral.',
  },

  // Conventional (C)
  {
    id: 'IP26',
    type: 'C',
    typeName: 'Conventional',
    text: 'Mencatat pembukuan uang kas kelas dan menyusun laporan nota keuangan.',
  },
  {
    id: 'IP27',
    type: 'C',
    typeName: 'Conventional',
    text: 'Mengarsipkan file dokumen penting ke dalam folder yang rapi dan teratur.',
  },
  {
    id: 'IP28',
    type: 'C',
    typeName: 'Conventional',
    text: 'Memeriksa kembali tabel data angka untuk memastikan tidak ada kekeliruan.',
  },
  {
    id: 'IP29',
    type: 'C',
    typeName: 'Conventional',
    text: 'Menyusun jadwal kegiatan mingguan yang runut dan disiplin mengikutinya.',
  },
  {
    id: 'IP30',
    type: 'C',
    typeName: 'Conventional',
    text: 'Menghitung stok persediaan barang logistik dan mencatat inventaris.',
  },
];

export const RIASEC_SCALE_OPTIONS = [
  { value: 0, label: 'Sangat Tidak Suka', emoji: '😖', color: '#EA4335' },
  { value: 1, label: 'Tidak Suka', emoji: '🙁', color: '#FBBC05' },
  { value: 2, label: 'Netral', emoji: '😐', color: '#9CA3AF' },
  { value: 3, label: 'Suka', emoji: '🙂', color: '#34A853' },
  { value: 4, label: 'Sangat Suka', emoji: '🤩', color: '#4285F4' },
];

export const RIASEC_3_OPTIONS = [
  { value: 1, label: 'Sangat tidak suka', icon: 'close' },
  { value: 3, label: 'Ragu', icon: 'info' },
  { value: 5, label: 'Sangat suka', icon: 'check' },
];

export const MAPEL_PILIHAN_TKA_OPTIONS = [
  'Fisika',
  'Kimia',
  'Biologi',
  'Informatika',
  'Matematika Tingkat Lanjut',
  'Ekonomi',
  'Geografi',
  'Sosiologi',
  'Antropologi',
  'Bahasa dan Sastra Indonesia',
  'Bahasa dan Sastra Inggris',
];

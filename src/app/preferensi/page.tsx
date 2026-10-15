import { redirect } from 'next/navigation';

export default function PreferensiIndexPage() {
  // Pengalihan default rute /preferensi ke /preferensi/minat
  redirect('/preferensi/minat');
}

const labels: Record<string, string> = {
  "Materi Saya": "Koleksi Materi",
  "Mulai Belajar": "Lanjut Belajar",
};

export function pageLabel(page: string) {
  return labels[page] ?? page;
}

export const formatDateID = (value: string) => {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const formatRupiah = (value: number, noLabel?: boolean) => {
  if (value == null) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', noLabel ? {} : {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
}

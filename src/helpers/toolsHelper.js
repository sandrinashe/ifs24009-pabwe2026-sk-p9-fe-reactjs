// Dialog SweetAlert2 (dimuat malas agar halaman publik tetap ringan) & format tanggal.
let swalPromise
const loadSwal = () => (swalPromise ??= import('sweetalert2').then((m) => m.default))

const brand = { confirmButtonColor: '#821545', cancelButtonColor: '#6a4757' }

export async function showToast(message, icon = 'success') {
  const Swal = await loadSwal()
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
  })
}

export async function showAlert(title, text, icon = 'error') {
  const Swal = await loadSwal()
  return Swal.fire({ title, text, icon, ...brand })
}

/** Dialog konfirmasi; mengembalikan true bila pengguna menyetujui. */
export async function confirmDialog(title, text, confirmText = 'Ya, lanjutkan') {
  const Swal = await loadSwal()
  const res = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    ...brand,
  })
  return Boolean(res.isConfirmed)
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

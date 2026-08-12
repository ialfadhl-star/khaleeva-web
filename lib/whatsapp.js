export function formatIDR(n) {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

export function buildOrderWaMessage(order) {
  const lines = [];
  lines.push('Halo Khaleeva! Saya mau konfirmasi pesanan:');
  lines.push('');
  lines.push(`No. Pesanan: ${order.orderNumber}`);
  order.items.forEach((it, i) => {
    const variant = [it.color, it.size].filter(Boolean).join(', ');
    lines.push(`${i + 1}. ${it.name}${variant ? ` (${variant})` : ''} x${it.qty} — ${formatIDR(it.price * it.qty)}`);
  });
  lines.push('');
  lines.push(`Subtotal: ${formatIDR(order.subtotal)}`);
  lines.push(`Ongkir (${order.shippingMethod}): ${formatIDR(order.shippingCost)}`);
  lines.push(`Total: ${formatIDR(order.total)}`);
  lines.push('');
  lines.push(`Nama: ${order.customerName}`);
  lines.push(`Alamat: ${order.address}, ${order.city}`);
  lines.push(`No. HP: ${order.phone}`);
  if (order.notes) lines.push(`Catatan: ${order.notes}`);
  lines.push('');
  lines.push('Mohon info cara pembayarannya ya. Terima kasih!');
  return lines.join('\n');
}

export function buildWaLink(phoneNumber, message) {
  const digits = String(phoneNumber || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildResiWaMessage(order) {
  const lines = [];
  lines.push(`Halo ${order.customerName}, pesanan kamu (${order.orderNumber}) sudah dikirim!`);
  lines.push('');
  if (order.courier) lines.push(`Kurir: ${order.courier}`);
  if (order.resi) lines.push(`No. Resi: ${order.resi}`);
  lines.push('');
  lines.push('Terima kasih sudah belanja di Khaleeva 🤍');
  return lines.join('\n');
}

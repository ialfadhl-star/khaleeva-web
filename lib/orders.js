import { db, genOrderNumber, plain, plainAll } from './db';
import { decrementStock } from './products';

export function createOrder({
  customerName,
  phone,
  address,
  city,
  notes = '',
  shippingMethod = 'Reguler (JNE/J&T)',
  shippingCost = 0,
  items = [],
}) {
  if (!items.length) throw new Error('Keranjang kosong.');

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + Number(shippingCost || 0);
  let orderNumber = genOrderNumber();
  while (db.prepare('SELECT id FROM "Order" WHERE orderNumber = ?').get(orderNumber)) {
    orderNumber = genOrderNumber();
  }

  const insertOrder = db.prepare(`
    INSERT INTO "Order" (orderNumber, customerName, phone, address, city, notes, shippingMethod, shippingCost, subtotal, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = insertOrder.run(
    orderNumber,
    customerName,
    phone,
    address,
    city,
    notes,
    shippingMethod,
    Number(shippingCost) || 0,
    subtotal,
    total
  );

  const insertItem = db.prepare(`
    INSERT INTO OrderItem (orderId, productId, name, color, size, price, qty)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const it of items) {
    insertItem.run(info.lastInsertRowid, it.productId || null, it.name, it.color || '', it.size || '', it.price, it.qty);
    if (it.productId) decrementStock(it.productId, it.qty);
  }

  return getOrderById(info.lastInsertRowid);
}

export function getOrderByNumber(orderNumber) {
  const order = db.prepare('SELECT * FROM "Order" WHERE orderNumber = ?').get(orderNumber);
  if (!order) return null;
  const items = db.prepare('SELECT * FROM OrderItem WHERE orderId = ?').all(order.id);
  return { ...plain(order), items: plainAll(items) };
}

export function getOrderById(id) {
  const order = db.prepare('SELECT * FROM "Order" WHERE id = ?').get(Number(id));
  if (!order) return null;
  const items = db.prepare('SELECT * FROM OrderItem WHERE orderId = ?').all(order.id);
  return { ...plain(order), items: plainAll(items) };
}

export function listOrders() {
  const orders = db.prepare('SELECT * FROM "Order" ORDER BY createdAt DESC').all();
  const itemStmt = db.prepare('SELECT * FROM OrderItem WHERE orderId = ?');
  return orders.map((o) => ({ ...plain(o), items: plainAll(itemStmt.all(o.id)) }));
}

export function updateOrder(id, data) {
  const existing = getOrderById(id);
  if (!existing) return null;
  db.prepare(`
    UPDATE "Order" SET status = ?, resi = ?, courier = ?, updatedAt = datetime('now')
    WHERE id = ?
  `).run(
    data.status ?? existing.status,
    data.resi ?? existing.resi,
    data.courier ?? existing.courier,
    Number(id)
  );
  return getOrderById(id);
}

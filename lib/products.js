import { db, rowToProduct } from './db';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function listProducts({ activeOnly = false, category = null } = {}) {
  let sql = 'SELECT * FROM Product WHERE 1=1';
  const params = [];
  if (activeOnly) sql += ' AND active = 1';
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY createdAt DESC';
  const rows = db.prepare(sql).all(...params);
  return rows.map(rowToProduct);
}

export function listFeatured(limit = 4) {
  const rows = db
    .prepare('SELECT * FROM Product WHERE active = 1 AND featured = 1 ORDER BY createdAt DESC LIMIT ?')
    .all(limit);
  return rows.map(rowToProduct);
}

export function getProductBySlug(slug) {
  const row = db.prepare('SELECT * FROM Product WHERE slug = ?').get(slug);
  return rowToProduct(row);
}

export function getProductById(id) {
  const row = db.prepare('SELECT * FROM Product WHERE id = ?').get(Number(id));
  return rowToProduct(row);
}

export function listCategories() {
  const rows = db
    .prepare('SELECT DISTINCT category FROM Product WHERE active = 1 ORDER BY category')
    .all();
  return rows.map((r) => r.category);
}

function uniqueSlug(base) {
  let slug = slugify(base) || 'produk';
  let i = 1;
  while (db.prepare('SELECT id FROM Product WHERE slug = ?').get(slug)) {
    i += 1;
    slug = `${slugify(base)}-${i}`;
  }
  return slug;
}

export function createProduct(data) {
  const slug = uniqueSlug(data.name);
  const stmt = db.prepare(`
    INSERT INTO Product (slug, name, category, price, description, material, sizeGuide, colors, sizes, stock, image, tone, featured, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    slug,
    data.name,
    data.category,
    Number(data.price) || 0,
    data.description || '',
    data.material || '',
    data.sizeGuide || '',
    data.colors || '',
    data.sizes || '',
    Number(data.stock) || 0,
    data.image || '',
    data.tone || 't1',
    data.featured ? 1 : 0,
    data.active === false ? 0 : 1
  );
  return getProductById(info.lastInsertRowid);
}

export function updateProduct(id, data) {
  const existing = getProductById(id);
  if (!existing) return null;
  const stmt = db.prepare(`
    UPDATE Product SET
      name = ?, category = ?, price = ?, description = ?, material = ?, sizeGuide = ?,
      colors = ?, sizes = ?, stock = ?, image = ?, tone = ?, featured = ?, active = ?,
      updatedAt = datetime('now')
    WHERE id = ?
  `);
  stmt.run(
    data.name ?? existing.name,
    data.category ?? existing.category,
    data.price !== undefined ? Number(data.price) : existing.price,
    data.description ?? existing.description,
    data.material ?? existing.material,
    data.sizeGuide ?? existing.sizeGuide,
    data.colors ?? existing.colors,
    data.sizes ?? existing.sizes,
    data.stock !== undefined ? Number(data.stock) : existing.stock,
    data.image ?? existing.image,
    data.tone ?? existing.tone,
    data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0),
    data.active !== undefined ? (data.active ? 1 : 0) : (existing.active ? 1 : 0),
    Number(id)
  );
  return getProductById(id);
}

export function deleteProduct(id) {
  db.prepare('DELETE FROM Product WHERE id = ?').run(Number(id));
}

export function decrementStock(productId, qty) {
  db.prepare('UPDATE Product SET stock = MAX(0, stock - ?) WHERE id = ?').run(qty, productId);
}

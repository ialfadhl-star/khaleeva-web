CREATE TABLE IF NOT EXISTS Product (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price       INTEGER NOT NULL,
  description TEXT DEFAULT '',
  material    TEXT DEFAULT '',
  sizeGuide   TEXT DEFAULT '',
  colors      TEXT DEFAULT '',
  sizes       TEXT DEFAULT '',
  stock       INTEGER DEFAULT 0,
  image       TEXT DEFAULT '',
  tone        TEXT DEFAULT 't1',
  featured    INTEGER DEFAULT 0,
  active      INTEGER DEFAULT 1,
  createdAt   TEXT DEFAULT (datetime('now')),
  updatedAt   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "Order" (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  orderNumber    TEXT UNIQUE NOT NULL,
  customerName   TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  city           TEXT NOT NULL,
  notes          TEXT DEFAULT '',
  shippingMethod TEXT DEFAULT 'Reguler (JNE/J&T)',
  shippingCost   INTEGER DEFAULT 0,
  subtotal       INTEGER NOT NULL,
  total          INTEGER NOT NULL,
  status         TEXT DEFAULT 'Menunggu Konfirmasi',
  resi           TEXT DEFAULT '',
  courier        TEXT DEFAULT '',
  createdAt      TEXT DEFAULT (datetime('now')),
  updatedAt      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS OrderItem (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId   INTEGER NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  productId INTEGER REFERENCES Product(id),
  name      TEXT NOT NULL,
  color     TEXT DEFAULT '',
  size      TEXT DEFAULT '',
  price     INTEGER NOT NULL,
  qty       INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Setting (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS AdminSession (
  token     TEXT PRIMARY KEY,
  createdAt TEXT DEFAULT (datetime('now')),
  expiresAt TEXT NOT NULL
);

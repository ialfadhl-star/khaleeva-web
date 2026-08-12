import { db } from './db';

const DEFAULTS = {
  whatsapp_number: '628123456789',
  site_domain: 'khaleeva.id',
  announcement: 'Gratis Ongkir Jabodetabek — Min. Belanja Rp300.000',
  shipping_reguler_cost: '20000',
  shipping_instant_cost: '50000',
  free_shipping_min: '300000',
  bank_name: 'BCA',
  bank_account_number: '1234567890',
  bank_account_holder: 'Khaleeva Indonesia',
};

export function getSetting(key) {
  const row = db.prepare('SELECT value FROM Setting WHERE key = ?').get(key);
  return row ? row.value : DEFAULTS[key] ?? '';
}

export function getAllSettings() {
  const rows = db.prepare('SELECT key, value FROM Setting').all();
  const map = { ...DEFAULTS };
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export function setSetting(key, value) {
  db.prepare(
    `INSERT INTO Setting (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, String(value));
}

export function setSettings(obj) {
  for (const [k, v] of Object.entries(obj)) setSetting(k, v);
}

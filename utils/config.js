// backend/utils/config.js
const fs = require('fs');
const path = require('path');

const dataDir = process.env.BACKEND_DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const cfgPath = path.join(dataDir, 'printer.json');

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  } catch {
    return { host: '192.168.1.50', port: 9100 }; // valores por defecto
  }
}

function writeConfig(next) {
  fs.writeFileSync(cfgPath, JSON.stringify(next, null, 2), 'utf-8');
}

module.exports = { readConfig, writeConfig, cfgPath };

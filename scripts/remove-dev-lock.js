const fs = require('fs');
const path = require('path');
const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
try {
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
    console.log('Alte Lock-Datei entfernt.');
  }
} catch (_) {}

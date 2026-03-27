const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Lock-Datei entfernen (falls vorhanden)
const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
try {
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
    console.log('Alte Lock-Datei entfernt.');
  }
} catch (_) {}

// next dev starten (ohne npm/npx PATH-Abhängigkeiten)
const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const next = spawn(process.execPath, [nextBin, 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

next.on('error', (err) => {
  console.error('Fehler beim Start:', err.message);
  process.exit(1);
});

next.on('exit', (code) => {
  process.exit(code ?? 0);
});

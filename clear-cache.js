const fs = require('fs');
const path = require('path');
function clearDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      clearDir(full);
      try { fs.rmdirSync(full); } catch(e) {}
    } else {
      fs.unlinkSync(full);
    }
  }
}
clearDir(path.join(__dirname, '.next'));
console.log('Cache cleared');

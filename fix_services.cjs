const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');

const files = fs.readdirSync(servicesDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace { id: item.id, ...(item.data() as Article) }
    // with { ...(item.data() as Article), id: item.id }
    content = content.replace(/\{\s*id:\s*([^,]+),\s*\.\.\.([^}]+)\}/g, '{ ...$2, id: $1 }');

    // Same for uid
    content = content.replace(/\{\s*uid:\s*([^,]+),\s*\.\.\.([^}]+)\}/g, '{ ...$2, uid: $1 }');

    // Same for slug
    content = content.replace(/\{\s*slug:\s*([^,]+),\s*\.\.\.([^}]+)\}/g, '{ ...$2, slug: $1 }');

    fs.writeFileSync(filePath, content);
  }
});
console.log('Services fixed');

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'public', 'assets', 'manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      return res.status(200).json(data);
    } catch(e) {}
  }
  
  res.status(200).json({ photos: [], songs: [] });
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { filename, base64Data } = req.body || {};
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetName = `${Date.now()}_${safeName}`;
    const relPath = `public/assets/audio/${targetName}`;

    res.status(200).json({
      success: true,
      path: relPath
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

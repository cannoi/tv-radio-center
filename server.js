const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const defaultChannels = [
  { id: 'nasa-tv', name: 'NASA TV HD', type: 'tv', category: 'News', url: 'https://ntv1.akamaized.net/hls/live/2014756/NASA-TV-HD-1/master.m3u8' },
  { id: 'france24', name: 'France 24 English', type: 'tv', category: 'News', url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8' },
  { id: 'bloomberg', name: 'Bloomberg Television', type: 'tv', category: 'News', url: 'https://live-bloomberg-par.rakuten.tv/index.m3u8' },
  { id: 'redbull', name: 'Red Bull TV', type: 'tv', category: 'Sports', url: 'https://rbmn-live.akamaized.net/hls/live/590964/redbulltv-app/master.m3u8' },
  { id: 'jazz24', name: 'Jazz24 (MP3)', type: 'radio', category: 'Music', url: 'https://ice5.securenetsystems.net/JAZZ24' },
  { id: 'fip', name: 'FIP Radio Paris', type: 'radio', category: 'Music', url: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { id: 'bbc-ws', name: 'BBC World Service', type: 'radio', category: 'News', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' }
];

let customChannels = [];

app.get('/api/channels', (req, res) => {
  res.json({ channels: [...defaultChannels, ...customChannels] });
});

app.post('/api/channels', (req, res) => {
  const { name, type, category, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }
  const newChannel = {
    id: 'custom-' + Date.now(),
    name,
    type: type || 'radio',
    category: category || 'Music',
    url
  };
  customChannels.push(newChannel);
  res.json({ success: true, channel: newChannel });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (!module.parent) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

module.exports = app;

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dataPath = path.join(__dirname, 'data.json');

function readData() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all data
app.get('/data', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save entire data object
app.post('/data', (req, res) => {
  try {
    const newData = req.body;
    writeData(newData);
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// Serve static files for the admin panel
app.use(express.static(path.join(__dirname, 'admin')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
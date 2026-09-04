require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Crucial: Exposes the uploads folder so Next.js can render the images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
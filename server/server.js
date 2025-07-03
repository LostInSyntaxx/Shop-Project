const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { readdirSync } = require('fs');
const path = require('path');
const { success, debug } = require('./utils/logger');


const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));


readdirSync(path.join(__dirname, 'routes')).map((file) => {
    const route = require('./routes/' + file);
    app.use('/api', route);
    success(`Route loaded: /api/${file}`);
});


app.listen(3000, () => {
    success('🚀 Server is running on http://localhost:3000');
});


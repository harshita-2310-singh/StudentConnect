require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());          
app.use(express.static('public')); 

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/itemRoute'));

// Pages (Views)
const page = (file) => (req, res) =>
  res.sendFile(path.join(__dirname, 'views', file));

app.get('/', page('market.html'));
app.get('/login', page('login.html'));
app.get('/register', page('register.html'));
app.get('/post-item', page('post-item.html'));
app.get('/profile', page('profile.html'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
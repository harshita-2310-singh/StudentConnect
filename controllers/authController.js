const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, email, password, collegeId } = req.body;

  if (!name || !email || !password || !collegeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (User.findByEmail(email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10); 
  User.create({ name, email, password: hashedPassword, collegeId });

  res.status(201).json({ message: 'Registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'Login successful', token });
};
exports.getProfile = (req, res) => {
  const user = User.findById(req.userId);
  res.json({ id: user.id, name: user.name, email: user.email, collegeId: user.collegeId });
};
exports.updateProfile = (req, res) => {
  const { name, collegeId } = req.body;
  const user = User.update(req.userId, { name, collegeId });
  res.json({ id: user.id, name: user.name, email: user.email, collegeId: user.collegeId });
};
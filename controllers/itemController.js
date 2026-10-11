const Item = require('../models/item');
const User = require('../models/user');


exports.createItem = (req, res) => {
  const { name, category, price, condition, description, location, imageUrl } = req.body;

  if (!name || !category || !price || !condition) {
    return res.status(400).json({ message: 'Name, category, price and condition are required' });
  }

  const seller = User.findById(req.userId);
  const item = Item.create({
    name, category, price: Number(price), condition,
    description, location, imageUrl,
    sellerId: req.userId,
    sellerName: seller.name,
  });
  res.status(201).json(item);
};

exports.getItems = (req, res) => {
  const { search, category, condition, minPrice, maxPrice } = req.query;

  let items = Item.getAll().filter((i) => i.status === 'active');

  if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  if (category) items = items.filter((i) => i.category === category);
  if (condition) items = items.filter((i) => i.condition === condition);
  if (minPrice) items = items.filter((i) => i.price >= Number(minPrice));
  if (maxPrice) items = items.filter((i) => i.price <= Number(maxPrice));

  res.json(items);
};

exports.getMyItems = (req, res) => {
  res.json(Item.getAll().filter((i) => i.sellerId === req.userId));
};

exports.updateItem = (req, res) => {
  const item = Item.findById(Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.sellerId !== req.userId) return res.status(403).json({ message: 'Not your item' });

  const { name, category, price, condition, description, location, imageUrl } = req.body;
  res.json(Item.update(item.id, { name, category, price: Number(price), condition, description, location, imageUrl }));
};

exports.updateStatus = (req, res) => {
  const item = Item.findById(Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.sellerId !== req.userId) return res.status(403).json({ message: 'Not your item' });

  res.json(Item.update(item.id, { status: req.body.status }));
};
exports.deleteItem = (req, res) => {
  const item = Item.findById(Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.sellerId !== req.userId) return res.status(403).json({ message: 'Not your item' });

  Item.remove(item.id);
  res.json({ message: 'Item deleted' });
};
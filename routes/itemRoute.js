const express = require('express');
const router = express.Router();
const item = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

router.get('/', item.getItems);                      
router.get('/my', protect, item.getMyItems);          
router.post('/', protect, item.createItem);
router.put('/:id', protect, item.updateItem);
router.patch('/:id/status', protect, item.updateStatus);
router.delete('/:id', protect, item.deleteItem);

module.exports = router;
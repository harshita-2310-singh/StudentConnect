const items = [];
let nextId = 1;

const Item = {
  create(data) {
    const item = { id: nextId++, status: 'active', ...data };
    items.push(item);
    return item;
  },
  getAll() {
    return items;
  },
  findById(id) {
    return items.find((i) => i.id === id);
  },
  update(id, data) {
    const item = items.find((i) => i.id === id);
    if (item) Object.assign(item, data);
    return item;
  },
  remove(id) {
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) items.splice(index, 1);
  },
};

module.exports = Item;
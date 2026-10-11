
const users = [];
let nextId = 1;

const User = {
  create(data) {
    const user = { id: nextId++, ...data };
    users.push(user);
    return user;
  },
  findByEmail(email) {
    return users.find((u) => u.email === email);
  },
  findById(id) {
    return users.find((u) => u.id === id);
  },
  update(id, data) {
    const user = users.find((u) => u.id === id);
    if (user) Object.assign(user, data);
    return user;
  },
};

module.exports = User;
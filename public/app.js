// ---------- Helpers ----------
const token = localStorage.getItem('token');

// One function for all API calls. It attaches the JWT automatically.
async function api(url, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Stops user text from being treated as HTML
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// Pages marked data-protected need a login
if (document.body.dataset.protected && !token) {
  window.location.href = '/login';
}

// ---------- Register ----------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { ok, data } = await api('/api/auth/register', 'POST', {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      collegeId: document.getElementById('collegeId').value,
    });
    if (ok) window.location.href = '/login';
    else document.getElementById('message').textContent = data.message;
  });
}

// ---------- Login ----------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { ok, data } = await api('/api/auth/login', 'POST', {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    });
    if (ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      document.getElementById('message').textContent = data.message;
    }
  });
}

// ---------- Marketplace ----------
async function loadItems() {
  const params = new URLSearchParams({
    search: document.getElementById('search').value,
    category: document.getElementById('category').value,
    condition: document.getElementById('condition').value,
    minPrice: document.getElementById('minPrice').value,
    maxPrice: document.getElementById('maxPrice').value,
  });
  const { data } = await api('/api/items?' + params.toString());

  const grid = document.getElementById('itemGrid');
  if (data.length === 0) {
    grid.innerHTML = '<p>No items found.</p>';
    return;
  }
  grid.innerHTML = data.map((item) => `
    <div class="card">
      <img src="${esc(item.imageUrl) || ''}" alt="item">
      <h3>${esc(item.name)}</h3>
      <p class="price">Rs. ${item.price}</p>
      <p>${esc(item.condition)} | ${esc(item.location)}</p>
      <p>Seller: ${esc(item.sellerName)}</p>
      <span class="badge">${esc(item.status)}</span>
    </div>`).join('');
}

if (document.getElementById('itemGrid')) {
  loadItems();
  // Show Login or Logout depending on login state
  document.getElementById('loginLink').style.display = token ? 'none' : 'inline';
  document.getElementById('logoutLink').style.display = token ? 'inline' : 'none';
}

// ---------- Post Item ----------
const itemForm = document.getElementById('itemForm');
if (itemForm) {
  itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { ok, data } = await api('/api/items', 'POST', {
      name: document.getElementById('name').value,
      category: document.getElementById('category').value,
      price: document.getElementById('price').value,
      condition: document.getElementById('condition').value,
      description: document.getElementById('description').value,
      location: document.getElementById('location').value,
      imageUrl: document.getElementById('imageUrl').value,
    });
    if (ok) window.location.href = '/';
    else document.getElementById('message').textContent = data.message;
  });
}

// ---------- Profile ----------
async function loadProfile() {
  const { data } = await api('/api/auth/profile');
  document.getElementById('profileEmail').textContent = data.email;
  document.getElementById('name').value = data.name;
  document.getElementById('collegeId').value = data.collegeId;
}

async function loadMyItems() {
  const { data } = await api('/api/items/my');
  const box = document.getElementById('myItems');
  if (data.length === 0) {
    box.innerHTML = '<p>You have not posted anything yet.</p>';
    return;
  }
  box.innerHTML = data.map((item) => `
    <div class="card">
      <img src="${esc(item.imageUrl) || ''}" alt="item">
      <h3>${esc(item.name)}</h3>
      <p class="price">Rs. ${item.price}</p>
      <select onchange="changeStatus(${item.id}, this.value)">
        <option value="active" ${item.status === 'active' ? 'selected' : ''}>Active</option>
        <option value="inactive" ${item.status === 'inactive' ? 'selected' : ''}>Inactive</option>
        <option value="sold" ${item.status === 'sold' ? 'selected' : ''}>Sold</option>
      </select>
      <button onclick="deleteItem(${item.id})">Delete</button>
    </div>`).join('');
}

async function changeStatus(id, status) {
  await api('/api/items/' + id + '/status', 'PATCH', { status });
  loadMyItems();
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  await api('/api/items/' + id, 'DELETE');
  loadMyItems();
}

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  loadProfile();
  loadMyItems();
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { ok } = await api('/api/auth/profile', 'PUT', {
      name: document.getElementById('name').value,
      collegeId: document.getElementById('collegeId').value,
    });
    document.getElementById('message').textContent = ok ? 'Profile updated' : 'Update failed';
  });
}
import './style.css';
import { allProducts, whatsappNumber } from './product-data.js';

let filteredProducts = [];
let currentFilter = 'all';
let currentSort = 'newest';
let selectedProduct = null;

function openOrderModal(product) {
  selectedProduct = product;
  const modal = document.getElementById('order-modal');
  const productInfo = document.getElementById('modal-product-info');

  productInfo.innerHTML = `
    <div class="modal-product-name">${product.name}</div>
    <div class="modal-product-price">${formatPrice(product.price)}</div>
  `;

  document.getElementById('quantity').value = 1;
  updateOrderTotal();
  modal.classList.add('active');
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  modal.classList.remove('active');
  document.getElementById('order-form').reset();
  selectedProduct = null;
}

function updateOrderTotal() {
  if (!selectedProduct) return;
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  const total = selectedProduct.price * quantity;
  document.getElementById('order-total').textContent = formatPrice(total);
}

// Fungsi ini sekarang akan mengirim data ke WhatsApp
function submitOrder(e) {
  e.preventDefault();
  if (!selectedProduct) return;

  const customerName = document.getElementById('customer-name').value;
  const customerEmail = document.getElementById('customer-email').value;
  const customerPhone = document.getElementById('customer-phone').value;
  const customerAddress = document.getElementById('customer-address').value;
  const quantity = document.getElementById('quantity').value;
  const notes = document.getElementById('order-notes').value;
  const total = selectedProduct.price * parseInt(quantity);

  const message = `Halo Ether Craft, saya ingin memesan:\n\n` +
                  `*Produk:* ${selectedProduct.name}\n` +
                  `*Jumlah:* ${quantity}\n` +
                  `*Total Harga:* ${formatPrice(total)}\n\n` +
                  `*Detail Penerima:*\n` +
                  `Nama: ${customerName}\n` +
                  `Email: ${customerEmail}\n` +
                  `Telepon: ${customerPhone}\n` +
                  `Alamat: ${customerAddress}\n\n` +
                  `*Catatan:* ${notes || '-'}\n\n` +
                  `Mohon diproses, terima kasih!`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  closeOrderModal();
}

function setupModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  const closeBtn = document.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeOrderModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeOrderModal();
    }
  });

  document.getElementById('quantity').addEventListener('input', updateOrderTotal);
  document.getElementById('order-form').addEventListener('submit', submitOrder);
}


// --- FUNGSI-FUNGSI YANG DIMODIFIKASI ---

function createProductCard(product) {
  // Mengubah dari <a> ke <button>
  return `
    <div class="product-card" data-category="${product.category}">
      <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <button class="btn btn-primary order-btn" data-product-id="${product.id}">
          Order Now
        </button>
      </div>
    </div>
  `;
}

function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  const countText = document.getElementById('product-count-text');
  if (!grid || !countText) return;

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found.</div>';
    countText.textContent = '0 products';
    return;
  }

  countText.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
  grid.innerHTML = products.map(product => createProductCard(product)).join('');

  // Menambahkan event listener ke setiap tombol "Order Now" yang baru dibuat
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        openOrderModal(product);
      }
    });
  });
}

// --- FUNGSI LAINNYA (TETAP SAMA) ---

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(price);
}

function filterProducts(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeButton = document.querySelector(`[data-filter="${category}"]`);
  if (activeButton) activeButton.classList.add('active');
  filteredProducts = category === 'all' ? [...allProducts] : allProducts.filter(p => p.category === category);
  sortProducts(currentSort);
}

function sortProducts(sortBy) {
  currentSort = sortBy;
  let sorted = [...filteredProducts];
  switch (sortBy) {
    case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
    case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
  }
  displayProducts(sorted);
}

function setupNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
}

function setupProductPage() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.filter;
    });
  });
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => sortProducts(e.target.value));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupProductPage();
  setupModal(); // Panggil fungsi setup untuk modal

  const handleHashChange = () => {
    const category = window.location.hash.substring(1) || 'all';
    filterProducts(category);
  };
  
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
});
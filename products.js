import './style.css';
import { allProducts, whatsappNumber } from './product-data';


let filteredProducts = [];
let currentFilter = 'all';
let currentSort = 'newest';

// Fungsi untuk format harga ke Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Fungsi untuk membuat link WhatsApp
function createWhatsAppLink(product) {
  const message = `Hello, I'm interested in ordering the following product:\n\n*Product:* ${product.name}\n*Price:* ${formatPrice(product.price)}\n\nPlease let me know the next steps. Thank you!`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Fungsi untuk membuat kartu produk
function createProductCard(product) {
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
        <a href="${createWhatsAppLink(product)}" target="_blank" class="btn btn-primary order-btn">
          Order Now
        </a>
      </div>
    </div>
  `;
}

// Fungsi untuk menampilkan produk
function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  const countText = document.getElementById('product-count-text');

  if (!grid || !countText) return;

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found in this category.</div>';
    countText.textContent = '0 products';
    return;
  }

  countText.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
  grid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Fungsi untuk memfilter produk
function filterProducts(category) {
  currentFilter = category;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeButton = document.querySelector(`[data-filter="${category}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  if (category === 'all') {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(p => p.category === category);
  }

  sortProducts(currentSort);
}

// Fungsi untuk mengurutkan produk
function sortProducts(sortBy) {
  currentSort = sortBy;

  let sorted = [...filteredProducts];

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  displayProducts(sorted);
}

// --- Setup Event Listeners ---
function setupNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

function setupProductPage() {
  // Setup filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterProducts(filter);
    });
  });

  // Setup sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortProducts(e.target.value);
    });
  }
  
  // Tampilkan semua produk saat pertama kali halaman dimuat
  filterProducts('all');
}

// Inisialisasi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupProductPage();
});
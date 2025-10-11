import './style.css';

// Nomor WhatsApp untuk tujuan pemesanan
const whatsappNumber = '6281234567890';

// Data produk statis (pengganti Supabase)
const allProducts = [
  // Keycaps
  {
    id: 'keycaps-01',
    name: 'Nekomech Topographic Engraved',
    category: 'keycaps',
    description: 'Elevate your keyboard with this unique set featuring an intricate topographic engraved design with durable PBT material for a premium feel.',
    price: 199000,
    imageUrl: './public/products/nekomech-keycap.jpeg',
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'keycaps-02',
    name: 'Furycube South-facing Contours',
    category: 'keycaps',
    description: 'Illuminate your setup with these futuristic keycaps, designed with translucent legends that are perfect for south-facing RGB keyboards.',
    price: 238900,
    imageUrl: './public/products/furycube-keycap.jpeg',
    createdAt: '2025-09-30T10:00:00Z',
  },
  {
    id: 'keycaps-03',
    name: 'Gundam Unicorn Japanese',
    category: 'keycaps',
    description: 'Showcase your love for mecha anime with this artisan keycap inspired by the iconic Gundam Unicorn, featuring crisp Japanese characters.',
    price: 329000,
    imageUrl: './public/products/gundam-unicorn.jpeg',
    createdAt: '2025-09-29T10:00:00Z',
  },
  // Keyboards
  {
    id: 'keyboard-01',
    name: 'Rexus Heroic KX3',
    category: 'keyboards',
    description: 'A compact 68-key layout with anti-ghosting, dual-tone keycaps, and a detachable USB Type-C cable, perfect for gamers seeking both style and function.',
    price: 290000,
    imageUrl: './public/products/rexus-keyboard.png',
    createdAt: '2025-10-02T10:00:00Z',
  },
  {
    id: 'keyboard-02',
    name: 'Vusign LED Wired Mechanical',
    category: 'keyboards',
    description: 'Features a full-size layout with 7-color LED backlighting, an integrated wrist rest, and multimedia hot-keys for a comfortable experience.',
    price: 219000,
    imageUrl: './public/products/deli-vusign.png',
    createdAt: '2025-09-28T10:00:00Z',
  },
  {
    id: 'keyboard-03',
    name: 'Gamen Titan Pro',
    category: 'keyboards',
    description: 'Built with a durable aluminum frame, a 5-layer gasket structure for quiet typing, and multifunction knob to control RGB lighting and volume.',
    price: 699000,
    imageUrl: './public/products/gamen-titan.png',
    createdAt: '2025-09-27T10:00:00Z',
  },
  // Switches
  {
    id: 'switch-01',
    name: 'Cherry MX Hyperglide',
    category: 'switches',
    description: 'Experience the legendary smoothness of Cherry MX, now upgraded with Hyperglide tooling for reduced friction and enhanced durability.',
    price: 40000,
    imageUrl: './public/products/cherry-mx.png',
    createdAt: '2025-10-03T10:00:00Z',
  },
  {
    id: 'switch-02',
    name: 'C³ Equalz x TKC Tangerine',
    category: 'switches',
    description: 'Famous for their incredibly smooth linear travel and vibrant orange housing. These switches provide a buttery-smooth typing experience.',
    price: 45000,
    imageUrl: './public/products/equalz.png',
    createdAt: '2025-09-26T10:00:00Z',
  },
  {
    id: 'switch-03',
    name: 'Shogoki Tactile',
    category: 'switches',
    description: 'Designed for a satisfying typing feel, these switches offer a sharp and pronounced tactile bump with every keystroke, ensuring precision.',
    price: 39000,
    imageUrl: './public/products/shogoki-switch.png',
    createdAt: '2025-09-25T10:00:00Z',
  },
  // Merchandise
  {
    id: 'stabilizer-01',
    name: 'MoYu.Studios Screw-In',
    category: 'stabilizers',
    description: 'Precision-engineered screw-in stabilizers designed to minimize rattle and provide a consistent feel for your spacebar and modifier keys.',
    price: 780000,
    imageUrl: './public/products/moyu-stabilizer.png',
    createdAt: '2025-09-24T10:00:00Z',
  },
  {
    id: 'stabilizer-02',
    name: 'TX Stabilizer Rev 3.0',
    category: 'stabilizers',
    description: 'The latest revision of the popular TX stabilizers, featuring a patented doubleshot stem for a tighter fit to reduce wobble and unwanted noise.',
    price: 1750000,
    imageUrl: './public/products/tx-stabilizer.webp',
    createdAt: '2025-09-23T10:00:00Z',
  },
  {
    id: 'stabilizer-03',
    name: 'Lubcon Turmotemp II/400',
    category: 'stabilizers',
    description: 'A premium-grade lubricant ideal for stabilizer wires and housings. This grease effectively eliminates rattle and ensures ultra-smooth operation.',
    price: 40000,
    imageUrl: './public/products/lubcon-stabilizer.png',
    createdAt: '2025-09-22T10:00:00Z',
  },
];

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
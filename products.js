import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let allProducts = []
let filteredProducts = []
let currentFilter = 'all'
let currentSort = 'newest'
let selectedProduct = null

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace('IDR', 'Rp')
}

async function loadProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    allProducts = data
    filterProducts(currentFilter)
    loadFeaturedProducts()
  } catch (error) {
    console.error('Error loading products:', error)
    document.getElementById('products-grid').innerHTML =
      '<div class="loading">Failed to load products. Please try again later.</div>'
  }
}

async function loadFeaturedProducts() {
  const featuredGrid = document.getElementById('featured-products')
  const featured = allProducts.filter(p => p.featured).slice(0, 3)

  if (featured.length === 0) {
    featuredGrid.innerHTML = '<div class="loading">No featured products at the moment.</div>'
    return
  }

  featuredGrid.innerHTML = featured.map(product => createProductCard(product)).join('')
  attachOrderButtonListeners()
}

function createProductCard(product) {
  return `
    <div class="product-card" data-category="${product.category}">
      <img src="${product.image_url}" alt="${product.name}" class="product-image" />
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <span class="product-stock">Stock: ${product.stock}</span>
        </div>
        <button class="btn btn-primary order-btn"
                data-product-id="${product.id}"
                ${product.stock === 0 ? 'disabled' : ''}>
          ${product.stock === 0 ? 'Out of Stock' : 'Order Now'}
        </button>
      </div>
    </div>
  `
}

function displayProducts(products) {
  const grid = document.getElementById('products-grid')
  const countText = document.getElementById('product-count-text')

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found in this category.</div>'
    countText.textContent = '0 products'
    return
  }

  countText.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`
  grid.innerHTML = products.map(product => createProductCard(product)).join('')
  attachOrderButtonListeners()
}

function attachOrderButtonListeners() {
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId
      const product = allProducts.find(p => p.id === productId)
      if (product) {
        openOrderModal(product)
      }
    })
  })
}

function filterProducts(category) {
  currentFilter = category

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active')
  })
  document.querySelector(`[data-filter="${category}"]`).classList.add('active')

  if (category === 'all') {
    filteredProducts = [...allProducts]
  } else {
    filteredProducts = allProducts.filter(p => p.category === category)
  }

  sortProducts(currentSort)
}

function sortProducts(sortBy) {
  currentSort = sortBy

  let sorted = [...filteredProducts]

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
  }

  displayProducts(sorted)
}

function openOrderModal(product) {
  selectedProduct = product
  const modal = document.getElementById('order-modal')
  const productInfo = document.getElementById('modal-product-info')

  productInfo.innerHTML = `
    <div class="modal-product-name">${product.name}</div>
    <div class="modal-product-price">${formatPrice(product.price)}</div>
  `

  document.getElementById('quantity').value = 1
  updateOrderTotal()
  modal.classList.add('active')
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal')
  modal.classList.remove('active')
  document.getElementById('order-form').reset()
  selectedProduct = null
}

function updateOrderTotal() {
  if (!selectedProduct) return

  const quantity = parseInt(document.getElementById('quantity').value) || 1
  const total = selectedProduct.price * quantity
  document.getElementById('order-total').textContent = formatPrice(total)
}

async function submitOrder(e) {
  e.preventDefault()

  if (!selectedProduct) return

  const formData = {
    customer_name: document.getElementById('customer-name').value,
    customer_email: document.getElementById('customer-email').value,
    customer_phone: document.getElementById('customer-phone').value,
    customer_address: document.getElementById('customer-address').value,
    product_id: selectedProduct.id,
    quantity: parseInt(document.getElementById('quantity').value),
    total_price: selectedProduct.price * parseInt(document.getElementById('quantity').value),
    notes: document.getElementById('order-notes').value,
    status: 'pending'
  }

  try {
    const submitBtn = e.target.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.textContent = 'Processing...'

    const { data, error } = await supabase
      .from('orders')
      .insert([formData])
      .select()

    if (error) throw error

    alert('Order placed successfully! We will contact you soon.')
    closeOrderModal()

  } catch (error) {
    console.error('Error submitting order:', error)
    alert('Failed to place order. Please try again.')
  } finally {
    const submitBtn = e.target.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = 'Place Order'
    }
  }
}

function setupNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle')
  const navMenu = document.querySelector('.nav-menu')

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active')
  })

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active')
    })
  })
}

function setupModal() {
  const modal = document.getElementById('order-modal')
  const closeBtn = document.querySelector('.modal-close')

  closeBtn.addEventListener('click', closeOrderModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeOrderModal()
    }
  })

  document.getElementById('quantity').addEventListener('input', updateOrderTotal)
  document.getElementById('order-form').addEventListener('submit', submitOrder)
}

function setupProductFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter
      filterProducts(filter)
    })
  })

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortProducts(e.target.value)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation()
  setupProductFilters()
  setupModal()
  loadProducts()
})

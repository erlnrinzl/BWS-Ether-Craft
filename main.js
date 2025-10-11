import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let allProducts = []
let currentFilter = 'all'
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
    displayProducts(allProducts)
  } catch (error) {
    console.error('Error loading products:', error)
    document.getElementById('products-grid').innerHTML =
      '<div class="loading">Failed to load products. Please try again later.</div>'
  }
}

function displayProducts(products) {
  const grid = document.getElementById('products-grid')

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found.</div>'
    return
  }

  grid.innerHTML = products.map(product => `
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
  `).join('')

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
    displayProducts(allProducts)
  } else {
    const filtered = allProducts.filter(p => p.category === category)
    displayProducts(filtered)
  }
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
    if (link.pathname === window.location.pathname) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active')
    })
  })



  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        const offset = 70
        const targetPosition = target.offsetTop - offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  })
}

function setupCustomBuildButton() {
  const customBuildBtn = document.getElementById('custom-build-btn')
  const whatsappNumber = '6281234567890'
  const message = 'Hello! I am interested in your custom keyboard build service.'

  customBuildBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation()
  setupProductFilters()
  setupModal()
  setupCustomBuildButton()
  loadProducts()
})

const faqItems = document.querySelectorAll('.faq-item');
const currentYearNode = document.querySelector('#current-year');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');

  button.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

if (menuToggle && primaryNavigation) {
  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  primaryNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

if (currentYearNode) {
  currentYearNode.textContent = new Date().getFullYear();
}


const goalRange = document.querySelector('#goal-range');
const budgetRange = document.querySelector('#budget-range');
const goalOutput = document.querySelector('#goal-output');
const budgetOutput = document.querySelector('#budget-output');
const sprintOutput = document.querySelector('#sprint-output');
const contentOutput = document.querySelector('#content-output');
const channelOutput = document.querySelector('#channel-output');

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

function updateGrowthEstimate() {
  if (!goalRange || !budgetRange) return;

  const goal = Number(goalRange.value);
  const budget = Number(budgetRange.value);
  const intensity = goal / 5000 + budget / 2500;

  goalOutput.textContent = numberFormatter.format(goal);
  budgetOutput.textContent = currencyFormatter.format(budget);
  contentOutput.textContent = Math.max(8, Math.round(intensity * 6));
  channelOutput.textContent = Math.min(6, Math.max(1, Math.round(intensity / 1.5)));

  if (budget >= 8000 || goal >= 15000) {
    sprintOutput.textContent = 'Scale Partner';
  } else if (budget >= 1750 || goal >= 4000) {
    sprintOutput.textContent = 'Growth Engine';
  } else {
    sprintOutput.textContent = 'Starter Visibility';
  }
}

[goalRange, budgetRange].forEach((range) => {
  if (range) {
    range.addEventListener('input', updateGrowthEstimate);
  }
});

updateGrowthEstimate();


const growthPlanForm = document.querySelector('#growth-plan-form');
const leadFormStatus = document.querySelector('#lead-form-status');

if (growthPlanForm && leadFormStatus) {
  growthPlanForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!growthPlanForm.checkValidity()) {
      growthPlanForm.reportValidity();
      return;
    }

    const formData = new FormData(growthPlanForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const platform = formData.get('platform');
    const budget = formData.get('budget');
    const goal = formData.get('goal');
    const subject = encodeURIComponent(`Growth plan request from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPlatform: ${platform}\nBudget: ${budget}\nGoal: ${goal}`,
    );

    leadFormStatus.textContent = 'Opening your email app with a pre-filled growth plan request. We will reply with a practical roadmap.';
    leadFormStatus.classList.add('is-visible');

    window.location.href = `mailto:hello@instogram.xyz?subject=${subject}&body=${body}`;
  });
}

const productCatalog = [
  {
    category: 'core',
    description: 'Profile optimization, keyword research and weekly content promotion for one platform.',
    id: 'starter',
    name: 'Starter Visibility',
    price: 249,
  },
  {
    category: 'core',
    description: 'Multi-platform promotion with paid social management and creator outreach.',
    id: 'growth',
    name: 'Growth Engine',
    price: 699,
  },
  {
    category: 'instagram',
    description: 'Creative hooks, Reels distribution and save/share optimization.',
    id: 'reels',
    name: 'Reels Boost Pack',
    price: 199,
  },
  {
    category: 'tiktok',
    description: 'Creator shortlist, outreach scripts and short-form discovery seeding.',
    id: 'tiktok',
    name: 'TikTok Creator Seeding',
    price: 299,
  },
  {
    category: 'youtube',
    description: 'Titles, thumbnails, Shorts strategy and watch-time recommendations.',
    id: 'youtube',
    name: 'YouTube SEO Audit',
    price: 249,
  },
  {
    category: 'analytics',
    description: 'Weekly KPI dashboard for reach, watch time, traffic and conversions.',
    id: 'reporting',
    name: 'Advanced Reporting Dashboard',
    price: 149,
  },
];

const cartItemsNode = document.querySelector('#cart-items');
const cartEmptyNode = document.querySelector('#cart-empty');
const cartTotalNode = document.querySelector('#cart-total');
const cartCheckoutNode = document.querySelector('#cart-checkout');
const recommendationListNode = document.querySelector('#recommendation-list');
const cartCountNode = document.querySelector('#cart-count');
const cartStorageKey = 'instogram-growth-cart';
const cart = new Map();


function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify([...cart.entries()]));
  } catch (error) {
    console.warn('Unable to save cart state', error);
  }
}

function restoreCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    savedCart.forEach(([productId, quantity]) => {
      if (getProduct(productId) && Number(quantity) > 0) {
        cart.set(productId, Number(quantity));
      }
    });
  } catch (error) {
    console.warn('Unable to restore cart state', error);
  }
}

function getCartCount() {
  return [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
}

function updateCartCount() {
  if (!cartCountNode) return;

  cartCountNode.textContent = getCartCount();
}

function getProduct(productId) {
  return productCatalog.find((product) => product.id === productId);
}

function getCartProducts() {
  return [...cart.entries()].map(([productId, quantity]) => ({
    ...getProduct(productId),
    quantity,
  }));
}

function getRecommendations() {
  const selectedIds = new Set(cart.keys());
  const selectedCategories = new Set(getCartProducts().map((product) => product.category));
  const recommendationPriority = ['growth', 'reels', 'tiktok', 'youtube', 'reporting', 'starter'];

  return recommendationPriority
    .map(getProduct)
    .filter((product) => product && !selectedIds.has(product.id))
    .sort((first, second) => {
      const firstMatch = selectedCategories.has(first.category) ? 1 : 0;
      const secondMatch = selectedCategories.has(second.category) ? 1 : 0;
      return secondMatch - firstMatch;
    })
    .slice(0, 3);
}

function updateCheckoutLink(cartProducts, total) {
  if (!cartCheckoutNode) return;

  if (!cartProducts.length) {
    cartCheckoutNode.setAttribute('href', 'mailto:hello@instogram.xyz?subject=Growth%20Cart%20Request');
    return;
  }

  const lines = cartProducts.map((product) => (
    `${product.name} x ${product.quantity} — ${currencyFormatter.format(product.price * product.quantity)}`
  ));
  const subject = encodeURIComponent('Instogram Growth cart request');
  const body = encodeURIComponent(`Hi Instogram Growth,\n\nI would like a quote for:\n${lines.join('\n')}\n\nEstimated total: ${currencyFormatter.format(total)}\n\nPlease send the next steps.`);
  cartCheckoutNode.setAttribute('href', `mailto:hello@instogram.xyz?subject=${subject}&body=${body}`);
}

function renderRecommendations() {
  if (!recommendationListNode) return;

  recommendationListNode.innerHTML = getRecommendations().map((product) => `
    <article class="recommendation-card">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-meta"><span class="product-price">${currencyFormatter.format(product.price)}</span><button class="btn btn-secondary" type="button" data-add-to-cart="${product.id}">Add</button></div>
    </article>
  `).join('');
}

function renderCart() {
  if (!cartItemsNode || !cartTotalNode || !cartEmptyNode) return;

  const cartProducts = getCartProducts();
  const total = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  cartEmptyNode.style.display = cartProducts.length ? 'none' : 'block';
  cartTotalNode.textContent = currencyFormatter.format(total);
  cartItemsNode.innerHTML = cartProducts.map((product) => `
    <article class="cart-line">
      <div class="cart-line-top"><div><strong>${product.name}</strong><span>${currencyFormatter.format(product.price)} each</span></div><button class="remove-item" type="button" data-cart-remove="${product.id}">Remove</button></div>
      <div class="quantity-controls"><button type="button" data-cart-decrease="${product.id}">−</button><strong>${product.quantity}</strong><button type="button" data-cart-increase="${product.id}">+</button><span>${currencyFormatter.format(product.price * product.quantity)}</span></div>
    </article>
  `).join('');

  updateCartCount();
  saveCart();
  updateCheckoutLink(cartProducts, total);
  renderRecommendations();
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-to-cart]');
  const increaseButton = event.target.closest('[data-cart-increase]');
  const decreaseButton = event.target.closest('[data-cart-decrease]');
  const removeButton = event.target.closest('[data-cart-remove]');

  if (addButton) {
    addToCart(addButton.dataset.addToCart);
  }

  if (increaseButton) {
    addToCart(increaseButton.dataset.cartIncrease);
  }

  if (decreaseButton) {
    const productId = decreaseButton.dataset.cartDecrease;
    const nextQuantity = (cart.get(productId) || 0) - 1;
    if (nextQuantity > 0) {
      cart.set(productId, nextQuantity);
    } else {
      cart.delete(productId);
    }
    renderCart();
  }

  if (removeButton) {
    cart.delete(removeButton.dataset.cartRemove);
    renderCart();
  }
});

restoreCart();
renderCart();

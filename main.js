/* =====================================================
   INTRO SEQUENCE
===================================================== */
function initIntro() {
  const nameEl  = document.getElementById('intro-name');
  const overlay = document.getElementById('intro-overlay');
  const skipBtn = document.getElementById('skip-intro');

  'VAIRAAGI-X'.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = (i * 0.08 + 0.3) + 's';
    nameEl.appendChild(span);
  });

  function dismiss() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.style.display = 'none'; }, 800);
  }

  document.body.style.overflow = 'hidden';
  setTimeout(dismiss, 3200);
  skipBtn.addEventListener('click', dismiss);
}

/* =====================================================
   CUSTOM CURSOR (desktop only)
===================================================== */
function initCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .gallery-item, .track-card, .video-card, .merch-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
    });
}

/* =====================================================
   NAVIGATION
===================================================== */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* =====================================================
   HAMBURGER MENU
===================================================== */
function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  window.closeMobileMenu = function() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
}

/* =====================================================
   HERO STICKY SCROLL
===================================================== */
function initHeroScroll() {
  const hero      = document.getElementById('hero');
  const heroName  = document.getElementById('hero-name');
  const tagline   = document.getElementById('hero-tagline');
  const ctas      = document.querySelector('.hero-ctas');
  const heroBg    = document.getElementById('hero-bg');
  const scrollInd = document.getElementById('scroll-indicator');

  window.addEventListener('scroll', () => {
    const scrollable = hero.offsetHeight - window.innerHeight;
    const p = Math.min(Math.max(window.scrollY / scrollable, 0), 1);

    heroName.style.transform = `scale(${1 + p * 0.5})`;
    heroName.style.opacity   = 1 - Math.max(0, (p - 0.45) * 4);
    tagline.classList.toggle('visible', p > 0.2 && p < 0.85);
    ctas.classList.toggle('visible', p > 0.55 && p < 0.92);

    const g = Math.round(8 + p * 14).toString(16).padStart(2, '0');
    heroBg.style.background = `linear-gradient(180deg,#${g}${g}${g} 0%,#080808 100%)`;

    scrollInd.style.opacity = Math.max(0, 1 - p * 6);
  }, { passive: true });
}

/* =====================================================
   ABOUT STICKY SCROLL
===================================================== */
function initAboutScroll() {
  const section  = document.getElementById('about');
  const bioLines = section.querySelectorAll('.bio-line');
  const quote    = document.getElementById('pull-quote');

  window.addEventListener('scroll', () => {
    const rect       = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const p          = Math.min(Math.max(-rect.top / scrollable, 0), 1);

    bioLines.forEach((line, i) => {
      const threshold = (i / bioLines.length) * 0.15;
      line.classList.toggle('visible', p > threshold);
    });

    quote.classList.toggle('visible', p > 0.75);
  }, { passive: true });
}

/* =====================================================
   INTERSECTION OBSERVER — SCROLL REVEALS
===================================================== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-scale, .reveal-left, .reveal-right, .show-row, .video-card'
  ).forEach(el => obs.observe(el));
}

/* =====================================================
   LIGHTBOX
===================================================== */
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const img   = document.getElementById('lightbox-img');
  const close = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      if (!src || src === '#') return;
      img.src = src;
      img.alt = item.getAttribute('aria-label') || 'Gallery image';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });
  });

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }

  close.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* =====================================================
   GALLERY DRAG SCROLL + ARROW BUTTONS
===================================================== */
function initGalleryScroll() {
  const scroll = document.getElementById('gallery-scroll');
  const btnL   = document.getElementById('gallery-arrow-left');
  const btnR   = document.getElementById('gallery-arrow-right');

  if (!scroll) return;

  // Drag to scroll
  let isDown = false, startX, startLeft;
  scroll.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX; startLeft = scroll.scrollLeft;
    scroll.style.userSelect = 'none';
  });
  document.addEventListener('mouseup', () => {
    isDown = false; scroll.style.userSelect = '';
  });
  scroll.addEventListener('mousemove', e => {
    if (!isDown) return;
    scroll.scrollLeft = startLeft - (e.pageX - startX);
  });

  const step = () => scroll.offsetWidth * 0.8;
  btnL.addEventListener('click', () => scroll.scrollBy({ left: -step(), behavior: 'smooth' }));
  btnR.addEventListener('click', () => scroll.scrollBy({ left:  step(), behavior: 'smooth' }));
}

/* =====================================================
   VIDEO CARDS — tabs + click activates iframe
===================================================== */
function initVideoCards() {
  // Tabs
  document.querySelectorAll('.video-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.video-tab-pane').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const pane = document.getElementById('tab-' + tab.dataset.tab);
      if (pane) pane.style.display = 'grid';
    });
  });

  // Click to activate
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const iframe  = card.querySelector('iframe');
      const overlay = card.querySelector('.video-overlay');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      iframe.style.pointerEvents = 'all';
      iframe.src = iframe.src;
    });
  });
}

/* =====================================================
   FULL STORY PAGE
===================================================== */
function initStoryPage() {
  const page     = document.getElementById('story-page');
  const openBtn  = document.getElementById('open-story-btn');
  const closeBtn = document.getElementById('story-page-close');

  if (!page || !openBtn) return;

  openBtn.addEventListener('click', () => {
    page.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    page.classList.remove('open');
    document.body.style.overflow = '';
    page.scrollTop = 0;
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && page.classList.contains('open')) {
      closeBtn.click();
    }
  });
}

/* =====================================================
   CART STATE
===================================================== */
let cart = [];

function saveCart() {
  try { localStorage.setItem('vx-cart', JSON.stringify(cart)); } catch(e) {}
}

function loadCart() {
  try {
    const saved = localStorage.getItem('vx-cart');
    if (saved) cart = JSON.parse(saved);
  } catch(e) { cart = []; }
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

function renderCart() {
  const list  = document.getElementById('cart-items');
  const total = document.getElementById('cart-total-price');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (total) total.textContent = '₹ 0';
    return;
  }

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img">Photo</div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-meta">${item.size ? 'Size: ' + item.size + ' · ' : ''}Qty: ${item.qty}</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;">
        <span class="cart-item-price">₹ ${(item.price * item.qty).toLocaleString('en-IN')}</span>
        <button class="cart-remove" data-idx="${idx}" aria-label="Remove ${item.name}">✕</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(+btn.dataset.idx, 1);
      saveCart(); updateCartCount(); renderCart();
    });
  });

  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (total) total.textContent = '₹ ' + sum.toLocaleString('en-IN');
}

/* =====================================================
   CART SIDEBAR
===================================================== */
function initCart() {
  loadCart();
  updateCartCount();

  const sidebar  = document.getElementById('cart-sidebar');
  const bg       = document.getElementById('cart-overlay-bg');
  const cartBtn  = document.getElementById('cart-btn');
  const closeBtn = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCart() {
    renderCart();
    sidebar.classList.add('open');
    bg.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    sidebar.classList.remove('open');
    bg.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartBtn)  cartBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (bg)       bg.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      openCheckout();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeCart();
  });
}

/* =====================================================
   PRODUCT DETAIL MODAL
===================================================== */
function initProductModal() {
  const modal        = document.getElementById('product-modal');
  const closeBtn     = document.getElementById('product-modal-close');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const qtyMinus     = document.getElementById('qty-minus');
  const qtyPlus      = document.getElementById('qty-plus');
  const qtyVal       = document.getElementById('qty-value');
  let currentProduct = null;
  let selectedSize   = '';
  let qty = 1;

  function openProductModal(card) {
    const isSoldOut = card.classList.contains('merch-sold-out');
    if (isSoldOut) return;

    currentProduct = {
      name:     card.dataset.name,
      tag:      card.dataset.tag,
      price:    parseInt(card.dataset.price),
      priceGbp: card.dataset.priceGbp,
      desc:     card.dataset.desc,
      sizes:    card.dataset.sizes ? card.dataset.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
    };
    selectedSize = currentProduct.sizes[0] || '';
    qty = 1;

    document.getElementById('product-modal-tag').textContent  = currentProduct.tag;
    document.getElementById('product-modal-name').textContent = currentProduct.name;
    document.getElementById('product-modal-price').textContent = `₹ ${currentProduct.price.toLocaleString('en-IN')} / £ ${currentProduct.priceGbp}`;
    document.getElementById('product-modal-desc').textContent = currentProduct.desc;
    if (qtyVal) qtyVal.textContent = 1;

    // Size buttons
    const sizeWrap   = document.getElementById('size-selector-wrap');
    const sizeOpts   = document.getElementById('size-options');
    sizeOpts.innerHTML = '';
    if (currentProduct.sizes.length) {
      sizeWrap.style.display = 'block';
      currentProduct.sizes.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'size-btn' + (s === selectedSize ? ' selected' : '');
        btn.textContent = s;
        btn.addEventListener('click', () => {
          selectedSize = s;
          sizeOpts.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
        sizeOpts.appendChild(btn);
      });
    } else {
      sizeWrap.style.display = 'none';
    }

    // Product image placeholder
    const imgDiv = document.getElementById('product-modal-img');
    imgDiv.textContent = 'Photo';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach to all non-sold-out merch cards
  document.querySelectorAll('.merch-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openProductModal(card);
    });
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (modal)     modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  if (qtyMinus) qtyMinus.addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    if (qtyVal) qtyVal.textContent = qty;
  });
  if (qtyPlus) qtyPlus.addEventListener('click', () => {
    qty = Math.min(10, qty + 1);
    if (qtyVal) qtyVal.textContent = qty;
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      // Check if same item+size already in cart
      const existing = cart.find(i => i.name === currentProduct.name && i.size === selectedSize);
      if (existing) {
        existing.qty = Math.min(10, existing.qty + qty);
      } else {
        cart.push({ name: currentProduct.name, price: currentProduct.price, size: selectedSize, qty });
      }
      saveCart(); updateCartCount();
      closeModal();

      // Brief flash on cart button
      const cartBtn = document.getElementById('cart-btn');
      if (cartBtn) {
        cartBtn.style.borderColor = 'var(--silver)';
        setTimeout(() => { cartBtn.style.borderColor = ''; }, 600);
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });
}

/* =====================================================
   CHECKOUT
===================================================== */
function openCheckout() {
  const modal   = document.getElementById('checkout-modal');
  const summary = document.getElementById('checkout-order-summary');

  if (!modal) return;

  const lines = cart.map(i =>
    `${i.name}${i.size ? ' (' + i.size + ')' : ''} × ${i.qty} — ₹ ${(i.price * i.qty).toLocaleString('en-IN')}`
  ).join('<br>');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (summary) summary.innerHTML = lines + `<br><br><strong style="color:var(--silver)">Total: ₹ ${total.toLocaleString('en-IN')}</strong>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initCheckout() {
  const modal    = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('checkout-close');
  const form     = document.getElementById('checkout-form');
  const confirmed = document.getElementById('order-confirmed-modal');
  const confirmedClose = document.getElementById('order-confirmed-close');

  if (!modal) return;

  function closeCheckout() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCheckout);
  modal.addEventListener('click', e => { if (e.target === modal) closeCheckout(); });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // REPLACE: send form data + cart to your backend / Formspree / email service
      closeCheckout();
      cart = [];
      saveCart(); updateCartCount();
      if (confirmed) {
        confirmed.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (confirmedClose) {
    confirmedClose.addEventListener('click', () => {
      confirmed.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeCheckout();
  });
}

/* =====================================================
   FORMS — newsletter + contact
===================================================== */
function initForms() {
  const newsletter = document.querySelector('#newsletter form');
  if (newsletter) {
    newsletter.addEventListener('submit', e => {
      e.preventDefault();
      // REPLACE: connect to Mailchimp / Klaviyo API
      alert('You\'re now in frequency. Welcome.');
      newsletter.reset();
    });
  }

  const contact = document.querySelector('.contact-form');
  if (contact) {
    contact.addEventListener('submit', e => {
      e.preventDefault();
      // REPLACE: change action to Formspree endpoint and remove this preventDefault
      alert("Thank you. We'll be in touch.");
      contact.reset();
    });
  }
}

/* =====================================================
   BOOT
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initCursor();
  initNav();
  initHamburger();
  initHeroScroll();
  initAboutScroll();
  initReveal();
  initLightbox();
  initGalleryScroll();
  initVideoCards();
  initStoryPage();
  initCart();
  initProductModal();
  initCheckout();
  initForms();
});
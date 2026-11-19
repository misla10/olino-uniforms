/**
 * OLINO UNIFORMS - Master Frontend Logic
 * High-performance, clean vanilla JS with zero external runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initCollectionFilters();
  initModalForms();
  initImageLightbox();
});

/* --------------------------------------------------------------------------
   Sticky Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      if (isVisible) {
        navMenu.style.display = 'none';
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#ffffff';
        navMenu.style.padding = '1.5rem';
        navMenu.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
        navMenu.style.gap = '1.2rem';
        menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }
    });
  }

  // Smooth anchor jump links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const topOffset = 80;
          const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - topOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });

          if (window.innerWidth <= 820 && navMenu) {
            navMenu.style.display = 'none';
            if (menuBtn) menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in-scroll');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Stats Counter Animation
   -------------------------------------------------------------------------- */
function initCounters() {
  const counterEls = document.querySelectorAll('.metric-val');
  let started = false;

  const runCounter = () => {
    counterEls.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const step = target / (duration / 25);
      let count = 0;

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(count).toLocaleString();
        }
      }, 25);
    });
  };

  const strip = document.querySelector('.hero-metric-strip');
  if (strip) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        runCounter();
      }
    }, { threshold: 0.3 });
    observer.observe(strip);
  }
}

/* --------------------------------------------------------------------------
   Filterable Uniform Catalog
   -------------------------------------------------------------------------- */
function initCollectionFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Quote Request Modal
   -------------------------------------------------------------------------- */
function initModalForms() {
  const modal = document.getElementById('quote-modal');
  const openButtons = document.querySelectorAll('.open-quote-modal');
  const closeBtn = document.querySelector('.modal-close');
  const form = document.getElementById('quote-form');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.getAttribute('data-subject') || 'Institutional Uniform Requirement';
      const subjInput = document.getElementById('quote-subject');
      if (subjInput) subjInput.value = subject;
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inst = document.getElementById('inst-name')?.value || 'School';
      const phone = document.getElementById('inst-phone')?.value || '';
      const notes = document.getElementById('inst-notes')?.value || '';

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Quotation Logged!';
        submitBtn.style.background = '#25d366';

        const waText = encodeURIComponent(`Olino Uniforms Inquiry:\nInstitution: ${inst}\nPhone: ${phone}\nDetails: ${notes}`);
        const waLink = `https://wa.me/917902833334?text=${waText}`;

        setTimeout(() => {
          if (confirm('Quotation request submitted! Would you like to chat with our executive on WhatsApp immediately?')) {
            window.open(waLink, '_blank');
          }
          closeModal();
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          submitBtn.style.background = '';
        }, 1000);
      }, 800);
    });
  }
}

/* --------------------------------------------------------------------------
   Image Lightbox
   -------------------------------------------------------------------------- */
function initImageLightbox() {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const close = document.querySelector('.lightbox-close-btn');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      const src = t.getAttribute('data-src') || t.getAttribute('src');
      if (src && img) {
        img.src = src;
        box?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeBox = () => {
    box?.classList.remove('active');
    document.body.style.overflow = '';
  };

  close?.addEventListener('click', closeBox);
  box?.addEventListener('click', (e) => {
    if (e.target === box) closeBox();
  });
}

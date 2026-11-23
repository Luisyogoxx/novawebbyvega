(() => {
  'use strict';

  // 1. Neural Particle Canvas Background
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(65, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.8
    }));
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 135) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 135) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateCanvas();

  // 2. Cursor Spotlight & Navbar Scroll
  const cursorGlow = document.getElementById('cursorGlow');
  const navbar = document.getElementById('navbar');

  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // 3. Hero Counter Animation
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = String(target);
        clearInterval(timer);
      } else {
        el.textContent = String(current);
      }
    }, 28);
  });

  // 4. Demo Tabs
  const demoTabs = document.querySelectorAll('.demo-tab');
  const demoPanels = document.querySelectorAll('.demo-panel');
  demoTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      demoTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      demoPanels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // 5. AI Bot Response Logic (Shared between Demo & Floating Widget)
  function getBotReply(text) {
    const q = text.toLowerCase();
    if (q.includes('whatsapp') || q.includes('robot') || q.includes('bot')) {
      return 'Conectamos WhatsApp Business API con un Robot IA entrenado con tus precios, horarios y servicios. Responde en menos de 1 segundo, envía catálogos y agenda citas automáticamente.';
    }
    if (q.includes('menu') || q.includes('menú') || q.includes('restaurante') || q.includes('qr')) {
      return 'Nuestros Menús Digitales QR permiten que tus clientes vean fotos HD, agreguen platos al carrito y envíen el pedido directo a tu WhatsApp o cocina, sin pagar comisiones.';
    }
    if (q.includes('seo') || q.includes('google') || q.includes('posicion')) {
      return 'Optimizamos tu arquitectura web, velocidad (99/100), palabras clave locales y Google Maps. La mayoría de clientes ven mejoras de posicionamiento entre las semanas 3 y 8.';
    }
    if (q.includes('app') || q.includes('aplicacion') || q.includes('aplicación') || q.includes('movil')) {
      return 'Desarrollamos aplicaciones iOS/Android, Web Apps y paneles internos a medida (reservas, delivery, inventario) con diseño futurista y pagos integrados.';
    }
    if (q.includes('web') || q.includes('pagina') || q.includes('página') || q.includes('precio') || q.includes('cotiz')) {
      return 'Creamos páginas web desde $450 USD (~$1.890.000 COP) con entrega desde 7 días. Puedes combinar Web + SEO + WhatsApp + Robot IA en el Cotizador Inteligente de abajo.';
    }
    return '¡Excelente consulta! Podemos integrar Web, SEO, WhatsApp Business, Robots IA, Menú Digital o Apps a la medida de tu empresa. ¿Cuál te gustaría cotizar primero?';
  }

  function wireChat(formId, inputId, bodyId) {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const body = document.getElementById(bodyId);

    function appendMessage(text, sender) {
      const div = document.createElement('div');
      div.className = `msg ${sender}`;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function sendUserMessage(msgText) {
      const trimmed = msgText.trim();
      if (!trimmed) return;
      appendMessage(trimmed, 'user');
      setTimeout(() => {
        appendMessage(getBotReply(trimmed), 'bot');
      }, 420);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendUserMessage(input.value);
      input.value = '';
    });

    return sendUserMessage;
  }

  const sendDemoChat = wireChat('demoChatForm', 'demoChatInput', 'demoChatBody');
  wireChat('floatChatForm', 'floatChatInput', 'floatChatBody');

  document.querySelectorAll('.prompt-btn').forEach((btn) => {
    btn.addEventListener('click', () => sendDemoChat(btn.dataset.msg));
  });

  // 6. Digital Menu Demo
  const menuData = {
    burgers: [
      { id: 'b1', name: 'Cyber Smash Doble', desc: 'Doble carne angus, cheddar fundido, salsa trufada', price: 12.5 },
      { id: 'b2', name: 'Neon Crispy Chicken', desc: 'Pollo crocante, coleslaw cítrico y miel picante', price: 10.9 }
    ],
    bebidas: [
      { id: 'd1', name: 'Limonada Eléctrica', desc: 'Limón tahití, menta fresca y toque de spirulina', price: 4.5 },
      { id: 'd2', name: 'Cold Brew Nitro', desc: 'Café de especialidad infusionado en frío', price: 5.2 }
    ],
    postres: [
      { id: 'p1', name: 'Volcán Cuántico', desc: 'Chocolate 70% con centro líquido y helado', price: 6.8 },
      { id: 'p2', name: 'Cheesecake Nebula', desc: 'Frutos rojos y base crocante de almendra', price: 6.2 }
    ]
  };

  let activeCat = 'burgers';
  const cart = [];
  const menuList = document.getElementById('menuList');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const orderFeedback = document.getElementById('orderFeedback');

  const TRM_COP = 4200;
  function formatCop(usd) {
    return `$${Math.round(usd * TRM_COP).toLocaleString('es-CO')} COP`;
  }

  function renderMenu() {
    menuList.innerHTML = menuData[activeCat].map((item) => `
      <div class="menu-item">
        <div>
          <strong>${item.name}</strong>
          <span>${item.desc} &bull; $${item.price.toFixed(2)} USD (${formatCop(item.price)})</span>
        </div>
        <button type="button" class="add-dish-btn" data-id="${item.id}">+ Agregar</button>
      </div>
    `).join('');

    menuList.querySelectorAll('.add-dish-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dish = menuData[activeCat].find((i) => i.id === btn.dataset.id);
        if (dish) {
          cart.push(dish);
          renderCart();
        }
      });
    });
  }

  function renderCart() {
    cartCountEl.textContent = `${cart.length} ${cart.length === 1 ? 'ítem' : 'ítems'}`;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Agrega platos desde la vista previa &rarr;</p>';
      cartTotalEl.textContent = '$0.00 USD ($0 COP)';
      return;
    }
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotalEl.textContent = `$${total.toFixed(2)} USD (${formatCop(total)})`;
    cartItemsEl.innerHTML = cart.map((item) => `
      <div class="cart-row">
        <span>${item.name}</span>
        <strong>$${item.price.toFixed(2)} / ${formatCop(item.price)}</strong>
      </div>
    `).join('');
  }

  document.querySelectorAll('.menu-cat').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.menu-cat').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderMenu();
    });
  });

  document.getElementById('simulateOrderBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      orderFeedback.textContent = 'Agrega al menos un plato del menú para simular el pedido.';
      return;
    }
    const totalNum = cart.reduce((acc, i) => acc + i.price, 0);
    const total = totalNum.toFixed(2);
    orderFeedback.textContent = `Pedido enviado a WhatsApp (Mesa #04): ${cart.length} productos por $${total} USD (${formatCop(totalNum)}). ¡Confirmado en cocina!`;
  });

  renderMenu();

  // 7. SEO Simulator Demo
  const seoModes = {
    after: {
      pos: '#1 - #2',
      traffic: '14,800+',
      conv: '6.8%',
      badge: 'POSICIÓN #1 ORGÁNICA',
      title: 'Tu Empresa | Soluciones Digitales Líderes y Atención 24/7',
      desc: 'Sitio web ultrarrápido optimizado para Google. Cotización inmediata por WhatsApp Business, catálogo interactivo y soporte inteligente.',
      links: ['Servicios Web', 'Catálogo / Menú', 'WhatsApp Directo', 'Reseñas 4.9 ★']
    },
    before: {
      pos: 'Página 4 (#38)',
      traffic: '210 / mes',
      conv: '0.7%',
      badge: 'SIN OPTIMIZACIÓN SEO',
      title: 'Inicio - Bienvenidos a nuestra página web',
      desc: 'Somos una empresa dedicada a ofrecer servicios. Contáctanos para más información en horario de oficina.',
      links: ['Sin sitelinks', 'Carga lenta (4.8s)', 'Sin WhatsApp API']
    }
  };

  document.querySelectorAll('.seo-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seo-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const data = seoModes[btn.dataset.mode];
      document.getElementById('seoPos').textContent = data.pos;
      document.getElementById('seoTraffic').textContent = data.traffic;
      document.getElementById('seoConv').textContent = data.conv;
      document.getElementById('serpBadge').textContent = data.badge;
      document.getElementById('serpTitle').textContent = data.title;
      document.getElementById('serpDesc').textContent = data.desc;
      document.getElementById('serpSitelinks').innerHTML = data.links.map((l) => `<span>${l}</span>`).join('');
    });
  });

  // 8. Quote Configurator
  const checkInputs = Array.from(document.querySelectorAll('#serviceChecks input[type="checkbox"]'));
  const scaleBtns = Array.from(document.querySelectorAll('.scale-btn'));
  const summaryList = document.getElementById('summaryList');
  const summaryDays = document.getElementById('summaryDays');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryPriceCop = document.getElementById('summaryPriceCop');
  const summaryScale = document.getElementById('summaryScale');
  let scaleMult = 1;
  let scaleLabel = 'Emprendedor / Negocio Local';

  function updateQuote() {
    const selected = checkInputs.filter((c) => c.checked);
    if (selected.length === 0) {
      summaryList.innerHTML = '<div class="summary-item"><span>Selecciona al menos 1 servicio</span></div>';
      summaryDays.textContent = '0 días';
      summaryPrice.textContent = '$0 USD';
      summaryPriceCop.textContent = '$0 COP';
      return;
    }

    let totalPrice = 0;
    let totalDays = 0;
    summaryList.innerHTML = selected.map((c) => {
      const price = Math.round(Number(c.dataset.price) * scaleMult);
      const days = Number(c.dataset.days);
      totalPrice += price;
      totalDays = Math.max(totalDays, days) + (selected.length > 1 ? 2 : 0);
      return `<div class="summary-item"><span>${c.dataset.name}</span><strong>$${price} USD / ${formatCop(price)}</strong></div>`;
    }).join('');

    summaryScale.textContent = scaleLabel;
    summaryDays.textContent = `${totalDays} días hábiles`;
    summaryPrice.textContent = `$${totalPrice.toLocaleString('en-US')} USD`;
    summaryPriceCop.textContent = `~${formatCop(totalPrice)}`;
  }

  checkInputs.forEach((input) => input.addEventListener('change', updateQuote));
  scaleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scaleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      scaleMult = Number(btn.dataset.mult);
      scaleLabel = btn.dataset.label;
      updateQuote();
    });
  });

  // Preselect from service cards
  document.querySelectorAll('[data-preselect]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetVal = link.dataset.preselect;
      const box = checkInputs.find((c) => c.value === targetVal);
      if (box && !box.checked) {
        box.checked = true;
        updateQuote();
      }
    });
  });

  // Apply quote to contact form
  document.getElementById('applyQuoteBtn').addEventListener('click', () => {
    const selectedNames = checkInputs.filter((c) => c.checked).map((c) => c.dataset.name);
    const msgArea = document.getElementById('cMessage');
    msgArea.value = `Hola NovaWeb by Vega, me interesa cotizar (${scaleLabel}):\n- ${selectedNames.join('\n- ')}\nInversión estimada vista en el configurador: ${summaryPrice.textContent} (${summaryPriceCop.textContent}).`;
  });

  updateQuote();

  // 9. FAQ Accordion
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : null;
    });
  });

  // 10. Contact Form Feedback + Anti-Flood & WhatsApp Dispatch
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  let lastSubmitTime = 0;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const honeypot = document.getElementById('cWebsite');
    if (honeypot && honeypot.value.trim() !== '') {
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < 15000) {
      formFeedback.textContent = 'Por favor espera unos segundos antes de enviar otra solicitud.';
      return;
    }
    lastSubmitTime = now;

    const name = document.getElementById('cName').value.trim();
    const company = document.getElementById('cCompany').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const msg = document.getElementById('cMessage').value.trim();

    const waText = encodeURIComponent(
      `Hola NovaWeb by Vega, soy ${name}${company ? ` (${company})` : ''}.\nCorreo: ${email}\nTel: ${phone}\n\nProyecto:\n${msg}`
    );
    const waUrl = `https://wa.me/573000560656?text=${waText}`;

    formFeedback.innerHTML = `¡Gracias, ${name}! Abriendo WhatsApp para atención inmediata o <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--cyan);text-decoration:underline;">haz clic aquí para enviar por WhatsApp</a>.`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    contactForm.reset();
  });

  // 11. Floating Bot Drawer
  const botFab = document.getElementById('botFab');
  const botDrawer = document.getElementById('botDrawer');
  const closeBotDrawer = document.getElementById('closeBotDrawer');

  botFab.addEventListener('click', () => {
    const open = botDrawer.classList.toggle('open');
    botDrawer.setAttribute('aria-hidden', String(!open));
  });

  closeBotDrawer.addEventListener('click', () => {
    botDrawer.classList.remove('open');
    botDrawer.setAttribute('aria-hidden', 'true');
  });
})();

/* ==========================================================================
   PANGEA REAL WORLD ASSET ECOSYSTEM - POLISHED SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. NAVBAR SCROLL & ACTIVE LINK DETECTION
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // 2. METRICS STATS COUNTER ANIMATION
  const counters = document.querySelectorAll('.counter');
  const counterDecimals = document.querySelectorAll('.counter-decimal');

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const step = target / 40;

          const updateCount = () => {
            count += step;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });

        counterDecimals.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          let count = 0;
          const step = target / 35;

          const updateDecimal = () => {
            count += step;
            if (count < target) {
              counter.innerText = count.toFixed(2);
              setTimeout(updateDecimal, 30);
            } else {
              counter.innerText = target.toFixed(2);
            }
          };
          updateDecimal();
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  // 3. ANIMATED WORLD MAP NETWORK CANVAS
  const mapCanvas = document.getElementById('worldMapCanvas');
  if (mapCanvas) {
    const ctx = mapCanvas.getContext('2d');
    let width, height;

    function resizeMap() {
      const container = mapCanvas.parentElement;
      width = mapCanvas.width = container.clientWidth;
      height = mapCanvas.height = container.clientHeight;
    }

    window.addEventListener('resize', resizeMap);
    resizeMap();

    const hubs = [
      { x: 0.25, y: 0.35 },
      { x: 0.46, y: 0.28 },
      { x: 0.60, y: 0.50 },
      { x: 0.76, y: 0.55 },
      { x: 0.84, y: 0.36 },
      { x: 0.88, y: 0.80 }
    ];

    let arcProgress = 0;

    function renderMap() {
      ctx.clearRect(0, 0, width, height);

      const cols = 50;
      const rows = 22;
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          ctx.arc(c * cellW + cellW / 2, r * cellH + cellH / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const coreX = width * 0.60;
      const coreY = height * 0.50;
      const coreRadius = 36;
      const numCoreDots = 18;

      ctx.fillStyle = '#9FE82F';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#9FE82F';

      for (let i = 0; i < numCoreDots; i++) {
        const angle = (i / numCoreDots) * Math.PI * 2;
        const cx = coreX + Math.cos(angle) * coreRadius;
        const cy = coreY + Math.sin(angle) * coreRadius;

        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      arcProgress += 0.008;
      if (arcProgress > 1) arcProgress = 0;

      hubs.forEach((hub, idx) => {
        if (idx === 2) return;

        const hx = hub.x * width;
        const hy = hub.y * height;

        ctx.strokeStyle = 'rgba(159, 232, 47, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(coreX, coreY);

        const ctrlX = (coreX + hx) / 2;
        const ctrlY = Math.min(coreY, hy) - 35;
        ctx.quadraticCurveTo(ctrlX, ctrlY, hx, hy);
        ctx.stroke();

        const t = (arcProgress + idx * 0.2) % 1;
        const px = (1 - t) * (1 - t) * coreX + 2 * (1 - t) * t * ctrlX + t * t * hx;
        const py = (1 - t) * (1 - t) * coreY + 2 * (1 - t) * t * ctrlY + t * t * hy;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(renderMap);
    }

    renderMap();
  }

  // 4. TOKENIZATION SIMULATOR LOGIC
  const assetBtns = document.querySelectorAll('.asset-btn');
  const valuationRange = document.getElementById('valuationRange');
  const tokenSupplyRange = document.getElementById('tokenSupplyRange');

  const valuationDisplay = document.getElementById('assetValuationDisplay');
  const tokenSupplyDisplay = document.getElementById('tokenSupplyDisplay');
  const unitPriceDisplay = document.getElementById('unitPriceDisplay');
  const yieldDisplay = document.getElementById('yieldDisplay');
  const annualRevenueDisplay = document.getElementById('annualRevenueDisplay');
  const liquidityDepthDisplay = document.getElementById('liquidityDepthDisplay');
  const selectedAssetClass = document.getElementById('selectedAssetClass');
  const simulateMintBtn = document.getElementById('simulateMintBtn');

  let currentYield = 6.8;

  function updateSim() {
    if (!valuationRange || !tokenSupplyRange) return;
    const val = parseFloat(valuationRange.value);
    const supply = parseFloat(tokenSupplyRange.value);

    const price = val / supply;
    const rev = val * (currentYield / 100);
    const liq = val * 0.15;

    if (valuationDisplay) valuationDisplay.innerText = '$' + val.toLocaleString();
    if (tokenSupplyDisplay) tokenSupplyDisplay.innerText = supply.toLocaleString() + ' Tokens';
    if (unitPriceDisplay) unitPriceDisplay.innerText = '$' + price.toFixed(2);
    if (yieldDisplay) yieldDisplay.innerText = currentYield.toFixed(1) + '%';
    if (annualRevenueDisplay) annualRevenueDisplay.innerText = '$' + rev.toLocaleString() + ' / yr';
    if (liquidityDepthDisplay) liquidityDepthDisplay.innerText = '$' + liq.toLocaleString();
  }

  assetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      assetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentYield = parseFloat(btn.getAttribute('data-yield'));
      if (selectedAssetClass) selectedAssetClass.innerText = btn.getAttribute('data-class');
      updateSim();
    });
  });

  if (valuationRange && tokenSupplyRange) {
    valuationRange.addEventListener('input', updateSim);
    tokenSupplyRange.addEventListener('input', updateSim);
    updateSim();
  }

  if (simulateMintBtn) {
    simulateMintBtn.addEventListener('click', () => {
      const cls = selectedAssetClass ? selectedAssetClass.innerText : 'Assets';
      showToast(`PROTOCOL SUCCESS: Minted ERC-3643 tokens for ${cls}!`);
    });
  }

  // 5. WHITEPAPER MODAL & TOAST
  const wpModal = document.getElementById('whitepaperModal');

  document.querySelectorAll('.open-whitepaper-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (wpModal) wpModal.classList.add('active');
    });
  });

  document.getElementById('closeWhitepaperModal')?.addEventListener('click', () => wpModal?.classList.remove('active'));
  document.getElementById('closeWpBtn')?.addEventListener('click', () => wpModal?.classList.remove('active'));

  if (wpModal) {
    wpModal.addEventListener('click', (e) => {
      if (e.target === wpModal) wpModal.classList.remove('active');
    });
  }

  document.getElementById('downloadPdfBtn')?.addEventListener('click', () => {
    showToast('[DOCS] Download Started: PANGEA_Whitepaper_v2.4.pdf');
  });

  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('[SUBSCRIPTION] Thank you for subscribing to PANGEA updates!');
  });

  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

});

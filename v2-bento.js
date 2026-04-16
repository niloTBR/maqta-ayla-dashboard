// ============================================================
// v2-bento.js — Clean bento grid dashboard
// ============================================================

const LANG = {
  en: {
    dashTitle: 'Truck Entry & Exit Movements',
    dashSubtitle: 'Project Statistics',
    totalMovements: 'Total Logistics Movements',
    smartGate: 'Smart Gate Movements',
    avgPerDay: 'avg. per day',
    processingTime: 'Avg. Processing Time',
    outOf60: 'out of 60s',
    registeredDrivers: 'Registered Drivers',
    totalDrivers: 'total drivers',
    borderCrossings: 'Entry Points',
    insight: 'Insight',
    insightText: 'of all entry points to Aqaba city <strong>were through Al-Rashidiya</strong>',
    trucksRecorded: 'Trucks Recorded',
    yard4: 'Yard 4 Entry',
    passengerExits: 'Passenger Terminal Exits',
    vsLastMonth: 'from last month',
    transitPermits: 'Transit Permits',
    alBalmExit: 'Al-Balm exit',
    passengerTerminal: 'Passenger terminal',
    cargoTypes: 'Cargo / Vehicle Types',
    months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    footer: 'Aqaba Models · November 2025 · ASEZA',
    passengerSplit: 'Passenger Traffic Split',
    jordan: 'Jordan',
    other: 'Other',
    nationality: 'Nationalities',
    crossings: ['Al-Rashidiya', 'Wadi Araba', 'Passenger Terminal', 'Al-Durra'],
    cargo: ['Containers', 'General Cargo', 'Buses', 'Tankers', 'Livestock', 'Cars'],
    transitMovements: 'Transit Movements',
    transitMovementsSub: 'via passenger terminal',
    transitPermitsSub: 'via passenger terminal',
    cargoSub: ['Livestock 1%', 'Vehicles 1%'],
    countries: ['Jordan', 'Egypt', 'Iraq', 'Kazakhstan']
  },
  ar: {
    dashTitle: 'دخول وخروج الشاحنات',
    dashSubtitle: 'إحصائيات المشروع',
    totalMovements: 'إجمالي الحركات اللوجستية',
    smartGate: 'البوابات الذكية',
    avgPerDay: 'معدل يومي',
    processingTime: 'معدل إنجاز المعاملة',
    outOf60: '31% كفاءة المعالجة المتوازية',
    registeredDrivers: 'السائقون المسجلون',
    totalDrivers: 'إجمالي السائقين',
    borderCrossings: 'منافذ الدخول',
    insight: 'نظرة',
    insightText: 'حسب مراكز الدخول لمدينة العقبة <strong>كانت عبر الراشدية</strong>',
    trucksRecorded: 'الشاحنات المسجلة',
    yard4: 'حركات دخول ساحة 4',
    passengerExits: 'حركات خروج محطة الركاب',
    vsLastMonth: 'مقارنة بالشهر السابق',
    transitPermits: 'تصاريح الترانزيت',
    alBalmExit: 'خروج البلم',
    passengerTerminal: 'خروج محطة الركاب',
    cargoTypes: 'أنواع الشحنات',
    months: ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'تشرين الأول', 'تشرين ثاني'],
    footer: 'نامذج العقبة · تشرين ثاني 2025 · سلطة منطقة العقبة الاقتصادية الخاصة',
    passengerSplit: 'توزيع حركة الركاب',
    jordan: 'الأردن',
    other: 'أخرى',
    nationality: 'الجنسيات',
    crossings: ['الراشدية', 'وادي عربة', 'محطة الركاب', 'الدرة'],
    cargo: ['حاويات', 'بضائع عامة', 'بوسات/باصات', 'فقط نظام حاويات', 'مواشي', 'سيارات'],
    transitMovements: 'حركات الترانزيت',
    transitMovementsSub: 'عبر محطة الركاب',
    transitPermitsSub: 'عبر محطة الركاب',
    countries: ['الأردن', 'مصر', 'العراق', 'كازاخستان']
  }
};

let currentLang = 'ar';

const DATA = {
  borderCrossings: [
    { pct: 86, color: "#1565C0" },
    { pct: 8,  color: "#0288D1" },
    { pct: 4,  color: "#F57C00" },
    { pct: 2,  color: "#7E57C2" }
  ],
  cargoBreakdown: [
    { pct: 40, color: "#1565C0", bg: "rgba(21,101,192,0.10)" },
    { pct: 29, color: "#2E7D32", bg: "rgba(46,125,50,0.10)" },
    { pct: 21, color: "#6A1B9A", bg: "rgba(106,27,154,0.10)" },
    { pct: 8,  color: "#E65100", bg: "rgba(230,81,0,0.10)" },
    { pct: 1,  color: "#795548", bg: "rgba(121,85,72,0.10)" },
    { pct: 1,  color: "#455A64", bg: "rgba(69,90,100,0.10)" }
  ],
  countries: [
    { flagImg: "images/jo-flag.jpg",                count: 11899, countFormatted: "11,899" },
    { flagImg: "images/Flag_of_Egypt.svg.png",      count: 2318,  countFormatted: "2,318" },
    { flagImg: "images/Flag_of_Iraq.svg.png",       count: 1252,  countFormatted: "1,252" },
    { flagImg: "images/Flag_of_Kazakhstan.svg.png", count: 160,   countFormatted: "160" }
  ]
};

let crossingsAnimated = false;
let cargoAnimated = false;
let paxAnimated = false;

document.addEventListener('DOMContentLoaded', function () {
  initWeekHover();
  initLangSwitch();
  populateWallets();
  populatePulseBars();
  initGaugeObserver();
  populateCrossings();
  populateCargo();
  populateWeeklyChart();
  initRevealObserver();
  initCrossingsObserver();
  initCargoObserver();
  initPaxObserver();
  initCountUp();
  initSplitBars();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  updateAllText();
  initChartObserver();
});

// ============================================================
// DAILY BARS — 30 days, interactive with hover
// ============================================================
function populatePulseBars() {
  const container = document.getElementById('pulseBars');
  if (!container) return;

  // Generate 30 days of Nov with realistic variation around 7,126 avg
  const days = [];
  for (let d = 1; d <= 30; d++) {
    const base = 7126;
    const variance = Math.sin(d * 0.7) * 1500 + Math.cos(d * 1.3) * 800 + (Math.random() - 0.5) * 600;
    days.push({ day: d, value: Math.round(base + variance) });
  }

  const max = Math.max(...days.map(function(d) { return d.value; }));
  const miniNum = container.closest('.card-inner').querySelector('.mini-num');
  const originalNum = miniNum ? miniNum.textContent : '';

  let html = '';
  days.forEach(function (d) {
    const pct = Math.max(10, (d.value / max) * 100);
    const formatted = d.value.toLocaleString('en-US');
    html += '<div class="pulse-bar" style="height:0%" data-height="' + pct + '" data-value="' + formatted + '" data-day="Nov ' + d.day + '">'
      + '<span class="bar-tooltip">Nov ' + d.day + ': ' + formatted + '</span>'
      + '</div>';
  });
  container.innerHTML = html;

  // Reuse the cursor follower
  var cursor = document.querySelector('.cursor-value');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor-value';
    document.body.appendChild(cursor);
  }

  container.style.cursor = 'none';

  container.querySelectorAll('.pulse-bar').forEach(function (bar) {
    bar.style.cursor = 'none';
    bar.addEventListener('mouseenter', function () {
      if (miniNum) {
        miniNum.textContent = bar.getAttribute('data-value');
        miniNum.style.color = 'var(--accent)';
      }
      cursor.textContent = bar.getAttribute('data-day') + ': ' + bar.getAttribute('data-value');
      cursor.style.opacity = '1';
    });
    bar.addEventListener('mouseleave', function () {
      if (miniNum) {
        miniNum.textContent = originalNum;
        miniNum.style.color = '';
      }
      cursor.style.opacity = '0';
    });
    bar.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  });

  container.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
  });

  // Animate on scroll
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        container.querySelectorAll('.pulse-bar').forEach(function (bar, i) {
          setTimeout(function () {
            bar.style.height = bar.getAttribute('data-height') + '%';
          }, i * 25);
        });
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(container);
}

// ============================================================
// GAUGE — speedometer animation
// ============================================================
function initGaugeObserver() {
  const fill = document.querySelector('.gauge-fill');
  if (!fill) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          // 31% of arc. 157 * (1 - 0.31) ≈ 108
          fill.style.strokeDashoffset = '108';
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(fill);
}

// ============================================================
// LANGUAGE SWITCHER — toggles dir and swaps text
// ============================================================
function initLangSwitch() {
  const btns = document.querySelectorAll('.lang-btn');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      currentLang = btn.getAttribute('data-lang');
      if (currentLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
      }
      updateAllText();
    });
  });
}

function updateAllText() {
  const t = LANG[currentLang];

  // All data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key]) el.innerHTML = t[key];
  });

  // Month labels
  var monthSpans = document.querySelectorAll('.weekly-labels span');
  t.months.forEach(function (m, i) {
    if (monthSpans[i]) monthSpans[i].textContent = m;
  });

  // Rebuild dynamic content
  populateCrossings();
  populateWallets();
  populateCargo();

  // Date picker
  var dateLabel = document.getElementById('dateLabel');
  if (dateLabel) dateLabel.textContent = currentLang === 'ar' ? 'تشرين ثاني 2025' : 'Nov 2025';

  // Footer
  var footerLeft = document.querySelector('.footer span:first-child');
  if (footerLeft) footerLeft.textContent = t.footer;

  // Reset crossing animation so bars re-animate
  crossingsAnimated = false;
  cargoAnimated = false;
  initCrossingsObserver();
  initCargoObserver();
}

// ============================================================
// WEEK HOVER — hero number swaps to weekly value
// ============================================================
function initWeekHover() {
  const heroNum = document.querySelector('.hero-num');
  const chart = document.querySelector('.hero-chart');
  const labels = document.querySelectorAll('.weekly-labels span');
  if (!heroNum || !labels.length || !chart) return;

  const original = heroNum.textContent;

  // Create cursor follower
  const cursor = document.createElement('div');
  cursor.className = 'cursor-value';
  document.body.appendChild(cursor);

  // Labels hover — swap number + show cursor value
  labels.forEach(function (label) {
    label.addEventListener('mouseenter', function () {
      heroNum.textContent = label.getAttribute('data-week-value');
      heroNum.style.color = 'var(--accent)';
      cursor.textContent = label.getAttribute('data-week-value');
      cursor.style.opacity = '1';
    });
    label.addEventListener('mouseleave', function () {
      heroNum.textContent = original;
      heroNum.style.color = '';
      cursor.style.opacity = '0';
    });
  });

  // Chart area hover — cursor follows mouse with interpolated value
  var chartSvg = document.getElementById('weeklyChart');
  var monthValues = [88420, 91300, 94750, 96100, 95460, 92598];

  chartSvg.style.cursor = 'none';
  chartSvg.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
    chartSvg.style.cursor = 'none';
  });
  chartSvg.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
    heroNum.textContent = original;
    heroNum.style.color = '';
  });
  chartSvg.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    var rect = chartSvg.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    var idx = pct * (monthValues.length - 1);
    var lo = Math.floor(idx);
    var hi = Math.min(lo + 1, monthValues.length - 1);
    var t = idx - lo;
    var val = Math.round(monthValues[lo] + (monthValues[hi] - monthValues[lo]) * t);
    var formatted = val.toLocaleString('en-US');
    cursor.textContent = formatted;
    heroNum.textContent = formatted;
    heroNum.style.color = 'var(--accent)';
  });

  // Move cursor with mouse globally when visible
  document.addEventListener('mousemove', function (e) {
    if (cursor.style.opacity === '1') {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }
  });
}

// ============================================================
// WEEKLY CHART — gradient shaded area only
// ============================================================
function populateWeeklyChart() {
  const svg = document.getElementById('weeklyChart');
  if (!svg) return;

  const values = [88420, 91300, 94750, 96100, 95460, 92598];
  const w = 300, h = 80;
  const pad = 4;
  const min = Math.min(...values) * 0.92;
  const max = Math.max(...values) * 1.05;

  function px(i) { return pad + (i / (values.length - 1)) * (w - pad * 2); }
  function py(v) { return h - pad - ((v - min) / (max - min)) * (h - pad * 2); }

  const points = values.map(function (v, i) { return { x: px(i), y: py(v) }; });

  function smooth(pts) {
    let d = 'M' + pts[0].x + ',' + pts[0].y;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      d += ' C' + (p1.x + (p2.x - p0.x) / 6) + ',' + (p1.y + (p2.y - p0.y) / 6)
        + ' ' + (p2.x - (p3.x - p1.x) / 6) + ',' + (p2.y - (p3.y - p1.y) / 6)
        + ' ' + p2.x + ',' + p2.y;
    }
    return d;
  }

  const curve = smooth(points);
  const area = curve + ' L' + points[points.length - 1].x + ',' + h + ' L' + points[0].x + ',' + h + ' Z';

  svg.innerHTML = '<defs>'
    + '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="#1565C0" stop-opacity="0.25"/>'
    + '<stop offset="100%" stop-color="#1565C0" stop-opacity="0.02"/>'
    + '</linearGradient>'
    + '</defs>'
    + '<path class="weekly-area" d="' + area + '" fill="url(#areaGrad)"/>'
    + '<path class="weekly-line" d="' + curve + '"/>';
}

let chartAnimated = false;
function initChartObserver() {
  const svg = document.getElementById('weeklyChart');
  if (!svg) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !chartAnimated) {
        chartAnimated = true;
        var line = svg.querySelector('.weekly-line');
        var area = svg.querySelector('.weekly-area');
        if (line) line.classList.add('is-drawn');
        if (area) area.classList.add('is-drawn');
      }
    });
  }, { threshold: 0.3 });
  observer.observe(svg);
}

// ============================================================
// WALLETS — nationalities as wallet cards
// ============================================================
function populateWallets() {
  const container = document.getElementById('walletsGrid');
  if (!container) return;
  const t = LANG[currentLang];
  let html = '';
  DATA.countries.forEach(function (c, i) {
    html += '<div class="wallet-item">'
      + '<div class="wallet-top">'
      + '<img src="' + c.flagImg + '" class="wallet-flag" alt="' + t.countries[i] + '">'
      + '<span class="wallet-name">' + t.countries[i] + '</span>'
      + '</div>'
      + '<span class="wallet-count">' + c.countFormatted + '</span>'
      + '</div>';
  });
  container.innerHTML = html;
}

// ============================================================
// CROSSINGS — four mini donut pies
// ============================================================
function populateCrossings() {
  const container = document.getElementById('piesGrid');
  if (!container) return;
  const t = LANG[currentLang];
  const circ = 2 * Math.PI * 36;

  let html = '';
  DATA.borderCrossings.forEach(function (item, i) {
    const offset = circ - (item.pct / 100) * circ;
    html += '<div class="pie-item">'
      + '<div class="pie-ring">'
      + '<svg viewBox="0 0 80 80">'
      + '<circle class="pie-track" cx="40" cy="40" r="36"/>'
      + '<circle class="pie-fill" cx="40" cy="40" r="36" stroke="' + item.color + '" data-offset="' + offset.toFixed(1) + '"/>'
      + '</svg>'
      + '<span class="pie-label">' + item.pct + '%</span>'
      + '</div>'
      + '<span class="pie-name">' + t.crossings[i] + '</span>'
      + '</div>';
  });
  container.innerHTML = html;
}

function initCrossingsObserver() {
  const target = document.getElementById('piesGrid');
  if (!target) return;
  // Reset all pie fills to starting position
  document.querySelectorAll('.pie-fill').forEach(function (el) {
    el.style.strokeDashoffset = '226.2';
  });
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !crossingsAnimated) {
        crossingsAnimated = true;
        document.querySelectorAll('.pie-fill').forEach(function (el, i) {
          const offset = el.getAttribute('data-offset');
          setTimeout(function () {
            el.style.strokeDashoffset = offset;
          }, 200 + i * 200);
        });
      }
    });
  }, { threshold: 0.15 });
  observer.observe(target);
}

// ============================================================
// CARGO
// ============================================================
function populateCargo() {
  const container = document.getElementById('cargoGrid');
  if (!container) return;
  const t = LANG[currentLang];
  const lucideIcons = ['container', 'package', 'bus', 'fuel', 'paw-print', 'car'];
  let html = '';
  DATA.cargoBreakdown.forEach(function (item, i) {
    html += '<div class="cargo-item">'
      + '<div class="cargo-icon-wrap" style="background:' + item.bg + '">'
      + '<i data-lucide="' + lucideIcons[i] + '" style="stroke:' + item.color + ';width:22px;height:22px;stroke-width:1.8;"></i>'
      + '</div>'
      + '<span class="cargo-pct" style="color:' + item.color + ';">' + item.pct + '%</span>'
      + '<div class="cargo-bar-wrap"><div class="cargo-bar" data-width="' + item.pct + '" style="background:' + item.color + ';"></div></div>'
      + '<span class="cargo-name">' + t.cargo[i] + '</span>'
      + '</div>';
  });
  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
function initCargoObserver() {
  const target = document.getElementById('cargoGrid');
  if (!target) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !cargoAnimated) {
        cargoAnimated = true;
        document.querySelectorAll('.cargo-bar').forEach(function (bar, i) {
          const w = (bar.getAttribute('data-width') || '0') + '%';
          setTimeout(function () { bar.style.width = w; }, i * 150);
        });
      }
    });
  }, { threshold: 0.15 });
  observer.observe(target);
}

// ============================================================
// PAX SPLIT
// ============================================================
function initPaxObserver() {
  const bars = document.querySelectorAll('.pax-bar');
  if (!bars.length) return;
  const target = document.querySelector('.pax-split');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !paxAnimated) {
        paxAnimated = true;
        bars.forEach(function (bar, i) {
          const w = bar.getAttribute('data-width') || '0';
          setTimeout(function () { bar.style.width = w + '%'; }, i * 200);
        });
      }
    });
  }, { threshold: 0.3 });
  observer.observe(target);
}

// ============================================================
// COUNT UP — all numbers animate from 0
// ============================================================
// ============================================================
// SPLIT BARS — animate on scroll
// ============================================================
function initSplitBars() {
  const bars = document.querySelectorAll('.split-bar');
  if (!bars.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.getAttribute('data-width') || '0';
        bar.style.width = w + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (bar) { observer.observe(bar); });
}

function initCountUp() {
  var selectors = '.hero-num, .kpi-num, .mini-num, .stat-num, .gates-num, .permit-num, .insight-num, .trucks-stat-num, .wallet-count, .wallets-total-num';
  document.querySelectorAll(selectors).forEach(function (el) {
    var text = el.textContent.trim();
    var suffix = '';
    // Extract trailing non-digit suffix like "s" in "31s"
    var match = text.match(/^([\d,]+)(.*)$/);
    if (!match) return;
    var numStr = match[1];
    suffix = match[2] || '';
    var target = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(target)) return;

    el.textContent = '0' + suffix;
    el.setAttribute('data-count-target', target);
    el.setAttribute('data-count-suffix', suffix);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(el, target, suffix, 1200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  });
}

function animateCount(el, target, suffix, duration) {
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 4);
    var current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('en-US') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============================================================
// REVEAL OBSERVER
// ============================================================
function initRevealObserver() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        const el = entry.target;
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -30px 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
}

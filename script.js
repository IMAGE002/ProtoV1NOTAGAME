// Navigation State Management
let currentPage = 'home';

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navClose = document.getElementById('navClose');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');
const debugPanel = document.getElementById('debugPanel');
const imitateWinBtn = document.getElementById('imitateWinBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const notificationContainer = document.getElementById('notificationContainer');
const notificationCount = document.getElementById('notificationCount');
const currencyAmount = document.getElementById('currencyAmount');
const currentPageDebug = document.getElementById('currentPageDebug');

let notifications = [];
const MAX_NOTIFICATIONS = 15;
let virtualCurrency = 0;

// Page Navigation Function
function navigateToPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const selectedPage = document.getElementById(`page-${pageName}`);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
  
  // Update navigation links
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    }
  });
  
  // Update debug panel
  currentPageDebug.textContent = pageName;
  
  // Update current page variable
  currentPage = pageName;
  
  // Update URL hash without scrolling
  history.pushState(null, null, `#${pageName}`);
}

// Handle navigation link clicks
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.dataset.page;
    navigateToPage(pageName);
    
    // Close menu if open
    if (navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'home';
  navigateToPage(hash);
});

// Initialize page on load
window.addEventListener('load', () => {
  const hash = window.location.hash.slice(1) || 'home';
  navigateToPage(hash);
});

function updateCurrencyDisplay() {
  const formattedAmount = virtualCurrency.toLocaleString();
  currencyAmount.textContent = formattedAmount;
}

function animateCurrencyChange(oldValue, newValue, duration = 1000) {
  const start = performance.now();
  const difference = newValue - oldValue;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(oldValue + (difference * easeOutCubic));
    
    currencyAmount.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      virtualCurrency = newValue;
      currencyAmount.textContent = newValue.toLocaleString();
    }
  }
  
  requestAnimationFrame(update);
}

function addCurrency(amount) {
  const oldValue = virtualCurrency;
  const newValue = virtualCurrency + amount;
  animateCurrencyChange(oldValue, newValue);
}

updateCurrencyDisplay();

let lottieAnim = lottie.loadAnimation({
  container: document.getElementById('lottieAnimation'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'assets/DailyGift.json'
});

lottieAnim.addEventListener('complete', function() {
  setTimeout(() => {
    lottieAnim.goToAndPlay(0, true);
  }, 5000);
});

setTimeout(() => {
  lottieAnim.play();
}, 1000);

let inventoryLottieAnim = lottie.loadAnimation({
  container: document.getElementById('inventoryLottieAnimation'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'assets/CrystalForInv.json'
});

inventoryLottieAnim.addEventListener('complete', function() {
  setTimeout(() => {
    inventoryLottieAnim.goToAndPlay(0, true);
  }, 5000);
});

setTimeout(() => {
  inventoryLottieAnim.play();
}, 1000);

function toggleMenu() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
navClose.addEventListener('click', toggleMenu);

overlay.addEventListener('click', () => {
  if (navMenu.classList.contains('active')) {
    toggleMenu();
  }
  if (debugPanel.classList.contains('active')) {
    debugPanel.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    debugPanel.classList.toggle('active');
  }
  
  if (e.key === 'Escape') {
    if (navMenu.classList.contains('active')) {
      toggleMenu();
    }
    if (debugPanel.classList.contains('active')) {
      debugPanel.classList.remove('active');
    }
  }
});

function createErrorIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.style.color = '#ef4444';
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '15');
  line1.setAttribute('y1', '9');
  line1.setAttribute('x2', '9');
  line1.setAttribute('y2', '15');
  
  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '9');
  line2.setAttribute('y1', '9');
  line2.setAttribute('x2', '15');
  line2.setAttribute('y2', '15');
  
  svg.appendChild(circle);
  svg.appendChild(line1);
  svg.appendChild(line2);
  
  return svg;
}

function addNotification() {
  if (notifications.length >= MAX_NOTIFICATIONS) {
    console.log('Maximum notifications reached');
    return;
  }

  const cube = document.createElement('div');
  cube.className = 'notification-cube';
  const id = Date.now() + Math.random();
  cube.dataset.id = id;

  const icon = createErrorIcon();
  cube.appendChild(icon);

  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    removeNotification(id);
  };
  cube.appendChild(closeBtn);

  const timeBar = document.createElement('div');
  timeBar.className = 'time-bar';
  
  const timeBarFill = document.createElement('div');
  timeBarFill.className = 'time-bar-fill';
  
  timeBar.appendChild(timeBarFill);
  cube.appendChild(timeBar);

  cube.onclick = () => {
    alert('Notification clicked! ID: ' + id);
  };

  notificationContainer.appendChild(cube);
  notifications.push(id);
  updateNotificationCount();

  setTimeout(() => {
    removeNotification(id);
  }, 20000);
}

function removeNotification(id) {
  const cube = document.querySelector(`[data-id="${id}"]`);
  if (cube) {
    cube.style.animation = 'none';
    cube.style.transform = 'translateX(100px)';
    cube.style.opacity = '0';
    setTimeout(() => {
      cube.remove();
      notifications = notifications.filter(n => n !== id);
      updateNotificationCount();
    }, 300);
  }
}

function clearAllNotifications() {
  notifications.forEach(id => {
    const cube = document.querySelector(`[data-id="${id}"]`);
    if (cube) {
      cube.style.animation = 'none';
      cube.style.transform = 'translateX(100px)';
      cube.style.opacity = '0';
    }
  });
  setTimeout(() => {
    notificationContainer.innerHTML = '';
    notifications = [];
    updateNotificationCount();
  }, 300);
}

function updateNotificationCount() {
  notificationCount.textContent = notifications.length;
}

imitateWinBtn.addEventListener('click', () => {
  addNotification();
  const earnedAmount = Math.floor(Math.random() * 151) + 50;
  addCurrency(earnedAmount);
});

clearAllBtn.addEventListener('click', () => {
  clearAllNotifications();
});

document.querySelector('.content-box-left-1').addEventListener('click', () => {
  alert('Daily Bag of Loot clicked!');
});

document.querySelector('.content-box-right').addEventListener('click', () => {
  alert('Inventory clicked!');
});

document.querySelector('.content-box-bottom-1').addEventListener('click', () => {
  alert('Projects clicked!');
});

document.querySelector('.content-box-bottom-2').addEventListener('click', () => {
  alert('Contact clicked!');
});

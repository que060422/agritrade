document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const toastElement = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');
  const appToast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3200 });
  const search = document.getElementById('globalSearch');
  const tableRows = [...document.querySelectorAll('#ordersTable tbody tr')];
  const emptySearch = document.getElementById('emptySearch');

  const showToast = (message) => {
    toastMessage.textContent = message;
    appToast.show();
  };

  // Friendly date and footer year.
  const now = new Date();
  document.getElementById('todayDate').textContent = new Intl.DateTimeFormat('en-PH', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  }).format(now);
  document.getElementById('year').textContent = now.getFullYear();

  // Mobile navigation.
  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('show');
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 920 && sidebar.classList.contains('show') &&
        !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove('show');
    }
  });

  // Prototype navigation: clearly indicate screens that are not built yet.
  document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const pageName = link.dataset.page;
      document.querySelectorAll('.side-nav .nav-link').forEach((item) => {
        item.classList.toggle('active', item.dataset.page === pageName);
      });
      if (pageName !== 'Dashboard') {
        showToast(`${pageName} page is planned for the next prototype stage.`);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (window.innerWidth <= 920) sidebar.classList.remove('show');
    });
  });

  // Search filters the sample recent orders table.
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;
    tableRows.forEach((row) => {
      const matches = row.textContent.toLowerCase().includes(query) ||
        (row.dataset.search || '').toLowerCase().includes(query);
      row.classList.toggle('d-none', !matches);
      if (matches) visibleCount++;
    });
    emptySearch.classList.toggle('d-none', visibleCount > 0);
  });

  // Keyboard shortcut to focus search.
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
    }
    if (event.key === 'Escape') {
      sidebar.classList.remove('show');
      search.blur();
    }
  });

  document.getElementById('refreshButton').addEventListener('click', () => {
    search.value = '';
    tableRows.forEach((row) => row.classList.remove('d-none'));
    emptySearch.classList.add('d-none');
    showToast('Sample dashboard view refreshed. No live data is connected.');
  });

  document.getElementById('notificationButton').addEventListener('click', () => {
    showToast('Notifications will be connected after requirements are confirmed.');
  });

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      showToast(`${button.dataset.action}: this is a prototype action. The form will be added after workflow review.`);
    });
  });
});

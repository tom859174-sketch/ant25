// Main JS for static interactions: language switch, search, filters, quick preview
(function() {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function() {
    // 1) Language selector -> i18n
    try {
      const selector = document.getElementById('language-selector');
      if (selector && window.i18n && typeof window.i18n.setLanguage === 'function') {
        selector.addEventListener('change', function() {
          window.i18n.setLanguage(this.value);
        });
      }
    } catch (e) {
      console.warn('Language selector init failed:', e);
    }

    // 2) Search + Filters on resources (only on pages that have grid)
    const searchInput = document.querySelector('.search-input');
    const grid = document.querySelector('.resources-grid');
    const sidebar = document.querySelector('.filter-sidebar');

    function getSelectedLabels(sectionEl) {
      if (!sectionEl) return [];
      const checks = sectionEl.querySelectorAll('.filter-checkbox:checked');
      return Array.from(checks).map(chk => (chk.parentElement ? chk.parentElement.textContent.trim() : '')).filter(Boolean);
    }

    function applyFilters() {
      if (!grid) return; // not on index page
      const cards = grid.querySelectorAll('.resource-card');
      const text = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();

      let typeSelected = [];
      let visSelected = [];
      if (sidebar) {
        const sections = sidebar.querySelectorAll('.filter-section');
        typeSelected = getSelectedLabels(sections[0]);
        visSelected = getSelectedLabels(sections[1]);
      }

      cards.forEach(card => {
        const title = (card.querySelector('.resource-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.resource-description')?.textContent || '').toLowerCase();
        const tags = Array.from(card.querySelectorAll('.resource-tag')).map(el => el.textContent.trim());

        // Text match
        const textMatch = !text || title.includes(text) || desc.includes(text);

        // Type match
        const typeMatch = !typeSelected.length || typeSelected.some(t => tags.includes(t));

        // Visibility match
        const visMatch = !visSelected.length || visSelected.some(v => tags.includes(v));

        const visible = textMatch && typeMatch && visMatch;
        card.style.display = visible ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    if (sidebar) {
      sidebar.addEventListener('change', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('filter-checkbox')) {
          applyFilters();
        }
      });
    }
    // Run once on load
    applyFilters();

    // 3) Quick preview modal for demo
    function createModal() {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '1000';

      const modal = document.createElement('div');
      modal.style.background = 'var(--bg, #fff)';
      modal.style.color = 'var(--fg, #111)';
      modal.style.borderRadius = '12px';
      modal.style.padding = '20px';
      modal.style.width = 'min(560px, 92vw)';
      modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.style.float = 'right';
      closeBtn.style.fontSize = '20px';
      closeBtn.style.border = 'none';
      closeBtn.style.background = 'transparent';
      closeBtn.style.cursor = 'pointer';

      const titleEl = document.createElement('h3');
      const descEl = document.createElement('p');

      modal.appendChild(closeBtn);
      modal.appendChild(titleEl);
      modal.appendChild(descEl);
      overlay.appendChild(modal);

      function close() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close();
      });
      closeBtn.addEventListener('click', close);

      return { overlay, titleEl, descEl };
    }

    grid?.addEventListener('click', function(e) {
      const btn = e.target && (e.target.closest ? e.target.closest('.quick-preview-btn') : null);
      if (!btn) return;
      const card = btn.closest('.resource-card');
      if (!card) return;
      const title = card.querySelector('.resource-title')?.textContent || '';
      const desc = card.querySelector('.resource-description')?.textContent || '';

      const modal = createModal();
      modal.titleEl.textContent = title;
      modal.descEl.textContent = desc;
      document.body.appendChild(modal.overlay);
      document.body.style.overflow = 'hidden';
    });
  });
})();

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast();
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(textarea);
  showCopyToast();
}

function showCopyToast() {
  let toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.className = 'copy-toast';
    toast.textContent = '已复制';
    document.body.appendChild(toast);
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}
// Multi-language support for resource portal
const i18nTexts = {
  'zh-CN': {
    'site_title': '仁风知识仓库', // 新品牌名称：Renfeng Knowledge Depot
    'login': '登录',
    'logout': '退出',
    'about': '关于',
    'privacy_policy': '隐私政策',
    'terms_of_service': '用户协议',
    'search_placeholder': '搜索资源名称或描述...',
    'search': '搜索',
    'view': '查看',
    'download': '前往下载',
    'no_resources': '暂无资源',
    'home': '首页',
    'admin_panel': '后台',
    'resource_management': '资源管理',
    'order_management': '订单管理',
    'user_management': '用户管理',
    'file_format': '文件格式',
    'file_size': '文件大小',
    'extract_code': '提取码',
    'click_to_copy': '（点击复制）',
    'extract_code_copied': '提取码已复制到剪贴板',
    'language': '语言',
    'contact_us': '联系我们',
    'email': '邮箱',
    'email_label': '电子邮箱',
    'wechat': '微信',
    'wechat_label': '微信号',
    'services': '服务',
    'support': '支持',
    'footer_description': '致力于提供高效、安全的资源分享平台',
    'user_agreement': '用户协议',
    'site_copyright': '版权所有',
    'all_rights_reserved': '保留所有权利',
    'powered_by': '由此平台提供支持',
    
    // New navigation and brand copy
    'knowledge_hub': '知识中心',
    'resource_depot': '资源仓库',
    'global_resources': '全球资源',
    'knowledge_base': '知识库',
    'file_depot': '文件仓库',
    'discover_knowledge': '发现知识',
    'explore_resources': '探索资源',
    'trusted_platform': '可信赖的知识平台'
  },
  'zh-TW': {
    'site_title': '仁風知識倉庫', // Traditional Chinese for Renfeng Knowledge Depot
    'home': '首頁',
    'about': '關於我們',
    'privacy_policy': '隱私政策',
    'terms_of_service': '使用者協議',
    'search_placeholder': '搜尋資源名稱或描述...',
    'search': '搜尋',
    'view': '檢視',
    'download': '前往下載',
    'no_resources': '暫無資源',
    'home': '首頁',
    'admin_panel': '後台',
    'resource_management': '資源管理',
    'order_management': '訂單管理',
    'user_management': '使用者管理',
    'file_format': '檔案格式',
    'file_size': '檔案大小',
    'extract_code': '提取碼',
    'click_to_copy': '（點擊複製）',
    'extract_code_copied': '提取碼已複製到剪貼簿',
    'language': '語言',
    'contact_us': '聯繫我們',
    'email': '郵箱',
    'email_label': '電子郵箱',
    'wechat': '微信',
    'wechat_label': '微信號',
    'services': '服務',
    'support': '支持',
    'footer_description': '致力於提供高效、安全的資源分享平台',
    'user_agreement': '使用者協議',
    'site_copyright': '版權所有',
    'all_rights_reserved': '保留所有權利'
  },
  'en': {
    'site_title': 'Renfeng Knowledge Depot', // English brand name
    'home': 'Home',
    'about': 'About',
    'privacy_policy': 'Privacy Policy',
    'terms_of_service': 'Terms of Service',
    'search_placeholder': 'Search resources by name or description...',
    'search': 'Search',
    'view': 'View',
    'download': 'Download',
    'no_resources': 'No resources available',
    'home': 'Home',
    'admin_panel': 'Admin',
    'resource_management': 'Resources',
    'order_management': 'Orders',
    'user_management': 'Users',
    'file_format': 'Format',
    'file_size': 'Size',
    'extract_code': 'Extract Code',
    'click_to_copy': '(Click to copy)',
    'extract_code_copied': 'Extract code copied to clipboard',
    'language': 'Language',
    'contact_us': 'Contact Us',
    'email': 'Email',
    'email_label': 'Email Address',
    'wechat': 'WeChat',
    'wechat_label': 'WeChat ID',
    'services': 'Services',
    'support': 'Support',
    'footer_description': 'Committed to providing an efficient and secure resource sharing platform',
    'user_agreement': 'Terms of Service',
    'site_copyright': 'Copyright',
    'all_rights_reserved': 'All rights reserved'
  }
};

// Get current language from localStorage or default to zh-CN
function getCurrentLanguage() {
  return localStorage.getItem('preferred_language') || 'zh-CN';
}

// Set language and save to localStorage
function setLanguage(lang) {
  localStorage.setItem('preferred_language', lang);
  updatePageTexts(lang);
}

// Update all texts on current page
function updatePageTexts(lang) {
  const texts = i18nTexts[lang] || i18nTexts['zh-CN'];
  
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) {
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.placeholder = texts[key];
      } else {
        el.textContent = texts[key];
      }
    }
  });
  
  // Update page title if exists
  if (texts.site_title && document.querySelector('title')) {
    const titleEl = document.querySelector('title');
    if (titleEl.textContent.includes('资料下载门户') || 
        titleEl.textContent.includes('資料下載門戶') || 
        titleEl.textContent.includes('Resource Download Portal')) {
      titleEl.textContent = titleEl.textContent.replace(
        /(资料下载门户|資料下載門戶|Resource Download Portal)/, 
        texts.site_title
      );
    }
  }
  
  // Update document language
  document.documentElement.lang = lang;
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentLang = getCurrentLanguage();
  updatePageTexts(currentLang);
  
  // Set language selector if exists
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = currentLang;
  }
});

// Export for global use
window.i18n = {
  getCurrentLanguage,
  setLanguage,
  getText: (key) => {
    const lang = getCurrentLanguage();
    const texts = i18nTexts[lang] || i18nTexts['zh-CN'];
    return texts[key] || key;
  }
};
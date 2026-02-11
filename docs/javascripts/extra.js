/**
 * 自定义 JavaScript - AI Coding Learning
 * 增强网站的交互体验
 */

// ========== 阅读进度条 ==========
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.md-header');
    const content = document.querySelector('.md-content__inner');
    
    if (header && content) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            header.style.setProperty('--progress', progress + '%');
        });
    }
});

// ========== 平滑滚动 ==========
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========== 代码块增强 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 为代码块添加行号
    document.querySelectorAll('pre code').forEach((block) => {
        block.classList.add('line-numbers');
    });
    
    // 代码块双击复制
    document.querySelectorAll('.highlight').forEach(highlight => {
        highlight.addEventListener('dblclick', function() {
            const code = this.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    // 显示提示
                    const toast = document.createElement('div');
                    toast.textContent = '已复制到剪贴板!';
                    toast.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #4f46e5;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 20px;
                        font-size: 14px;
                        z-index: 10000;
                        animation: fadeInOut 2s ease;
                    `;
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.remove();
                    }, 2000);
                });
            }
        });
    });
});

// ========== 搜索增强 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 搜索框焦点效果
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('md-search--focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('md-search--focused');
        });
    }
});

// ========== 动画效果 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 为卡片添加渐入动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.grid.cards > *').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.md-search__input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC 关闭搜索
    if (e.key === 'Escape') {
        const searchOverlay = document.querySelector('.md-search__overlay');
        if (searchOverlay && searchOverlay.checked) {
            searchOverlay.checked = false;
        }
    }
});

// ========== 添加动画样式 ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    .md-search--focused .md-search__form {
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
    }
`;
document.head.appendChild(style);

// ========== 控制台欢迎信息 ==========
console.log('%c🤖 AI Coding Learning', 'font-size: 24px; font-weight: bold; color: #4f46e5;');
console.log('%c从零开始学习 AI 辅助编程', 'font-size: 14px; color: #666;');
console.log('%c快捷键: Ctrl/Cmd + K 搜索 | ESC 关闭搜索', 'font-size: 12px; color: #999;');

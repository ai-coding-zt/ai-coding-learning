(function() {
    'use strict';

    function init() {
        initCopyCode();
        initExternalLinks();
        initKeyboardShortcuts();
        initSmoothScroll();
    }

    function initCopyCode() {
        document.querySelectorAll('.highlight').forEach(block => {
            const code = block.querySelector('code');
            if (!code) return;

            block.addEventListener('dblclick', async function() {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    showToast('Copied to clipboard');
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            });
        });
    }

    function initExternalLinks() {
        document.querySelectorAll('.md-content a[href^="http"]').forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.md-search__input');
                if (searchInput) searchInput.focus();
            }
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.md-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function showToast(message) {
        const existing = document.querySelector('.notion-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'notion-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: #37352f;
            color: #fff;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transition: all 0.2s ease;
        `;
        
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => toast.remove(), 200);
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

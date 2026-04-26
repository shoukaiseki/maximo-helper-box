/**
 * Maximo UI Demo - Application JavaScript
 * Handles navigation, modals, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Elements
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const sideNav = document.getElementById('sideNav');
    const mainContent = document.getElementById('mainContent');
    const navItems = document.querySelectorAll('.nav-item');
    const appTabs = document.querySelectorAll('.app-tab');
    const appViews = document.querySelectorAll('.app-view');
    const btnNewWO = document.getElementById('btnNewWO');
    const modalNewWO = document.getElementById('modalNewWO');
    const modalClose = document.getElementById('modalClose');
    const btnCancel = document.getElementById('btnCancel');
    const toast = document.getElementById('toast');

    // ============================================
    // Side Navigation Toggle
    // ============================================
    menuToggle.addEventListener('click', function() {
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            sideNav.classList.toggle('open');
        } else {
            sideNav.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    });

    // Close side nav on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && sideNav.classList.contains('open')) {
            if (!sideNav.contains(e.target) && e.target !== menuToggle) {
                sideNav.classList.remove('open');
            }
        }
    });

    // ============================================
    // Navigation Items
    // ============================================
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active state
            navItems.forEach(function(ni) {
                ni.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding view
            appViews.forEach(function(view) {
                view.classList.remove('active');
            });
            
            const targetView = document.getElementById('view-' + target);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            // Update tab active state
            appTabs.forEach(function(tab) {
                tab.classList.remove('active');
                if (tab.getAttribute('data-app') === target) {
                    tab.classList.add('active');
                }
            });
            
            // Close mobile nav
            if (window.innerWidth <= 1024) {
                sideNav.classList.remove('open');
            }
        });
    });

    // ============================================
    // App Tabs
    // ============================================
    appTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            
            // Update active state
            appTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding view
            appViews.forEach(function(view) {
                view.classList.remove('active');
            });
            
            const targetView = document.getElementById('view-' + app);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            // Update nav item active state
            navItems.forEach(function(item) {
                item.classList.remove('active');
                if (item.getAttribute('data-target') === app) {
                    item.classList.add('active');
                }
            });
        });
    });

    // ============================================
    // Modal Handling
    // ============================================
    function openModal() {
        modalNewWO.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalNewWO.classList.remove('active');
        document.body.style.overflow = '';
    }

    btnNewWO.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    // Close modal on overlay click
    modalNewWO.addEventListener('click', function(e) {
        if (e.target === modalNewWO) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalNewWO.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================================
    // Form Submission (Demo)
    // ============================================
    const submitBtn = modalNewWO.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Simulate form submission
            closeModal();
            showToast('工单创建成功!');
        });
    }

    // ============================================
    // Toast Notification
    // ============================================
    function showToast(message) {
        const messageEl = toast.querySelector('.toast-message');
        messageEl.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // Table Row Actions
    // ============================================
    document.querySelectorAll('.btn-icon').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.getAttribute('title');
            const row = this.closest('tr');
            const id = row ? row.querySelector('.link')?.textContent : '';
            
            if (title === '查看') {
                showToast('查看工单: ' + id);
            } else if (title === '编辑') {
                showToast('编辑工单: ' + id);
            }
        });
    });

    // ============================================
    // Pagination (Demo)
    // ============================================
    document.querySelectorAll('.btn-page').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Update active state
            document.querySelectorAll('.btn-page').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            showToast('已切换到第 ' + this.textContent + ' 页');
        });
    });

    // ============================================
    // Checkbox Selection
    // ============================================
    document.querySelectorAll('.data-table thead .checkbox').forEach(function(headerCheckbox) {
        headerCheckbox.addEventListener('change', function() {
            const table = this.closest('table');
            const checkboxes = table.querySelectorAll('tbody .checkbox');
            checkboxes.forEach(function(cb) {
                cb.checked = headerCheckbox.checked;
            });
        });
    });

    // ============================================
    // Search Box (Demo)
    // ============================================
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                showToast('搜索: ' + this.value);
            }
        });
    }

    // ============================================
    // Responsive Handling
    // ============================================
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sideNav.classList.remove('open');
        }
    });

    // ============================================
    // Date Picker - Set default values
    // ============================================
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (dateInputs.length >= 2) {
        dateInputs[0].value = today;
        dateInputs[1].value = nextWeek;
    }

    console.log('Maximo UI Demo initialized successfully');
});

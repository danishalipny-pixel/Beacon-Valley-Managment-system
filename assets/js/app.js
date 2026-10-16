/**
 * School Management System - Core Application Controller
 * Handles SPA navigation, global search, mobile responsive sidebar,
 * toast notifications, header sync, and UI utilities.
 */

const App = (function () {
    let currentPage = 'dashboard';

    // Show professional toast notification
    function showToast(message, type = 'info', icon = 'fa-info-circle') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `sms-toast ${type}`;
        
        let iconColor = 'text-primary';
        if (type === 'success') iconColor = 'text-success';
        if (type === 'danger') iconColor = 'text-danger';
        if (type === 'warning') iconColor = 'text-warning';

        toast.innerHTML = `
            <div style="font-size: 18px;" class="${iconColor}">
                <i class="fas ${icon}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${getToastTitle(type)}</div>
                <div style="font-size: 12px; color: #475569;">${message}</div>
            </div>
            <button type="button" class="btn-close" style="font-size: 10px;" aria-label="Close"></button>
        `;

        toast.querySelector('.btn-close').addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function getToastTitle(type) {
        switch (type) {
            case 'success': return 'Success';
            case 'danger': return 'Error';
            case 'warning': return 'Notice';
            default: return 'Notification';
        }
    }

    // Switch between pages smoothly without reloading
    function navigateTo(pageId, params = {}) {
        const allPages = document.querySelectorAll('.page-view');
        allPages.forEach(p => p.classList.remove('active'));

        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageId;

            // Update URL search param for browser history & direct links
            try {
                let url = `?page=${pageId}`;
                if (params.studentId) url += `&id=${params.studentId}`;
                if (params.teacherId) url += `&id=${params.teacherId}`;
                window.history.replaceState(null, '', url);
            } catch (e) {}

            // Update sidebar active link
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                }
            });

            // Close mobile sidebar on navigation
            closeMobileSidebar();

            // Trigger page-specific load handlers
            window.dispatchEvent(new CustomEvent('pageNavigated', { detail: { page: pageId, params: params } }));

            // Scroll top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Mobile Sidebar Drawer Management
    function openMobileSidebar() {
        document.getElementById('sidebar')?.classList.add('show');
        document.getElementById('sidebar-backdrop')?.classList.add('show');
    }

    function closeMobileSidebar() {
        document.getElementById('sidebar')?.classList.remove('show');
        document.getElementById('sidebar-backdrop')?.classList.remove('show');
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 1024) {
            if (sidebar.classList.contains('show')) closeMobileSidebar();
            else openMobileSidebar();
        } else {
            document.getElementById('app-container').classList.toggle('sidebar-collapsed');
        }
    }

    // Live Clock & Date in Header
    function startClock() {
        const clockEl = document.getElementById('live-clock-text');
        if (!clockEl) return;

        function update() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
            clockEl.textContent = `${dateStr} • ${timeStr}`;
        }
        update();
        setInterval(update, 1000);
    }

    // Sync header academic year & settings
    function syncHeaderSettings() {
        const settings = SchoolDB.getSettings();
        const yearBadges = document.querySelectorAll('.active-academic-year-text');
        yearBadges.forEach(b => b.textContent = settings.activeAcademicYear);

        const schoolNameElements = document.querySelectorAll('.school-name-text');
        schoolNameElements.forEach(el => el.textContent = settings.schoolName);
    }

    // Global Live Search functionality
    function initGlobalSearch() {
        const searchInput = document.getElementById('global-search-input');
        const searchPopup = document.getElementById('global-search-results');
        if (!searchInput || !searchPopup) return;

        searchInput.addEventListener('input', function (e) {
            const term = e.target.value.trim().toLowerCase();
            if (term.length < 2) {
                searchPopup.classList.remove('show');
                searchPopup.innerHTML = '';
                return;
            }

            const students = SchoolDB.getStudents();
            const teachers = SchoolDB.getTeachers();

            const matchedStudents = students.filter(s => 
                s.fullName.toLowerCase().includes(term) ||
                s.id.toLowerCase().includes(term) ||
                (s.rollNumber && s.rollNumber.toLowerCase().includes(term)) ||
                (s.fatherName && s.fatherName.toLowerCase().includes(term)) ||
                (s.studentPhone && s.studentPhone.includes(term)) ||
                (s.className && s.className.toLowerCase().includes(term))
            ).slice(0, 5);

            const matchedTeachers = teachers.filter(t => 
                t.fullName.toLowerCase().includes(term) ||
                t.id.toLowerCase().includes(term) ||
                (t.subject && t.subject.toLowerCase().includes(term)) ||
                (t.phone && t.phone.includes(term))
            ).slice(0, 4);

            if (matchedStudents.length === 0 && matchedTeachers.length === 0) {
                searchPopup.innerHTML = `
                    <div style="padding: 16px; text-align: center; color: #64748b; font-size: 13px;">
                        <i class="fas fa-search me-2"></i> No records found for "${term}"
                    </div>
                `;
                searchPopup.classList.add('show');
                return;
            }

            let html = '';

            if (matchedStudents.length > 0) {
                html += `<div class="search-group-header">Students (${matchedStudents.length})</div>`;
                matchedStudents.forEach(s => {
                    html += `
                        <div class="search-item" data-type="student" data-id="${s.id}">
                            <img src="${s.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}" class="search-item-avatar" alt="${s.fullName}">
                            <div class="search-item-info">
                                <div class="search-item-name">${s.fullName} <span class="badge bg-primary-subtle text-primary ms-1" style="font-size: 10px;">${s.id}</span></div>
                                <div class="search-item-meta">${s.className} (${s.section}) • Roll: ${s.rollNumber} • Father: ${s.fatherName}</div>
                            </div>
                            <span class="btn btn-sm btn-outline-primary" style="font-size: 11px;">View Profile</span>
                        </div>
                    `;
                });
            }

            if (matchedTeachers.length > 0) {
                html += `<div class="search-group-header">Teachers (${matchedTeachers.length})</div>`;
                matchedTeachers.forEach(t => {
                    const initials = t.fullName.split(' ').map(n => n[0]).slice(0, 2).join('');
                    html += `
                        <div class="search-item" data-type="teacher" data-id="${t.id}">
                            <div class="search-item-avatar bg-dark text-white">${initials}</div>
                            <div class="search-item-info">
                                <div class="search-item-name">${t.fullName} <span class="badge bg-secondary-subtle text-secondary ms-1" style="font-size: 10px;">${t.id}</span></div>
                                <div class="search-item-meta">${t.subject} • ${t.classAssigned} • ${t.phone}</div>
                            </div>
                            <span class="btn btn-sm btn-outline-dark" style="font-size: 11px;">View Profile</span>
                        </div>
                    `;
                });
            }

            searchPopup.innerHTML = html;
            searchPopup.classList.add('show');

            // Attach click listeners to search results
            searchPopup.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', function () {
                    const type = this.getAttribute('data-type');
                    const id = this.getAttribute('data-id');
                    searchPopup.classList.remove('show');
                    searchInput.value = '';

                    if (type === 'student') {
                        StudentsModule.viewProfile(id);
                    } else if (type === 'teacher') {
                        TeachersModule.viewProfile(id);
                    }
                });
            });
        });

        // Close search popup on outside click
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchPopup.contains(e.target)) {
                searchPopup.classList.remove('show');
            }
        });
    }

    // Modal Confirmation Dialog Helper
    function confirmAction(title, message, confirmBtnText = 'Confirm', onConfirm) {
        const modalEl = document.getElementById('generic-confirm-modal');
        if (!modalEl) {
            if (confirm(message)) onConfirm();
            return;
        }

        document.getElementById('confirm-modal-title').textContent = title;
        document.getElementById('confirm-modal-message').textContent = message;
        const confirmBtn = document.getElementById('confirm-modal-action-btn');
        confirmBtn.textContent = confirmBtnText;

        const bsModal = new bootstrap.Modal(modalEl);
        
        // Remove previous listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', () => {
            bsModal.hide();
            onConfirm();
        });

        bsModal.show();
    }

    // Initializer
    function init() {
        startClock();
        syncHeaderSettings();
        initGlobalSearch();

        // Bind sidebar navigation links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) navigateTo(pageId);
            });
        });

        // Sidebar hamburger and backdrop bindings
        document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
        document.getElementById('sidebar-close-btn')?.addEventListener('click', closeMobileSidebar);
        document.getElementById('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);

        // Quick add buttons
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.getAttribute('data-action');
                if (target === 'add-student') StudentsModule.openAddModal();
                if (target === 'add-teacher') TeachersModule.openAddModal();
                if (target === 'record-fee') FeesModule.openRecordPaymentModal();
                if (target === 'apply-student-leave') LeavesModule.openStudentLeaveModal();
                if (target === 'apply-teacher-leave') LeavesModule.openTeacherLeaveModal();
            });
        });

        // Support direct page linking via URL parameter (e.g. ?page=students)
        // Default direct landing on Dashboard if no param
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const pageFromUrl = urlParams.get('page') || window.location.hash.replace('#', '');
            const idFromUrl = urlParams.get('id');

            if (pageFromUrl && document.getElementById(`page-${pageFromUrl}`)) {
                if (pageFromUrl === 'student-profile') {
                    const studentId = idFromUrl || SchoolDB.getStudents()[0]?.id;
                    if (studentId) StudentsModule.viewProfile(studentId);
                    else navigateTo('students');
                } else if (pageFromUrl === 'teacher-profile') {
                    const teacherId = idFromUrl || SchoolDB.getTeachers()[0]?.id;
                    if (teacherId) TeachersModule.viewProfile(teacherId);
                    else navigateTo('teachers');
                } else {
                    navigateTo(pageFromUrl);
                }
            } else {
                navigateTo('dashboard');
            }
        } catch (e) {
            navigateTo('dashboard');
        }
    }

    return {
        init: init,
        navigateTo: navigateTo,
        showToast: showToast,
        confirmAction: confirmAction,
        syncHeaderSettings: syncHeaderSettings,
        getCurrentPage: function () { return currentPage; }
    };
})();

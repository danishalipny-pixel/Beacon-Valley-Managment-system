/**
 * School Management System - Academic Architecture Controller
 * Manages Classes & Sections, Subjects assignments, and Academic Years lifecycle.
 */

const AcademicModule = (function () {

    // =========================================================================
    // CLASSES & SECTIONS
    // =========================================================================
    function renderClasses() {
        const classes = SchoolDB.getClasses();
        const students = SchoolDB.getStudents();
        const teachers = SchoolDB.getTeachers();

        const grid = document.getElementById('classes-grid-container');
        if (!grid) return;

        grid.innerHTML = classes.map(c => {
            const enrolled = students.filter(s => s.classId === c.id || s.className === c.name).length;
            const teacher = teachers.find(t => t.id === c.teacherId) || {};
            const sections = c.sections || ["A", "B"];

            return `
                <div class="col-xl-4 col-md-6 mb-4">
                    <div class="content-card h-100 mb-0">
                        <div class="content-card-header">
                            <div>
                                <span class="badge bg-primary-subtle text-primary mb-1" style="font-size: 11px;">${c.category || 'Standard'}</span>
                                <h5 class="fw-bold mb-0 text-dark">${c.name}</h5>
                            </div>
                            <div class="action-btn-group">
                                <button class="table-action-btn edit-btn" title="Edit Class" onclick="AcademicModule.openEditClassModal('${c.id}')">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="table-action-btn delete-btn" title="Delete Class" onclick="AcademicModule.deleteClass('${c.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="content-card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                                <div>
                                    <div class="text-muted" style="font-size: 11.5px; text-transform: uppercase;">Students Enrolled</div>
                                    <div class="fs-4 fw-bold text-primary">${enrolled} <span class="text-muted fs-6 fw-normal">/ ${c.studentCapacity || 35}</span></div>
                                </div>
                                <div class="text-end">
                                    <div class="text-muted" style="font-size: 11.5px; text-transform: uppercase;">Room Number</div>
                                    <div class="fs-5 fw-bold text-dark">${c.roomNo || 'Room 101'}</div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="text-muted mb-1" style="font-size: 12px; font-weight: 600;">CLASS TEACHER</div>
                                <div class="d-flex align-items-center gap-2">
                                    <i class="fas fa-user-tie text-secondary"></i>
                                    <span class="fw-bold text-dark" style="font-size: 13.5px;">${teacher.fullName || 'Not Assigned'}</span>
                                </div>
                            </div>

                            <div>
                                <div class="text-muted mb-2" style="font-size: 12px; font-weight: 600;">ACTIVE SECTIONS</div>
                                <div class="d-flex gap-2 flex-wrap">
                                    ${sections.map(sec => `
                                        <span class="badge bg-white text-dark border px-3 py-2 fw-bold" style="font-size: 12px;">
                                            Section ${sec}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function openAddClassModal() {
        document.getElementById('class-form').reset();
        document.getElementById('class-modal-title').textContent = 'Add New Class';
        document.getElementById('class-form-id').value = '';

        populateTeacherDropdown('class-input-teacher');

        const modalEl = document.getElementById('class-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function openEditClassModal(classId) {
        const cls = SchoolDB.getClassById(classId);
        if (!cls) return;

        document.getElementById('class-modal-title').textContent = `Edit Class: ${cls.name}`;
        document.getElementById('class-form-id').value = cls.id;
        document.getElementById('class-input-name').value = cls.name;
        document.getElementById('class-input-category').value = cls.category || 'Primary';
        document.getElementById('class-input-room').value = cls.roomNo || '';
        document.getElementById('class-input-capacity').value = cls.studentCapacity || 35;
        document.getElementById('class-input-sections').value = (cls.sections || []).join(', ');

        populateTeacherDropdown('class-input-teacher', cls.teacherId);

        const modalEl = document.getElementById('class-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function populateTeacherDropdown(selectId, selectedId = '') {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        const teachers = SchoolDB.getTeachers();
        sel.innerHTML = '<option value="">-- Select Class Teacher --</option>' + teachers.map(t => `
            <option value="${t.id}" ${t.id === selectedId ? 'selected' : ''}>${t.fullName} (${t.subject})</option>
        `).join('');
    }

    function handleClassSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('class-form-id').value;
        const rawSec = document.getElementById('class-input-sections').value;
        const sectionsArray = rawSec.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

        const classData = {
            id: id || undefined,
            name: document.getElementById('class-input-name').value.trim(),
            category: document.getElementById('class-input-category').value,
            teacherId: document.getElementById('class-input-teacher').value,
            roomNo: document.getElementById('class-input-room').value.trim(),
            studentCapacity: parseInt(document.getElementById('class-input-capacity').value) || 35,
            sections: sectionsArray.length > 0 ? sectionsArray : ["A", "B"]
        };

        if (!classData.name) {
            App.showToast('Please specify a Class Name.', 'warning');
            return;
        }

        SchoolDB.saveClass(classData);
        App.showToast(`Class "${classData.name}" saved successfully.`, 'success', 'fa-chalkboard');

        const modalEl = document.getElementById('class-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderClasses();
    }

    function deleteClass(classId) {
        const cls = SchoolDB.getClassById(classId);
        if (!cls) return;

        App.confirmAction(
            'Delete Class',
            `Are you sure you want to delete "${cls.name}"? Note that students assigned to this class should be reallocated.`,
            'Yes, Delete',
            function () {
                SchoolDB.deleteClass(classId);
                App.showToast(`Class "${cls.name}" deleted.`, 'warning');
                renderClasses();
            }
        );
    }

    // =========================================================================
    // SUBJECTS MODULE
    // =========================================================================
    function renderSubjects() {
        const subjects = SchoolDB.getSubjects();
        const classes = SchoolDB.getClasses();
        const teachers = SchoolDB.getTeachers();

        const searchVal = document.getElementById('filter-subject-search')?.value.trim().toLowerCase() || '';
        const classVal = document.getElementById('filter-subject-class')?.value || '';

        const filtered = subjects.filter(sub => {
            if (searchVal) {
                const matchName = sub.name.toLowerCase().includes(searchVal);
                const matchCode = sub.code && sub.code.toLowerCase().includes(searchVal);
                if (!matchName && !matchCode) return false;
            }
            if (classVal && sub.classId !== classVal) return false;
            return true;
        });

        const tbody = document.getElementById('subjects-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No subjects found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(sub => {
            const cls = classes.find(c => c.id === sub.classId) || {};
            const tch = teachers.find(t => t.id === sub.teacherId) || {};
            return `
                <tr>
                    <td><span class="badge bg-light text-dark border">${sub.id}</span></td>
                    <td><span class="badge bg-secondary-subtle text-secondary">${sub.code || 'GEN-01'}</span></td>
                    <td><span class="fw-bold text-dark">${sub.name}</span></td>
                    <td><span class="fw-semibold">${cls.name || 'All Classes'}</span></td>
                    <td>
                        <div class="fw-bold">${tch.fullName || 'Unassigned'}</div>
                        <div class="text-muted" style="font-size: 11px;">${tch.id || '-'}</div>
                    </td>
                    <td><span class="badge bg-info-subtle text-info">${sub.type || 'Core'}</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="table-action-btn edit-btn" title="Edit Subject" onclick="AcademicModule.openEditSubjectModal('${sub.id}')">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="table-action-btn delete-btn" title="Delete Subject" onclick="AcademicModule.deleteSubject('${sub.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function openAddSubjectModal() {
        document.getElementById('subject-form').reset();
        document.getElementById('subject-modal-title').textContent = 'Add New Subject';
        document.getElementById('subject-form-id').value = '';

        populateClassDropdown('subject-input-class');
        populateTeacherDropdown('subject-input-teacher');

        const modalEl = document.getElementById('subject-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function openEditSubjectModal(subjectId) {
        const subjects = SchoolDB.getSubjects();
        const sub = subjects.find(s => s.id === subjectId);
        if (!sub) return;

        document.getElementById('subject-modal-title').textContent = `Edit Subject: ${sub.name}`;
        document.getElementById('subject-form-id').value = sub.id;
        document.getElementById('subject-input-name').value = sub.name;
        document.getElementById('subject-input-code').value = sub.code || '';
        document.getElementById('subject-input-type').value = sub.type || 'Core';

        populateClassDropdown('subject-input-class', sub.classId);
        populateTeacherDropdown('subject-input-teacher', sub.teacherId);

        const modalEl = document.getElementById('subject-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function populateClassDropdown(selectId, selectedId = '') {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        const classes = SchoolDB.getClasses();
        sel.innerHTML = classes.map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name}</option>`).join('');
    }

    function handleSubjectSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('subject-form-id').value;

        const subData = {
            id: id || undefined,
            name: document.getElementById('subject-input-name').value.trim(),
            code: document.getElementById('subject-input-code').value.trim(),
            classId: document.getElementById('subject-input-class').value,
            teacherId: document.getElementById('subject-input-teacher').value,
            type: document.getElementById('subject-input-type').value,
            status: "Active"
        };

        if (!subData.name) {
            App.showToast('Please specify a Subject Name.', 'warning');
            return;
        }

        SchoolDB.saveSubject(subData);
        App.showToast(`Subject "${subData.name}" saved.`, 'success', 'fa-book');

        const modalEl = document.getElementById('subject-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderSubjects();
    }

    function deleteSubject(subjectId) {
        App.confirmAction(
            'Delete Subject',
            'Are you sure you want to delete this curriculum subject?',
            'Yes, Delete',
            function () {
                SchoolDB.deleteSubject(subjectId);
                App.showToast('Subject removed.', 'warning');
                renderSubjects();
            }
        );
    }

    // =========================================================================
    // ACADEMIC YEARS MODULE
    // =========================================================================
    function renderAcademicYears() {
        const years = SchoolDB.getAcademicYears();
        const settings = SchoolDB.getSettings();

        const tbody = document.getElementById('academic-years-table-body');
        if (!tbody) return;

        tbody.innerHTML = years.map(y => `
            <tr>
                <td><span class="badge bg-light text-dark border">${y.id}</span></td>
                <td><strong class="fs-6">${y.year}</strong></td>
                <td>${y.startDate || '2025-08-01'}</td>
                <td>${y.endDate || '2026-06-30'}</td>
                <td>
                    <span class="badge-status ${y.status === 'Active' ? 'badge-status-active' : (y.status === 'Upcoming' ? 'badge-status-leave' : 'badge-status-inactive')}">
                        ${y.status}
                    </span>
                </td>
                <td>
                    ${y.status === 'Active' ? `
                        <span class="badge bg-success-subtle text-success fw-bold px-3 py-1"><i class="fas fa-check-circle me-1"></i> Current Active Session</span>
                    ` : `
                        <button class="btn btn-sm btn-outline-primary" onclick="AcademicModule.setActiveYear('${y.year}')">
                            <i class="fas fa-toggle-on me-1"></i> Set as Active Session
                        </button>
                    `}
                </td>
            </tr>
        `).join('');
    }

    function openAddYearModal() {
        document.getElementById('year-form').reset();
        const modalEl = document.getElementById('year-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function handleYearSubmit(e) {
        e.preventDefault();
        const yearName = document.getElementById('year-input-name').value.trim();
        const startDate = document.getElementById('year-input-start').value;
        const endDate = document.getElementById('year-input-end').value;

        if (!yearName) {
            App.showToast('Please provide an Academic Year name (e.g. 2026-27).', 'warning');
            return;
        }

        const newYear = {
            id: "AY-" + Date.now().toString().slice(-4),
            year: yearName,
            startDate: startDate,
            endDate: endDate,
            status: "Upcoming"
        };

        SchoolDB.saveAcademicYear(newYear);
        App.showToast(`Academic Year ${yearName} added.`, 'success', 'fa-calendar-alt');

        const modalEl = document.getElementById('year-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderAcademicYears();
    }

    function setActiveYear(yearName) {
        SchoolDB.setActiveAcademicYear(yearName);
        App.syncHeaderSettings();
        App.showToast(`Active Academic Year updated to ${yearName}.`, 'success', 'fa-check-double');
        renderAcademicYears();
    }

    function init() {
        document.getElementById('btn-add-class')?.addEventListener('click', openAddClassModal);
        document.getElementById('class-form')?.addEventListener('submit', handleClassSubmit);

        document.getElementById('btn-add-subject')?.addEventListener('click', openAddSubjectModal);
        document.getElementById('subject-form')?.addEventListener('submit', handleSubjectSubmit);
        document.getElementById('filter-subject-search')?.addEventListener('input', renderSubjects);
        document.getElementById('filter-subject-class')?.addEventListener('change', renderSubjects);

        document.getElementById('btn-add-year')?.addEventListener('click', openAddYearModal);
        document.getElementById('year-form')?.addEventListener('submit', handleYearSubmit);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'classes') renderClasses();
            else if (e.detail.page === 'subjects') renderSubjects();
            else if (e.detail.page === 'academic-years') renderAcademicYears();
        });

        // Initial render
        renderClasses();
        renderSubjects();
        renderAcademicYears();
    }

    return {
        init: init,
        renderClasses: renderClasses,
        openAddClassModal: openAddClassModal,
        openEditClassModal: openEditClassModal,
        deleteClass: deleteClass,
        renderSubjects: renderSubjects,
        openAddSubjectModal: openAddSubjectModal,
        openEditSubjectModal: openEditSubjectModal,
        deleteSubject: deleteSubject,
        renderAcademicYears: renderAcademicYears,
        openAddYearModal: openAddYearModal,
        setActiveYear: setActiveYear
    };
})();

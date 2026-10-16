/**
 * School Management System - Leaves Controller
 * Handles Student Leaves and Teacher Leaves workflows,
 * application modal, approval/rejection actions, and statistics.
 */

const LeavesModule = (function () {

    // =========================================================================
    // STUDENT LEAVES
    // =========================================================================
    function renderStudentLeaves() {
        const leaves = SchoolDB.getStudentLeaves();
        const statusVal = document.getElementById('filter-student-leave-status')?.value || '';
        const searchVal = document.getElementById('filter-student-leave-search')?.value.trim().toLowerCase() || '';

        const filtered = leaves.filter(l => {
            if (statusVal && l.status !== statusVal) return false;
            if (searchVal) {
                const matchName = l.studentName && l.studentName.toLowerCase().includes(searchVal);
                const matchClass = l.className && l.className.toLowerCase().includes(searchVal);
                const matchReason = l.reason && l.reason.toLowerCase().includes(searchVal);
                if (!matchName && !matchClass && !matchReason) return false;
            }
            return true;
        });

        // Update stats
        const totalLeaves = leaves.length;
        const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
        const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
        const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

        document.getElementById('stat-std-leave-total').textContent = totalLeaves;
        document.getElementById('stat-std-leave-pending').textContent = pendingLeaves;
        document.getElementById('stat-std-leave-approved').textContent = approvedLeaves;
        document.getElementById('stat-std-leave-rejected').textContent = rejectedLeaves;

        const tbody = document.getElementById('student-leaves-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No student leave requests found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(l => `
            <tr>
                <td><span class="badge bg-light text-dark border">${l.id}</span></td>
                <td>
                    <div class="fw-bold">${l.studentName}</div>
                    <div class="text-muted" style="font-size: 11px;">ID: ${l.studentId}</div>
                </td>
                <td>${l.className} (${l.section})</td>
                <td><strong>${l.leaveFrom}</strong> to <strong>${l.leaveTo}</strong></td>
                <td><span class="badge bg-secondary-subtle text-secondary">${l.days} Days</span></td>
                <td><span style="font-size: 12.5px; color: #334155;">${l.reason}</span></td>
                <td><span class="badge-status badge-status-${l.status.toLowerCase()}">${l.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        ${l.status === 'Pending' ? `
                            <button class="btn btn-sm btn-success py-1 px-2" style="font-size: 11px;" title="Approve Leave" onclick="LeavesModule.updateStudentStatus('${l.id}', 'Approved')">
                                <i class="fas fa-check me-1"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-danger py-1 px-2" style="font-size: 11px;" title="Reject Leave" onclick="LeavesModule.updateStudentStatus('${l.id}', 'Rejected')">
                                <i class="fas fa-times me-1"></i> Reject
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 11px;" onclick="LeavesModule.updateStudentStatus('${l.id}', '${l.status === 'Approved' ? 'Pending' : 'Approved'}')">
                                Change
                            </button>
                        `}
                        <button class="table-action-btn delete-btn" title="Delete Application" onclick="LeavesModule.deleteStudentLeave('${l.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function openStudentLeaveModal() {
        const form = document.getElementById('student-leave-form');
        if (form) form.reset();

        // Populate student selector
        const stdSelect = document.getElementById('std-leave-student-select');
        const students = SchoolDB.getStudents();
        stdSelect.innerHTML = students.map(s => `
            <option value="${s.id}" data-class="${s.className}" data-section="${s.section}" data-name="${s.fullName}">
                ${s.fullName} (${s.className}-${s.section} | ID: ${s.id})
            </option>
        `).join('');

        document.getElementById('std-leave-applied-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('std-leave-from').value = new Date().toISOString().split('T')[0];
        document.getElementById('std-leave-to').value = new Date().toISOString().split('T')[0];
        document.getElementById('std-leave-days').value = '1';

        const modalEl = document.getElementById('student-leave-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function handleStudentLeaveSubmit(e) {
        e.preventDefault();
        const stdSelect = document.getElementById('std-leave-student-select');
        const selectedOpt = stdSelect.options[stdSelect.selectedIndex];

        const leaveFrom = document.getElementById('std-leave-from').value;
        const leaveTo = document.getElementById('std-leave-to').value;
        const days = parseInt(document.getElementById('std-leave-days').value) || 1;

        const newLeave = {
            studentId: stdSelect.value,
            studentName: selectedOpt.getAttribute('data-name'),
            className: selectedOpt.getAttribute('data-class'),
            section: selectedOpt.getAttribute('data-section'),
            leaveFrom: leaveFrom,
            leaveTo: leaveTo,
            days: days,
            reason: document.getElementById('std-leave-reason').value.trim() || 'Personal leave',
            appliedDate: document.getElementById('std-leave-applied-date').value,
            status: document.getElementById('std-leave-status').value || 'Pending'
        };

        SchoolDB.saveStudentLeave(newLeave);
        App.showToast('Student leave application submitted successfully.', 'success', 'fa-calendar-plus');

        const modalEl = document.getElementById('student-leave-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderStudentLeaves();
    }

    function updateStudentStatus(leaveId, newStatus) {
        SchoolDB.updateStudentLeaveStatus(leaveId, newStatus);
        App.showToast(`Leave status updated to ${newStatus}.`, 'info');
        renderStudentLeaves();
    }

    function deleteStudentLeave(leaveId) {
        App.confirmAction(
            'Delete Leave Request',
            'Are you sure you want to delete this student leave record?',
            'Yes, Delete',
            function () {
                SchoolDB.deleteStudentLeave(leaveId);
                App.showToast('Leave record removed.', 'warning');
                renderStudentLeaves();
            }
        );
    }

    // =========================================================================
    // TEACHER LEAVES
    // =========================================================================
    function renderTeacherLeaves() {
        const leaves = SchoolDB.getTeacherLeaves();
        const statusVal = document.getElementById('filter-teacher-leave-status')?.value || '';
        const searchVal = document.getElementById('filter-teacher-leave-search')?.value.trim().toLowerCase() || '';

        const filtered = leaves.filter(l => {
            if (statusVal && l.status !== statusVal) return false;
            if (searchVal) {
                const matchName = l.teacherName && l.teacherName.toLowerCase().includes(searchVal);
                const matchReason = l.reason && l.reason.toLowerCase().includes(searchVal);
                if (!matchName && !matchReason) return false;
            }
            return true;
        });

        const totalLeaves = leaves.length;
        const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
        const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
        const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

        document.getElementById('stat-tch-leave-total').textContent = totalLeaves;
        document.getElementById('stat-tch-leave-pending').textContent = pendingLeaves;
        document.getElementById('stat-tch-leave-approved').textContent = approvedLeaves;
        document.getElementById('stat-tch-leave-rejected').textContent = rejectedLeaves;

        const tbody = document.getElementById('teacher-leaves-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No teacher leave requests found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(l => `
            <tr>
                <td><span class="badge bg-light text-dark border">${l.id}</span></td>
                <td>
                    <div class="fw-bold">${l.teacherName}</div>
                    <div class="text-muted" style="font-size: 11px;">ID: ${l.teacherId}</div>
                </td>
                <td><strong>${l.leaveFrom}</strong> to <strong>${l.leaveTo}</strong></td>
                <td><span class="badge bg-secondary-subtle text-secondary">${l.days} Days</span></td>
                <td><span style="font-size: 12.5px; color: #334155;">${l.reason}</span></td>
                <td><span style="font-size: 12px; color: #64748b;">${l.approvedBy || 'Pending Review'}</span></td>
                <td><span class="badge-status badge-status-${l.status.toLowerCase()}">${l.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        ${l.status === 'Pending' ? `
                            <button class="btn btn-sm btn-success py-1 px-2" style="font-size: 11px;" title="Approve Leave" onclick="LeavesModule.updateTeacherStatus('${l.id}', 'Approved')">
                                <i class="fas fa-check me-1"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-danger py-1 px-2" style="font-size: 11px;" title="Reject Leave" onclick="LeavesModule.updateTeacherStatus('${l.id}', 'Rejected')">
                                <i class="fas fa-times me-1"></i> Reject
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 11px;" onclick="LeavesModule.updateTeacherStatus('${l.id}', '${l.status === 'Approved' ? 'Pending' : 'Approved'}')">
                                Change
                            </button>
                        `}
                        <button class="table-action-btn delete-btn" title="Delete Application" onclick="LeavesModule.deleteTeacherLeave('${l.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function openTeacherLeaveModal() {
        const form = document.getElementById('teacher-leave-form');
        if (form) form.reset();

        const tchSelect = document.getElementById('tch-leave-teacher-select');
        const teachers = SchoolDB.getTeachers();
        tchSelect.innerHTML = teachers.map(t => `
            <option value="${t.id}" data-name="${t.fullName}">
                ${t.fullName} (${t.subject} | ID: ${t.id})
            </option>
        `).join('');

        document.getElementById('tch-leave-applied-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('tch-leave-from').value = new Date().toISOString().split('T')[0];
        document.getElementById('tch-leave-to').value = new Date().toISOString().split('T')[0];
        document.getElementById('tch-leave-days').value = '1';

        const modalEl = document.getElementById('teacher-leave-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function handleTeacherLeaveSubmit(e) {
        e.preventDefault();
        const tchSelect = document.getElementById('tch-leave-teacher-select');
        const selectedOpt = tchSelect.options[tchSelect.selectedIndex];

        const leaveFrom = document.getElementById('tch-leave-from').value;
        const leaveTo = document.getElementById('tch-leave-to').value;
        const days = parseInt(document.getElementById('tch-leave-days').value) || 1;

        const newLeave = {
            teacherId: tchSelect.value,
            teacherName: selectedOpt.getAttribute('data-name'),
            leaveFrom: leaveFrom,
            leaveTo: leaveTo,
            days: days,
            reason: document.getElementById('tch-leave-reason').value.trim() || 'Academic leave',
            appliedDate: document.getElementById('tch-leave-applied-date').value,
            status: document.getElementById('tch-leave-status').value || 'Pending',
            approvedBy: document.getElementById('tch-leave-status').value === 'Approved' ? 'Principal Dr. Tariq Mansoor' : 'Pending'
        };

        SchoolDB.saveTeacherLeave(newLeave);
        App.showToast('Teacher leave application submitted successfully.', 'success', 'fa-calendar-plus');

        const modalEl = document.getElementById('teacher-leave-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderTeacherLeaves();
    }

    function updateTeacherStatus(leaveId, newStatus) {
        const settings = SchoolDB.getSettings();
        const approvedBy = newStatus === 'Approved' ? settings.principalName : '-';
        SchoolDB.updateTeacherLeaveStatus(leaveId, newStatus, approvedBy);
        App.showToast(`Faculty leave marked ${newStatus}.`, 'info');
        renderTeacherLeaves();
    }

    function deleteTeacherLeave(leaveId) {
        App.confirmAction(
            'Delete Faculty Leave Request',
            'Are you sure you want to delete this faculty leave application?',
            'Yes, Delete',
            function () {
                SchoolDB.deleteTeacherLeave(leaveId);
                App.showToast('Faculty leave record removed.', 'warning');
                renderTeacherLeaves();
            }
        );
    }

    function init() {
        document.getElementById('btn-add-student-leave')?.addEventListener('click', openStudentLeaveModal);
        document.getElementById('student-leave-form')?.addEventListener('submit', handleStudentLeaveSubmit);
        document.getElementById('filter-student-leave-status')?.addEventListener('change', renderStudentLeaves);
        document.getElementById('filter-student-leave-search')?.addEventListener('input', renderStudentLeaves);

        document.getElementById('btn-add-teacher-leave')?.addEventListener('click', openTeacherLeaveModal);
        document.getElementById('teacher-leave-form')?.addEventListener('submit', handleTeacherLeaveSubmit);
        document.getElementById('filter-teacher-leave-status')?.addEventListener('change', renderTeacherLeaves);
        document.getElementById('filter-teacher-leave-search')?.addEventListener('input', renderTeacherLeaves);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'student-leaves') {
                renderStudentLeaves();
            } else if (e.detail.page === 'teacher-leaves') {
                renderTeacherLeaves();
            }
        });

        // Initial render
        renderStudentLeaves();
        renderTeacherLeaves();
    }

    return {
        init: init,
        openStudentLeaveModal: openStudentLeaveModal,
        openTeacherLeaveModal: openTeacherLeaveModal,
        updateStudentStatus: updateStudentStatus,
        updateTeacherStatus: updateTeacherStatus,
        deleteStudentLeave: deleteStudentLeave,
        deleteTeacherLeave: deleteTeacherLeave
    };
})();

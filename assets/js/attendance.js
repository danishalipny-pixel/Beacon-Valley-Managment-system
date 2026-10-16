/**
 * School Management System - Attendance Controller
 * Handles Student Attendance (daily sheets, bulk mark, monthly register)
 * and Teacher Attendance (check-in, check-out, late tracking, monthly register).
 */

const AttendanceModule = (function () {

    // =========================================================================
    // STUDENT ATTENDANCE
    // =========================================================================
    let currentStudentAttendanceData = [];

    function initStudentAttendanceView() {
        const dateInput = document.getElementById('att-student-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = "2026-10-16";
        }

        // Populate class selector
        const classSelect = document.getElementById('att-student-class');
        if (classSelect && classSelect.children.length === 0) {
            const classes = SchoolDB.getClasses();
            classSelect.innerHTML = classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            classSelect.value = "CLS-9"; // default Grade 9
        }

        loadStudentAttendanceSheet();
    }

    function loadStudentAttendanceSheet() {
        const date = document.getElementById('att-student-date')?.value || "2026-10-16";
        const classId = document.getElementById('att-student-class')?.value || "CLS-9";
        const section = document.getElementById('att-student-section')?.value || "A";

        const allStudents = SchoolDB.getStudents();
        const existingAttendance = SchoolDB.getStudentAttendance(date);

        // Filter students belonging to this class & section
        const classStudents = allStudents.filter(s => (s.classId === classId || s.className === classId) && s.section === section);

        // Map into working attendance array
        currentStudentAttendanceData = classStudents.map(std => {
            const recorded = existingAttendance.find(a => a.studentId === std.id);
            return {
                studentId: std.id,
                studentName: std.fullName,
                rollNumber: std.rollNumber,
                classId: classId,
                section: section,
                date: date,
                status: recorded ? recorded.status : 'Present', // default to Present
                remarks: recorded ? recorded.remarks : ''
            };
        });

        renderStudentAttendanceSheet();
        updateStudentAttendanceStats();
    }

    function renderStudentAttendanceSheet() {
        const tbody = document.getElementById('student-attendance-table-body');
        if (!tbody) return;

        if (currentStudentAttendanceData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        No students enrolled in the selected class and section.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = currentStudentAttendanceData.map((row, idx) => `
            <tr>
                <td><span class="fw-bold">${row.rollNumber || '-'}</span></td>
                <td><span class="badge bg-light text-dark border">${row.studentId}</span></td>
                <td><span class="fw-bold">${row.studentName}</span></td>
                <td>
                    <div class="attendance-toggle-group">
                        <button type="button" class="attendance-toggle-btn btn-p ${row.status === 'Present' ? 'active' : ''}" onclick="AttendanceModule.setStudentStatus(${idx}, 'Present')">
                            <i class="fas fa-check me-1"></i> P
                        </button>
                        <button type="button" class="attendance-toggle-btn btn-a ${row.status === 'Absent' ? 'active' : ''}" onclick="AttendanceModule.setStudentStatus(${idx}, 'Absent')">
                            <i class="fas fa-times me-1"></i> A
                        </button>
                        <button type="button" class="attendance-toggle-btn btn-l ${row.status === 'Leave' ? 'active' : ''}" onclick="AttendanceModule.setStudentStatus(${idx}, 'Leave')">
                            <i class="fas fa-bed me-1"></i> L
                        </button>
                    </div>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" placeholder="Optional remark" value="${row.remarks || ''}" onchange="AttendanceModule.setStudentRemark(${idx}, this.value)">
                </td>
            </tr>
        `).join('');
    }

    function setStudentStatus(index, status) {
        if (currentStudentAttendanceData[index]) {
            currentStudentAttendanceData[index].status = status;
            renderStudentAttendanceSheet();
            updateStudentAttendanceStats();
        }
    }

    function setStudentRemark(index, text) {
        if (currentStudentAttendanceData[index]) {
            currentStudentAttendanceData[index].remarks = text;
        }
    }

    function markAllStudents(status) {
        currentStudentAttendanceData.forEach(row => {
            row.status = status;
        });
        renderStudentAttendanceSheet();
        updateStudentAttendanceStats();
        App.showToast(`All students marked as ${status}.`, 'info');
    }

    function updateStudentAttendanceStats() {
        const total = currentStudentAttendanceData.length;
        const present = currentStudentAttendanceData.filter(r => r.status === 'Present').length;
        const absent = currentStudentAttendanceData.filter(r => r.status === 'Absent').length;
        const leave = currentStudentAttendanceData.filter(r => r.status === 'Leave').length;
        const pct = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        document.getElementById('att-std-stat-total').textContent = total;
        document.getElementById('att-std-stat-present').textContent = present;
        document.getElementById('att-std-stat-absent').textContent = absent;
        document.getElementById('att-std-stat-leave').textContent = leave;
        document.getElementById('att-std-stat-pct').textContent = `${pct}%`;
    }

    function saveStudentAttendance() {
        if (currentStudentAttendanceData.length === 0) {
            App.showToast('No student records to save.', 'warning');
            return;
        }

        SchoolDB.saveStudentAttendanceBatch(currentStudentAttendanceData);
        App.showToast('Student attendance sheet saved successfully.', 'success', 'fa-calendar-check');
    }

    // =========================================================================
    // TEACHER ATTENDANCE
    // =========================================================================
    let currentTeacherAttendanceData = [];

    function initTeacherAttendanceView() {
        const dateInput = document.getElementById('att-teacher-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = "2026-10-16";
        }
        loadTeacherAttendanceSheet();
    }

    function loadTeacherAttendanceSheet() {
        const date = document.getElementById('att-teacher-date')?.value || "2026-10-16";
        const teachers = SchoolDB.getTeachers();
        const existingAttendance = SchoolDB.getTeacherAttendance(date);

        currentTeacherAttendanceData = teachers.map(tch => {
            const recorded = existingAttendance.find(a => a.teacherId === tch.id);
            return {
                teacherId: tch.id,
                teacherName: tch.fullName,
                subject: tch.subject,
                date: date,
                checkIn: recorded ? recorded.checkIn : '07:45 AM',
                checkOut: recorded ? recorded.checkOut : '02:15 PM',
                status: recorded ? recorded.status : 'Present',
                lateArrival: recorded ? recorded.lateArrival : false
            };
        });

        renderTeacherAttendanceSheet();
        updateTeacherAttendanceStats();
    }

    function renderTeacherAttendanceSheet() {
        const tbody = document.getElementById('teacher-attendance-table-body');
        if (!tbody) return;

        tbody.innerHTML = currentTeacherAttendanceData.map((row, idx) => `
            <tr>
                <td><span class="badge bg-light text-dark border">${row.teacherId}</span></td>
                <td>
                    <div class="fw-bold">${row.teacherName}</div>
                    <div class="text-muted" style="font-size: 11px;">${row.subject}</div>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" style="width: 100px;" value="${row.checkIn}" onchange="AttendanceModule.setTeacherTime(${idx}, 'checkIn', this.value)">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" style="width: 100px;" value="${row.checkOut}" onchange="AttendanceModule.setTeacherTime(${idx}, 'checkOut', this.value)">
                </td>
                <td>
                    <div class="attendance-toggle-group">
                        <button type="button" class="attendance-toggle-btn btn-p ${row.status === 'Present' ? 'active' : ''}" onclick="AttendanceModule.setTeacherStatus(${idx}, 'Present')">
                            Present
                        </button>
                        <button type="button" class="attendance-toggle-btn btn-a ${row.status === 'Absent' ? 'active' : ''}" onclick="AttendanceModule.setTeacherStatus(${idx}, 'Absent')">
                            Absent
                        </button>
                        <button type="button" class="attendance-toggle-btn btn-l ${row.status === 'Leave' ? 'active' : ''}" onclick="AttendanceModule.setTeacherStatus(${idx}, 'Leave')">
                            Leave
                        </button>
                        <button type="button" class="attendance-toggle-btn btn-h ${row.status === 'Half Day' ? 'active' : ''}" onclick="AttendanceModule.setTeacherStatus(${idx}, 'Half Day')">
                            Half Day
                        </button>
                    </div>
                </td>
                <td>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" ${row.lateArrival ? 'checked' : ''} onchange="AttendanceModule.setTeacherLate(${idx}, this.checked)">
                        <label class="form-check-label" style="font-size: 12px;">${row.lateArrival ? '<span class="text-danger fw-bold">Late</span>' : 'On Time'}</label>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function setTeacherStatus(index, status) {
        if (currentTeacherAttendanceData[index]) {
            currentTeacherAttendanceData[index].status = status;
            if (status === 'Absent' || status === 'Leave') {
                currentTeacherAttendanceData[index].checkIn = '-';
                currentTeacherAttendanceData[index].checkOut = '-';
            } else if (currentTeacherAttendanceData[index].checkIn === '-') {
                currentTeacherAttendanceData[index].checkIn = '07:45 AM';
                currentTeacherAttendanceData[index].checkOut = '02:15 PM';
            }
            renderTeacherAttendanceSheet();
            updateTeacherAttendanceStats();
        }
    }

    function setTeacherTime(index, field, value) {
        if (currentTeacherAttendanceData[index]) {
            currentTeacherAttendanceData[index][field] = value;
        }
    }

    function setTeacherLate(index, isLate) {
        if (currentTeacherAttendanceData[index]) {
            currentTeacherAttendanceData[index].lateArrival = isLate;
            renderTeacherAttendanceSheet();
            updateTeacherAttendanceStats();
        }
    }

    function markAllTeachersPresent() {
        currentTeacherAttendanceData.forEach(row => {
            row.status = 'Present';
            row.checkIn = '07:45 AM';
            row.checkOut = '02:15 PM';
        });
        renderTeacherAttendanceSheet();
        updateTeacherAttendanceStats();
        App.showToast('All teachers marked as Present.', 'info');
    }

    function updateTeacherAttendanceStats() {
        const total = currentTeacherAttendanceData.length;
        const present = currentTeacherAttendanceData.filter(r => r.status === 'Present').length;
        const absent = currentTeacherAttendanceData.filter(r => r.status === 'Absent').length;
        const leave = currentTeacherAttendanceData.filter(r => r.status === 'Leave').length;
        const late = currentTeacherAttendanceData.filter(r => r.lateArrival).length;
        const pct = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        document.getElementById('att-tch-stat-total').textContent = total;
        document.getElementById('att-tch-stat-present').textContent = present;
        document.getElementById('att-tch-stat-absent').textContent = absent;
        document.getElementById('att-tch-stat-leave').textContent = leave;
        document.getElementById('att-tch-stat-late').textContent = late;
        document.getElementById('att-tch-stat-pct').textContent = `${pct}%`;
    }

    function saveTeacherAttendance() {
        if (currentTeacherAttendanceData.length === 0) {
            App.showToast('No teacher attendance to save.', 'warning');
            return;
        }

        SchoolDB.saveTeacherAttendanceBatch(currentTeacherAttendanceData);
        App.showToast('Teacher attendance register saved successfully.', 'success', 'fa-user-clock');
    }

    // Attach listeners
    function init() {
        document.getElementById('att-student-load-btn')?.addEventListener('click', loadStudentAttendanceSheet);
        document.getElementById('att-student-mark-present-all')?.addEventListener('click', () => markAllStudents('Present'));
        document.getElementById('att-student-mark-absent-all')?.addEventListener('click', () => markAllStudents('Absent'));
        document.getElementById('att-student-save-btn')?.addEventListener('click', saveStudentAttendance);

        document.getElementById('att-teacher-load-btn')?.addEventListener('click', loadTeacherAttendanceSheet);
        document.getElementById('att-teacher-mark-present-all')?.addEventListener('click', markAllTeachersPresent);
        document.getElementById('att-teacher-save-btn')?.addEventListener('click', saveTeacherAttendance);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'student-attendance') {
                initStudentAttendanceView();
            } else if (e.detail.page === 'teacher-attendance') {
                initTeacherAttendanceView();
            }
        });

        // Initial setup
        initStudentAttendanceView();
        initTeacherAttendanceView();
    }

    return {
        init: init,
        setStudentStatus: setStudentStatus,
        setStudentRemark: setStudentRemark,
        setTeacherStatus: setTeacherStatus,
        setTeacherTime: setTeacherTime,
        setTeacherLate: setTeacherLate,
        loadStudentAttendanceSheet: loadStudentAttendanceSheet,
        loadTeacherAttendanceSheet: loadTeacherAttendanceSheet
    };
})();

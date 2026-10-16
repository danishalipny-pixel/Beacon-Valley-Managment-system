/**
 * School Management System - Teachers Controller
 * Handles Faculty Listing, Filtering, Add/Edit Modals, CRUD operations,
 * Faculty Profile Viewer (strictly NO photos as instructed),
 * and Official Printable Faculty Dossier generator.
 */

const TeachersModule = (function () {
    let currentTeacherId = null;

    // Render Teachers Table
    function renderTeachers() {
        const teachers = SchoolDB.getTeachers();
        const settings = SchoolDB.getSettings();

        // Populate filters
        populateFilterDropdowns();

        const searchVal = document.getElementById('filter-teacher-search')?.value.trim().toLowerCase() || '';
        const subjectVal = document.getElementById('filter-teacher-subject')?.value || '';
        const statusVal = document.getElementById('filter-teacher-status')?.value || '';
        const genderVal = document.getElementById('filter-teacher-gender')?.value || '';

        const filtered = teachers.filter(t => {
            if (searchVal) {
                const matchName = t.fullName.toLowerCase().includes(searchVal);
                const matchId = t.id.toLowerCase().includes(searchVal);
                const matchSub = t.subject && t.subject.toLowerCase().includes(searchVal);
                const matchPhone = t.phone && t.phone.includes(searchVal);
                if (!matchName && !matchId && !matchSub && !matchPhone) return false;
            }
            if (subjectVal && t.subject !== subjectVal) return false;
            if (statusVal && t.employmentStatus !== statusVal) return false;
            if (genderVal && t.gender !== genderVal) return false;
            return true;
        });

        const countBadge = document.getElementById('teacher-count-badge');
        if (countBadge) countBadge.textContent = `${filtered.length} Teachers`;

        const tbody = document.getElementById('teachers-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5 text-muted">
                        <i class="fas fa-chalkboard-teacher fa-3x mb-3 text-secondary opacity-50"></i>
                        <p class="mb-1 fw-semibold">No teachers found matching current filters.</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="TeachersModule.resetFilters()">Reset Filters</button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(t => {
            const initials = t.fullName.split(' ').map(n => n[0]).slice(0, 2).join('');
            return `
                <tr>
                    <td><span class="badge bg-light text-dark fw-bold border">${t.id}</span></td>
                    <td>
                        <div class="table-student-cell">
                            <!-- Teacher initials avatar ONLY (strictly NO photos) -->
                            <div class="table-teacher-avatar">${initials}</div>
                            <div class="table-person-info">
                                <span class="person-name">${t.fullName}</span>
                                <span class="person-sub"><i class="fas fa-user me-1"></i>S/D/W of: ${t.fatherOrHusbandName || '-'}</span>
                            </div>
                        </div>
                    </td>
                    <td>${t.gender}</td>
                    <td><span class="fw-semibold text-primary">${t.qualification || '-'}</span></td>
                    <td><span class="fw-bold">${t.subject || '-'}</span></td>
                    <td>${t.classAssigned || '-'}</td>
                    <td><span class="text-muted" style="font-size: 12px;">${t.phone || '-'}</span></td>
                    <td><span class="fw-bold text-success">${settings.currency} ${(t.basicSalary || 0).toLocaleString()}</span></td>
                    <td>
                        <span class="badge-status ${t.employmentStatus === 'Active' ? 'badge-status-active' : 'badge-status-inactive'}">
                            ${t.employmentStatus}
                        </span>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="table-action-btn view-btn" title="View Full Profile" onclick="TeachersModule.viewProfile('${t.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn edit-btn" title="Edit Teacher" onclick="TeachersModule.openEditModal('${t.id}')">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="table-action-btn print-btn" title="Print Official Profile" onclick="TeachersModule.printProfile('${t.id}')">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="table-action-btn delete-btn" title="Delete Teacher" onclick="TeachersModule.deleteTeacher('${t.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function populateFilterDropdowns() {
        const subFilter = document.getElementById('filter-teacher-subject');
        if (subFilter && subFilter.children.length <= 1) {
            const teachers = SchoolDB.getTeachers();
            const subjects = [...new Set(teachers.map(t => t.subject).filter(Boolean))];
            subjects.forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subFilter.appendChild(opt);
            });
        }
    }

    function resetFilters() {
        const searchInput = document.getElementById('filter-teacher-search');
        if (searchInput) searchInput.value = '';
        const subFilter = document.getElementById('filter-teacher-subject');
        if (subFilter) subFilter.value = '';
        const statusFilter = document.getElementById('filter-teacher-status');
        if (statusFilter) statusFilter.value = '';
        const genderFilter = document.getElementById('filter-teacher-gender');
        if (genderFilter) genderFilter.value = '';

        renderTeachers();
    }

    // Open Add Teacher Modal (Strictly without photo field)
    function openAddModal() {
        const form = document.getElementById('teacher-form');
        if (form) form.reset();

        document.getElementById('teacher-modal-title').textContent = 'Add New Teaching Faculty';
        document.getElementById('teacher-form-id').value = '';

        const teachers = SchoolDB.getTeachers();
        const nextId = "TCH-" + String(teachers.length + 1).padStart(3, '0');
        document.getElementById('tch-input-id').value = nextId;
        document.getElementById('tch-input-joining').value = new Date().toISOString().split('T')[0];

        const modalEl = document.getElementById('teacher-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Open Edit Teacher Modal
    function openEditModal(teacherId) {
        const teacher = SchoolDB.getTeacherById(teacherId);
        if (!teacher) return;

        document.getElementById('teacher-modal-title').textContent = `Edit Faculty: ${teacher.fullName}`;
        document.getElementById('teacher-form-id').value = teacher.id;

        document.getElementById('tch-input-id').value = teacher.id;
        document.getElementById('tch-input-fullname').value = teacher.fullName || '';
        document.getElementById('tch-input-father').value = teacher.fatherOrHusbandName || '';
        document.getElementById('tch-input-gender').value = teacher.gender || 'Male';
        document.getElementById('tch-input-dob').value = teacher.dob || '';
        document.getElementById('tch-input-cnic').value = teacher.cnic || '';
        document.getElementById('tch-input-qualification').value = teacher.qualification || '';
        document.getElementById('tch-input-subject').value = teacher.subject || '';
        document.getElementById('tch-input-class').value = teacher.classAssigned || '';
        document.getElementById('tch-input-joining').value = teacher.joiningDate || '';
        document.getElementById('tch-input-phone').value = teacher.phone || '';
        document.getElementById('tch-input-email').value = teacher.email || '';
        document.getElementById('tch-input-address').value = teacher.address || '';
        document.getElementById('tch-input-salary').value = teacher.basicSalary || '';
        document.getElementById('tch-input-allowances').value = teacher.allowances || '';
        document.getElementById('tch-input-status').value = teacher.employmentStatus || 'Active';

        const modalEl = document.getElementById('teacher-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Save Teacher Form Submit
    function handleTeacherFormSubmit(e) {
        e.preventDefault();

        const formId = document.getElementById('teacher-form-id').value;
        const isEditing = !!formId;

        const teacherData = {
            id: document.getElementById('tch-input-id').value.trim() || undefined,
            fullName: document.getElementById('tch-input-fullname').value.trim(),
            fatherOrHusbandName: document.getElementById('tch-input-father').value.trim(),
            gender: document.getElementById('tch-input-gender').value,
            dob: document.getElementById('tch-input-dob').value,
            cnic: document.getElementById('tch-input-cnic').value.trim(),
            qualification: document.getElementById('tch-input-qualification').value.trim(),
            subject: document.getElementById('tch-input-subject').value.trim(),
            classAssigned: document.getElementById('tch-input-class').value.trim(),
            joiningDate: document.getElementById('tch-input-joining').value,
            phone: document.getElementById('tch-input-phone').value.trim(),
            email: document.getElementById('tch-input-email').value.trim(),
            address: document.getElementById('tch-input-address').value.trim(),
            basicSalary: parseFloat(document.getElementById('tch-input-salary').value) || 0,
            allowances: parseFloat(document.getElementById('tch-input-allowances').value) || 0,
            employmentStatus: document.getElementById('tch-input-status').value
        };

        if (!teacherData.fullName || !teacherData.subject) {
            App.showToast('Please provide Teacher Name and Subject.', 'warning');
            return;
        }

        if (isEditing) teacherData.id = formId;

        SchoolDB.saveTeacher(teacherData);
        App.showToast(isEditing ? 'Teacher profile updated successfully.' : 'New faculty member added successfully.', 'success', 'fa-check');

        const modalEl = document.getElementById('teacher-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderTeachers();
        if (App.getCurrentPage() === 'teacher-profile' && currentTeacherId === teacherData.id) {
            viewProfile(teacherData.id);
        }
    }

    // Delete Teacher
    function deleteTeacher(teacherId) {
        const teacher = SchoolDB.getTeacherById(teacherId);
        if (!teacher) return;

        App.confirmAction(
            'Delete Faculty Member',
            `Are you sure you want to permanently remove ${teacher.fullName} (${teacher.id}) from the faculty directory?`,
            'Yes, Remove',
            function () {
                SchoolDB.deleteTeacher(teacherId);
                App.showToast(`Faculty member ${teacher.fullName} removed.`, 'success', 'fa-trash');
                renderTeachers();
                if (App.getCurrentPage() === 'teacher-profile') {
                    App.navigateTo('teachers');
                }
            }
        );
    }

    // =========================================================================
    // TEACHER PROFILE VIEW (STRICTLY NO PHOTO)
    // =========================================================================
    function viewProfile(teacherId) {
        const teacher = SchoolDB.getTeacherById(teacherId);
        if (!teacher) return;

        currentTeacherId = teacherId;
        const settings = SchoolDB.getSettings();

        App.navigateTo('teacher-profile', { teacherId: teacherId });

        // Hero Initials & Data (No photo)
        const initials = teacher.fullName.split(' ').map(n => n[0]).slice(0, 2).join('');
        document.getElementById('prof-tch-initials').textContent = initials;
        document.getElementById('prof-tch-name').textContent = teacher.fullName;
        document.getElementById('prof-tch-id').textContent = teacher.id;
        document.getElementById('prof-tch-subject').textContent = teacher.subject;
        document.getElementById('prof-tch-class').textContent = teacher.classAssigned || 'General Faculty';
        document.getElementById('prof-tch-joining').textContent = teacher.joiningDate || '-';

        const statusBadge = document.getElementById('prof-tch-status');
        if (statusBadge) {
            statusBadge.className = `badge-status ${teacher.employmentStatus === 'Active' ? 'badge-status-active' : 'badge-status-inactive'}`;
            statusBadge.textContent = teacher.employmentStatus;
        }

        // Action buttons
        document.getElementById('prof-tch-edit-btn').onclick = () => openEditModal(teacher.id);
        document.getElementById('prof-tch-print-btn').onclick = () => printProfile(teacher.id);

        // Personal Information Section
        document.getElementById('prof-tch-info-fullname').textContent = teacher.fullName;
        document.getElementById('prof-tch-info-father').textContent = teacher.fatherOrHusbandName || '-';
        document.getElementById('prof-tch-info-dob').textContent = teacher.dob || '-';
        document.getElementById('prof-tch-info-gender').textContent = teacher.gender || '-';
        document.getElementById('prof-tch-info-cnic').textContent = teacher.cnic || '-';
        document.getElementById('prof-tch-info-exp').textContent = `${teacher.experienceYears || 5} Years`;

        // Academic & Employment Section
        document.getElementById('prof-tch-info-qual').textContent = teacher.qualification || '-';
        document.getElementById('prof-tch-info-sub').textContent = teacher.subject || '-';
        document.getElementById('prof-tch-info-assigned-class').textContent = teacher.classAssigned || '-';
        document.getElementById('prof-tch-info-joining-date').textContent = teacher.joiningDate || '-';
        document.getElementById('prof-tch-info-emp-status').textContent = teacher.employmentStatus || 'Active';

        // Contact Information Section
        document.getElementById('prof-tch-info-phone').textContent = teacher.phone || '-';
        document.getElementById('prof-tch-info-email').textContent = teacher.email || '-';
        document.getElementById('prof-tch-info-address').textContent = teacher.address || '-';

        // Salary Information Section
        document.getElementById('prof-tch-info-salary').textContent = `${settings.currency} ${(teacher.basicSalary || 0).toLocaleString()}`;
        document.getElementById('prof-tch-info-allowances').textContent = `${settings.currency} ${(teacher.allowances || 0).toLocaleString()}`;
        const totalGross = (teacher.basicSalary || 0) + (teacher.allowances || 0);
        document.getElementById('prof-tch-info-gross').textContent = `${settings.currency} ${totalGross.toLocaleString()}`;

        // Teacher Leave History
        const leaves = SchoolDB.getTeacherLeaves().filter(l => l.teacherId === teacher.id);
        const leaveTableBody = document.getElementById('prof-tch-leave-table');
        if (leaveTableBody) {
            if (leaves.length === 0) {
                leaveTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">No leave applications recorded for this faculty member.</td></tr>`;
            } else {
                leaveTableBody.innerHTML = leaves.map(lv => `
                    <tr>
                        <td>${lv.appliedDate || '-'}</td>
                        <td>${lv.leaveFrom} to ${lv.leaveTo}</td>
                        <td>${lv.days} Day(s)</td>
                        <td>${lv.reason}</td>
                        <td><span class="badge-status badge-status-${lv.status.toLowerCase()}">${lv.status}</span></td>
                    </tr>
                `).join('');
            }
        }

        // Teacher Payroll Records
        const payroll = SchoolDB.getPayroll().filter(p => p.teacherId === teacher.id);
        const payrollTableBody = document.getElementById('prof-tch-payroll-table');
        if (payrollTableBody) {
            if (payroll.length === 0) {
                payrollTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No salary payments processed yet.</td></tr>`;
            } else {
                payrollTableBody.innerHTML = payroll.map(p => `
                    <tr>
                        <td><strong>${p.paymentMonth}</strong></td>
                        <td>${settings.currency} ${(p.basicSalary || 0).toLocaleString()}</td>
                        <td>${settings.currency} ${(p.allowances || 0).toLocaleString()}</td>
                        <td><span class="text-danger">-${settings.currency} ${(p.deductions || 0).toLocaleString()}</span></td>
                        <td><strong class="text-success">${settings.currency} ${(p.netSalary || 0).toLocaleString()}</strong></td>
                        <td><span class="badge-status badge-status-${p.paymentStatus.toLowerCase()}">${p.paymentStatus}</span></td>
                    </tr>
                `).join('');
            }
        }
    }

    // =========================================================================
    // PRINTABLE TEACHER PROFILE (SECTION 23 - NO PHOTO)
    // =========================================================================
    function printProfile(teacherId) {
        const teacher = SchoolDB.getTeacherById(teacherId);
        if (!teacher) return;

        const settings = SchoolDB.getSettings();
        const leaves = SchoolDB.getTeacherLeaves().filter(l => l.teacherId === teacher.id);
        const payroll = SchoolDB.getPayroll().filter(p => p.teacherId === teacher.id);

        const printContainer = document.getElementById('print-document-content');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="printable-document">
                <!-- School Header -->
                <div class="official-doc-header">
                    <div class="school-print-brand">
                        <div class="school-print-logo-box"><i class="fas fa-school"></i></div>
                        <div class="school-print-details">
                            <h2>${settings.schoolName}</h2>
                            <p>${settings.campus}</p>
                            <p>Phone: ${settings.phone} • Email: ${settings.email}</p>
                            <p>Affiliation: ${settings.affiliation}</p>
                        </div>
                    </div>
                    <div class="doc-type-badge">
                        <div class="doc-type-title">FACULTY DOSSIER</div>
                        <div class="doc-date-meta">Printed: ${new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                <!-- Teacher Title (No Photo) -->
                <div style="border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin-bottom: 20px; background-color: #f8fafc;">
                    <h3 style="margin: 0 0 6px 0; font-size: 16pt; font-weight: 800; color: #0f172a;">${teacher.fullName}</h3>
                    <div style="font-size: 10pt; line-height: 1.4; color: #334155;">
                        <strong>Employee ID:</strong> ${teacher.id} &nbsp;|&nbsp;
                        <strong>Department / Subject:</strong> ${teacher.subject} &nbsp;|&nbsp;
                        <strong>Assigned Class:</strong> ${teacher.classAssigned || 'General'}<br>
                        <strong>Joining Date:</strong> ${teacher.joiningDate} &nbsp;|&nbsp;
                        <strong>Qualification:</strong> ${teacher.qualification} &nbsp;|&nbsp;
                        <strong>Status:</strong> ${teacher.employmentStatus}
                    </div>
                </div>

                <!-- Personal Information -->
                <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                    1. Faculty Personal & Academic Information
                </h4>
                <table class="print-table">
                    <tr>
                        <th style="width: 20%;">Full Name</th>
                        <td style="width: 30%;">${teacher.fullName}</td>
                        <th style="width: 20%;">Father / Spouse</th>
                        <td style="width: 30%;">${teacher.fatherOrHusbandName || '-'}</td>
                    </tr>
                    <tr>
                        <th>CNIC / National ID</th>
                        <td>${teacher.cnic || '-'}</td>
                        <th>Date of Birth</th>
                        <td>${teacher.dob || '-'}</td>
                    </tr>
                    <tr>
                        <th>Highest Qualification</th>
                        <td>${teacher.qualification || '-'}</td>
                        <th>Teaching Experience</th>
                        <td>${teacher.experienceYears || 5} Years</td>
                    </tr>
                    <tr>
                        <th>Contact Number</th>
                        <td>${teacher.phone || '-'}</td>
                        <th>Official Email</th>
                        <td>${teacher.email || '-'}</td>
                    </tr>
                    <tr>
                        <th>Residential Address</th>
                        <td colspan="3">${teacher.address}</td>
                    </tr>
                </table>

                <!-- Salary & Compensation Structure -->
                <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px; margin-top: 20px;">
                    2. Salary & Compensation Structure
                </h4>
                <table class="print-table">
                    <tr>
                        <th style="width: 25%;">Basic Salary</th>
                        <td style="width: 25%;">${settings.currency} ${(teacher.basicSalary || 0).toLocaleString()}</td>
                        <th style="width: 25%;">Fixed Allowances</th>
                        <td style="width: 25%;">${settings.currency} ${(teacher.allowances || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>Total Monthly Package</th>
                        <td><strong>${settings.currency} ${((teacher.basicSalary || 0) + (teacher.allowances || 0)).toLocaleString()}</strong></td>
                        <th>Payroll Status</th>
                        <td><strong>Active on Official Payroll</strong></td>
                    </tr>
                </table>

                <!-- Leave Record -->
                <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px; margin-top: 20px;">
                    3. Faculty Leave History
                </h4>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>Leave Period</th>
                            <th>Days</th>
                            <th>Reason / Event</th>
                            <th>Status</th>
                            <th>Sanctioned By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaves.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No leave applications recorded.</td></tr>' : leaves.map(l => `
                            <tr>
                                <td>${l.leaveFrom} to ${l.leaveTo}</td>
                                <td>${l.days}</td>
                                <td>${l.reason}</td>
                                <td>${l.status}</td>
                                <td>${l.approvedBy || 'Principal Office'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Signatures & Official Stamp -->
                <div class="print-signature-section">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Faculty Member Signature</div>
                        <div class="signature-sub">${teacher.fullName}</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Registrar / HR Office</div>
                        <div class="signature-sub">Verified & Documented</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">${settings.principalName}</div>
                        <div class="signature-sub">Principal / Executive Director (Seal & Sign)</div>
                    </div>
                </div>
            </div>
        `;

        window.print();
    }

    // Attach listeners
    function init() {
        document.getElementById('filter-teacher-search')?.addEventListener('input', renderTeachers);
        document.getElementById('filter-teacher-subject')?.addEventListener('change', renderTeachers);
        document.getElementById('filter-teacher-status')?.addEventListener('change', renderTeachers);
        document.getElementById('filter-teacher-gender')?.addEventListener('change', renderTeachers);
        document.getElementById('filter-teacher-reset-btn')?.addEventListener('click', resetFilters);

        document.getElementById('btn-add-teacher')?.addEventListener('click', openAddModal);
        document.getElementById('teacher-form')?.addEventListener('submit', handleTeacherFormSubmit);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'teachers') {
                renderTeachers();
            }
        });

        // Initial render
        renderTeachers();
    }

    return {
        init: init,
        render: renderTeachers,
        openAddModal: openAddModal,
        openEditModal: openEditModal,
        deleteTeacher: deleteTeacher,
        viewProfile: viewProfile,
        printProfile: printProfile,
        resetFilters: resetFilters
    };
})();

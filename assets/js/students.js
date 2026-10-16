/**
 * School Management System - Students Controller
 * Handles Student Listing, Filtering, Add/Edit Modals, CRUD operations,
 * Comprehensive Student Profile Viewer, Complete Academic History manager,
 * and Official Printable Profile generator.
 */

const StudentsModule = (function () {
    let currentStudentId = null;

    // Render Student Table with Filters
    function renderStudents() {
        const students = SchoolDB.getStudents();
        const classes = SchoolDB.getClasses();
        const academicYears = SchoolDB.getAcademicYears();

        // Populate filters dropdowns if empty
        populateFilterDropdowns(classes, academicYears);

        // Get filter values
        const searchVal = document.getElementById('filter-student-search')?.value.trim().toLowerCase() || '';
        const classVal = document.getElementById('filter-student-class')?.value || '';
        const sectionVal = document.getElementById('filter-student-section')?.value || '';
        const yearVal = document.getElementById('filter-student-year')?.value || '';
        const genderVal = document.getElementById('filter-student-gender')?.value || '';
        const statusVal = document.getElementById('filter-student-status')?.value || '';

        // Apply filters
        const filtered = students.filter(s => {
            if (searchVal) {
                const matchName = s.fullName.toLowerCase().includes(searchVal);
                const matchId = s.id.toLowerCase().includes(searchVal);
                const matchFather = s.fatherName && s.fatherName.toLowerCase().includes(searchVal);
                const matchRoll = s.rollNumber && s.rollNumber.toLowerCase().includes(searchVal);
                const matchPhone = s.studentPhone && s.studentPhone.includes(searchVal);
                if (!matchName && !matchId && !matchFather && !matchRoll && !matchPhone) return false;
            }
            if (classVal && s.classId !== classVal && s.className !== classVal) return false;
            if (sectionVal && s.section !== sectionVal) return false;
            if (yearVal && s.academicYear !== yearVal) return false;
            if (genderVal && s.gender !== genderVal) return false;
            if (statusVal && s.status !== statusVal) return false;
            return true;
        });

        // Update count badges
        const countBadge = document.getElementById('student-count-badge');
        if (countBadge) countBadge.textContent = `${filtered.length} Students`;

        // Render Table Body
        const tbody = document.getElementById('students-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5 text-muted">
                        <i class="fas fa-user-graduate fa-3x mb-3 text-secondary opacity-50"></i>
                        <p class="mb-1 fw-semibold">No students found matching current filters.</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="StudentsModule.resetFilters()">Reset Filters</button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(s => `
            <tr>
                <td><span class="badge bg-light text-dark fw-bold border">${s.id}</span></td>
                <td>
                    <div class="table-student-cell">
                        <img src="${s.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}" class="table-student-avatar" alt="${s.fullName}">
                        <div class="table-person-info">
                            <span class="person-name">${s.fullName}</span>
                            <span class="person-sub"><i class="fas fa-user-friends me-1"></i>Father: ${s.fatherName}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="fw-semibold">${s.className}</span>
                    <span class="badge bg-primary-subtle text-primary ms-1">${s.section}</span>
                </td>
                <td><span class="fw-bold">${s.rollNumber || '-'}</span></td>
                <td>${s.gender}</td>
                <td>${s.dob || '-'}</td>
                <td><span class="text-muted" style="font-size: 12px;">${s.studentPhone || s.fatherPhone || '-'}</span></td>
                <td><span class="badge bg-secondary-subtle text-secondary">${s.academicYear || '2025-26'}</span></td>
                <td>
                    <span class="badge-status ${s.status === 'Active' ? 'badge-status-active' : 'badge-status-inactive'}">
                        ${s.status}
                    </span>
                </td>
                <td>
                    <div class="action-btn-group">
                        <button class="table-action-btn view-btn" title="View Full Profile" onclick="StudentsModule.viewProfile('${s.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="table-action-btn edit-btn" title="Edit Student" onclick="StudentsModule.openEditModal('${s.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="table-action-btn print-btn" title="Print Official Profile" onclick="StudentsModule.printProfile('${s.id}')">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="table-action-btn delete-btn" title="Delete Student" onclick="StudentsModule.deleteStudent('${s.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function populateFilterDropdowns(classes, academicYears) {
        const classFilter = document.getElementById('filter-student-class');
        if (classFilter && classFilter.children.length <= 1) {
            classes.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                classFilter.appendChild(opt);
            });
        }

        const yearFilter = document.getElementById('filter-student-year');
        if (yearFilter && yearFilter.children.length <= 1) {
            academicYears.forEach(y => {
                const opt = document.createElement('option');
                opt.value = y.year;
                opt.textContent = y.year;
                yearFilter.appendChild(opt);
            });
        }
    }

    function resetFilters() {
        const searchInput = document.getElementById('filter-student-search');
        if (searchInput) searchInput.value = '';
        const classFilter = document.getElementById('filter-student-class');
        if (classFilter) classFilter.value = '';
        const sectionFilter = document.getElementById('filter-student-section');
        if (sectionFilter) sectionFilter.value = '';
        const yearFilter = document.getElementById('filter-student-year');
        if (yearFilter) yearFilter.value = '';
        const genderFilter = document.getElementById('filter-student-gender');
        if (genderFilter) genderFilter.value = '';
        const statusFilter = document.getElementById('filter-student-status');
        if (statusFilter) statusFilter.value = '';

        renderStudents();
    }

    // Open Add Student Modal
    function openAddModal() {
        const form = document.getElementById('student-form');
        if (form) form.reset();

        document.getElementById('student-modal-title').textContent = 'Add New Student';
        document.getElementById('student-form-id').value = '';

        // Auto-generate next Student ID & Admission No
        const students = SchoolDB.getStudents();
        const nextId = "STD-2025-" + String(students.length + 1).padStart(3, '0');
        document.getElementById('std-input-id').value = nextId;
        document.getElementById('std-input-admission-no').value = "ADM-2025-" + String(students.length + 1).padStart(3, '0');
        document.getElementById('std-input-admission-date').value = new Date().toISOString().split('T')[0];

        // Populate class dropdown
        populateClassDropdown('std-input-class');

        const modalEl = document.getElementById('student-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Open Edit Student Modal
    function openEditModal(studentId) {
        const student = SchoolDB.getStudentById(studentId);
        if (!student) {
            App.showToast('Student record not found.', 'danger');
            return;
        }

        document.getElementById('student-modal-title').textContent = `Edit Student: ${student.fullName}`;
        document.getElementById('student-form-id').value = student.id;

        // Populate fields
        document.getElementById('std-input-id').value = student.id;
        document.getElementById('std-input-fullname').value = student.fullName || '';
        document.getElementById('std-input-father').value = student.fatherName || '';
        document.getElementById('std-input-mother').value = student.motherName || '';
        document.getElementById('std-input-gender').value = student.gender || 'Male';
        document.getElementById('std-input-dob').value = student.dob || '';
        document.getElementById('std-input-bform').value = student.bForm || '';
        document.getElementById('std-input-photo').value = student.photo || '';
        document.getElementById('std-input-blood').value = student.bloodGroup || 'A+';
        document.getElementById('std-input-religion').value = student.religion || 'Islam';
        document.getElementById('std-input-nationality').value = student.nationality || 'Pakistani';

        // Contact
        document.getElementById('std-input-phone').value = student.studentPhone || '';
        document.getElementById('std-input-father-phone').value = student.fatherPhone || '';
        document.getElementById('std-input-mother-phone').value = student.motherPhone || '';
        document.getElementById('std-input-email').value = student.email || '';
        document.getElementById('std-input-address').value = student.address || '';
        document.getElementById('std-input-city').value = student.city || 'Islamabad';

        // Academic
        populateClassDropdown('std-input-class', student.classId || student.className);
        document.getElementById('std-input-section').value = student.section || 'A';
        document.getElementById('std-input-roll').value = student.rollNumber || '';
        document.getElementById('std-input-year').value = student.academicYear || '2025-26';
        document.getElementById('std-input-admission-no').value = student.admissionNumber || '';
        document.getElementById('std-input-admission-date').value = student.admissionDate || '';
        document.getElementById('std-input-prev-school').value = student.previousSchool || '';
        document.getElementById('std-input-prev-class').value = student.previousClass || '';
        document.getElementById('std-input-adm-type').value = student.admissionType || 'Regular';
        document.getElementById('std-input-status').value = student.status || 'Active';

        // Emergency
        document.getElementById('std-input-emg-name').value = student.emergencyContactName || '';
        document.getElementById('std-input-emg-phone').value = student.emergencyContactNumber || '';
        document.getElementById('std-input-emg-rel').value = student.relationship || 'Father';

        const modalEl = document.getElementById('student-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function populateClassDropdown(selectId, selectedVal = '') {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        const classes = SchoolDB.getClasses();
        sel.innerHTML = classes.map(c => `
            <option value="${c.id}" ${selectedVal === c.id || selectedVal === c.name ? 'selected' : ''}>${c.name}</option>
        `).join('');
    }

    // Save Student (Form submission)
    function handleStudentFormSubmit(e) {
        e.preventDefault();

        const formId = document.getElementById('student-form-id').value;
        const isEditing = !!formId;

        const classSelect = document.getElementById('std-input-class');
        const selectedClassId = classSelect.value;
        const selectedClassName = classSelect.options[classSelect.selectedIndex]?.text || '';

        const studentData = {
            id: document.getElementById('std-input-id').value.trim() || undefined,
            fullName: document.getElementById('std-input-fullname').value.trim(),
            fatherName: document.getElementById('std-input-father').value.trim(),
            motherName: document.getElementById('std-input-mother').value.trim(),
            gender: document.getElementById('std-input-gender').value,
            dob: document.getElementById('std-input-dob').value,
            bForm: document.getElementById('std-input-bform').value.trim(),
            photo: document.getElementById('std-input-photo').value.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
            bloodGroup: document.getElementById('std-input-blood').value,
            religion: document.getElementById('std-input-religion').value.trim(),
            nationality: document.getElementById('std-input-nationality').value.trim(),
            studentPhone: document.getElementById('std-input-phone').value.trim(),
            fatherPhone: document.getElementById('std-input-father-phone').value.trim(),
            motherPhone: document.getElementById('std-input-mother-phone').value.trim(),
            email: document.getElementById('std-input-email').value.trim(),
            address: document.getElementById('std-input-address').value.trim(),
            city: document.getElementById('std-input-city').value.trim(),
            classId: selectedClassId,
            className: selectedClassName,
            section: document.getElementById('std-input-section').value,
            rollNumber: document.getElementById('std-input-roll').value.trim(),
            academicYear: document.getElementById('std-input-year').value,
            admissionNumber: document.getElementById('std-input-admission-no').value.trim(),
            admissionDate: document.getElementById('std-input-admission-date').value,
            previousSchool: document.getElementById('std-input-prev-school').value.trim(),
            previousClass: document.getElementById('std-input-prev-class').value.trim(),
            admissionType: document.getElementById('std-input-adm-type').value,
            status: document.getElementById('std-input-status').value,
            emergencyContactName: document.getElementById('std-input-emg-name').value.trim(),
            emergencyContactNumber: document.getElementById('std-input-emg-phone').value.trim(),
            relationship: document.getElementById('std-input-emg-rel').value.trim()
        };

        // Form validation
        if (!studentData.fullName || !studentData.fatherName) {
            App.showToast('Please provide both Student Name and Father Name.', 'warning');
            return;
        }

        // Preserve existing academic history & stats if editing
        if (isEditing) {
            const existing = SchoolDB.getStudentById(formId);
            if (existing) {
                studentData.id = formId;
                studentData.academicHistory = existing.academicHistory || [];
                studentData.attendanceSummary = existing.attendanceSummary || { totalDays: 168, presentDays: 155, absentDays: 8, leaveDays: 5, percentage: 92 };
                studentData.feeSummary = existing.feeSummary || { totalFees: 60000, paid: 60000, pending: 0, lastPayment: "-", dueDate: "-", status: "Paid" };
            }
        } else {
            // New student initial academic year entry
            studentData.academicHistory = [
                {
                    academicYear: studentData.academicYear || "2025-26",
                    className: studentData.className,
                    section: studentData.section,
                    rollNumber: studentData.rollNumber,
                    classTeacher: "Assigned Class Teacher",
                    totalDays: 45,
                    presentDays: 43,
                    absentDays: 1,
                    leaveDays: 1,
                    attendancePercentage: 95.5,
                    marksObtained: 0,
                    totalMarks: 500,
                    percentage: 0,
                    grade: "-",
                    position: "-",
                    result: "In Progress",
                    promotionStatus: "Current Year",
                    remarks: "Newly admitted student."
                }
            ];
            studentData.attendanceSummary = { totalDays: 45, presentDays: 43, absentDays: 1, leaveDays: 1, percentage: 95 };
            studentData.feeSummary = { totalFees: 45000, paid: 45000, pending: 0, lastPayment: new Date().toISOString().split('T')[0], dueDate: "2026-10-15", status: "Paid" };
        }

        SchoolDB.saveStudent(studentData);
        App.showToast(isEditing ? 'Student profile updated successfully.' : 'New student registered successfully.', 'success', 'fa-check');

        // Close modal
        const modalEl = document.getElementById('student-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        // Refresh views
        renderStudents();
        if (App.getCurrentPage() === 'student-profile' && currentStudentId === studentData.id) {
            viewProfile(studentData.id);
        }
    }

    // Delete Student
    function deleteStudent(studentId) {
        const student = SchoolDB.getStudentById(studentId);
        if (!student) return;

        App.confirmAction(
            'Delete Student Record',
            `Are you sure you want to permanently delete student "${student.fullName}" (${student.id})? All academic histories and records will be deleted.`,
            'Yes, Delete',
            function () {
                SchoolDB.deleteStudent(studentId);
                App.showToast(`Student ${student.fullName} deleted successfully.`, 'success', 'fa-trash');
                renderStudents();
                if (App.getCurrentPage() === 'student-profile') {
                    App.navigateTo('students');
                }
            }
        );
    }

    // =========================================================================
    // MOST IMPORTANT — STUDENT PROFILE (SECTION 7 & 8)
    // =========================================================================
    function viewProfile(studentId) {
        const student = SchoolDB.getStudentById(studentId);
        if (!student) {
            App.showToast('Student record not found.', 'danger');
            return;
        }

        currentStudentId = studentId;

        // Switch to student-profile view
        App.navigateTo('student-profile', { studentId: studentId });

        // 1. Top Hero Card
        const photoEl = document.getElementById('prof-student-photo');
        if (photoEl) photoEl.src = student.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';

        document.getElementById('prof-student-name').textContent = student.fullName;
        document.getElementById('prof-student-id').textContent = student.id;
        document.getElementById('prof-student-class').textContent = `${student.className} (${student.section})`;
        document.getElementById('prof-student-roll').textContent = student.rollNumber || '-';
        document.getElementById('prof-student-admission-date').textContent = student.admissionDate || '-';
        document.getElementById('prof-student-year').textContent = student.academicYear || '2025-26';

        const statusBadge = document.getElementById('prof-student-status');
        if (statusBadge) {
            statusBadge.className = `badge-status ${student.status === 'Active' ? 'badge-status-active' : 'badge-status-inactive'}`;
            statusBadge.textContent = student.status;
        }

        // Quick action buttons in hero
        document.getElementById('prof-edit-btn').onclick = () => openEditModal(student.id);
        document.getElementById('prof-print-btn').onclick = () => printProfile(student.id);
        document.getElementById('prof-add-history-btn').onclick = () => openAddAcademicHistoryModal(student.id);

        // 2. Personal Information Section
        document.getElementById('prof-info-fullname').textContent = student.fullName || '-';
        document.getElementById('prof-info-father').textContent = student.fatherName || '-';
        document.getElementById('prof-info-mother').textContent = student.motherName || '-';
        document.getElementById('prof-info-dob').textContent = student.dob || '-';
        document.getElementById('prof-info-gender').textContent = student.gender || '-';
        document.getElementById('prof-info-bform').textContent = student.bForm || '-';
        document.getElementById('prof-info-blood').textContent = student.bloodGroup || '-';
        document.getElementById('prof-info-religion').textContent = student.religion || '-';
        document.getElementById('prof-info-nationality').textContent = student.nationality || 'Pakistani';

        // 3. Contact Information Section
        document.getElementById('prof-contact-std-phone').textContent = student.studentPhone || '-';
        document.getElementById('prof-contact-father-phone').textContent = student.fatherPhone || '-';
        document.getElementById('prof-contact-mother-phone').textContent = student.motherPhone || '-';
        document.getElementById('prof-contact-email').textContent = student.email || '-';
        document.getElementById('prof-contact-address').textContent = student.address || '-';
        document.getElementById('prof-contact-city').textContent = student.city || '-';

        // 4. Academic Information Section
        document.getElementById('prof-acad-class').textContent = student.className || '-';
        document.getElementById('prof-acad-section').textContent = student.section || '-';
        document.getElementById('prof-acad-roll').textContent = student.rollNumber || '-';
        document.getElementById('prof-acad-adm-no').textContent = student.admissionNumber || '-';
        document.getElementById('prof-acad-adm-date').textContent = student.admissionDate || '-';
        document.getElementById('prof-acad-cur-year').textContent = student.academicYear || '-';
        document.getElementById('prof-acad-prev-school').textContent = student.previousSchool || 'N/A';
        document.getElementById('prof-acad-prev-class').textContent = student.previousClass || 'N/A';
        document.getElementById('prof-acad-adm-type').textContent = student.admissionType || 'Regular';

        // 5. Attendance Summary Section
        const att = student.attendanceSummary || { totalDays: 168, presentDays: 155, absentDays: 8, leaveDays: 5, percentage: 92 };
        document.getElementById('prof-att-total').textContent = att.totalDays;
        document.getElementById('prof-att-present').textContent = att.presentDays;
        document.getElementById('prof-att-absent').textContent = att.absentDays;
        document.getElementById('prof-att-leave').textContent = att.leaveDays;
        document.getElementById('prof-att-pct').textContent = `${att.percentage}%`;
        
        const attProgressBar = document.getElementById('prof-att-progress-bar');
        if (attProgressBar) {
            attProgressBar.style.width = `${att.percentage}%`;
            attProgressBar.textContent = `${att.percentage}%`;
            if (att.percentage >= 90) attProgressBar.className = "progress-bar bg-success";
            else if (att.percentage >= 75) attProgressBar.className = "progress-bar bg-primary";
            else attProgressBar.className = "progress-bar bg-warning";
        }

        // 6. Fee Summary Section
        const fees = SchoolDB.getFees().filter(f => f.studentId === student.id);
        const feeSum = student.feeSummary || { totalFees: 90000, paid: 90000, pending: 0, lastPayment: "-", dueDate: "-", status: "Paid" };
        const totalFeeAmount = fees.reduce((sum, f) => sum + (f.totalFee || 0), 0) || feeSum.totalFees;
        const paidFeeAmount = fees.reduce((sum, f) => sum + (f.paid || 0), 0) || feeSum.paid;
        const pendingFeeAmount = Math.max(0, totalFeeAmount - paidFeeAmount);
        const settings = SchoolDB.getSettings();

        document.getElementById('prof-fee-total').textContent = `${settings.currency} ${totalFeeAmount.toLocaleString()}`;
        document.getElementById('prof-fee-paid').textContent = `${settings.currency} ${paidFeeAmount.toLocaleString()}`;
        document.getElementById('prof-fee-pending').textContent = `${settings.currency} ${pendingFeeAmount.toLocaleString()}`;
        document.getElementById('prof-fee-last-date').textContent = feeSum.lastPayment || '-';
        document.getElementById('prof-fee-due-date').textContent = feeSum.dueDate || '-';
        
        const feeStatusBadge = document.getElementById('prof-fee-status-badge');
        if (feeStatusBadge) {
            const st = pendingFeeAmount === 0 ? 'Paid' : (paidFeeAmount > 0 ? 'Partial' : 'Pending');
            feeStatusBadge.className = `badge-status badge-status-${st.toLowerCase()}`;
            feeStatusBadge.textContent = st;
        }

        // 7. Leave History Section
        const leaves = SchoolDB.getStudentLeaves().filter(l => l.studentId === student.id);
        const leaveTableBody = document.getElementById('prof-leave-history-table');
        if (leaveTableBody) {
            if (leaves.length === 0) {
                leaveTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">No leave applications recorded for this student.</td></tr>`;
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

        // 8. COMPLETE SCHOOL HISTORY (SECTION 8 - VERY IMPORTANT)
        renderAcademicHistory(student);
    }

    // Render Academic History (Summary Table + Year Timeline Cards)
    function renderAcademicHistory(student) {
        const historyList = student.academicHistory || [];

        // Summary Table
        const historyTableBody = document.getElementById('prof-academic-history-table');
        if (historyTableBody) {
            if (historyList.length === 0) {
                historyTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-muted">No academic records available. Click "+ Add Academic Record" to add.</td></tr>`;
            } else {
                historyTableBody.innerHTML = historyList.map(h => `
                    <tr>
                        <td><span class="fw-bold">${h.academicYear}</span></td>
                        <td>${h.className}</td>
                        <td><span class="badge bg-light text-dark border">${h.section}</span></td>
                        <td>${h.rollNumber}</td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <span class="fw-semibold">${h.attendancePercentage || 90}%</span>
                                <div class="progress" style="width: 50px; height: 6px;">
                                    <div class="progress-bar bg-info" style="width: ${h.attendancePercentage || 90}%"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="badge bg-${h.result === 'Pass' ? 'success' : 'warning'}-subtle text-${h.result === 'Pass' ? 'success' : 'warning'} fw-bold">
                                ${h.result} (${h.grade || 'A'})
                            </span>
                        </td>
                        <td>
                            <span class="badge bg-primary-subtle text-primary fw-bold">${h.promotionStatus}</span>
                        </td>
                    </tr>
                `).join('');
            }
        }

        // Detailed Year Cards / Timeline
        const cardsContainer = document.getElementById('prof-academic-history-cards');
        if (cardsContainer) {
            if (historyList.length === 0) {
                cardsContainer.innerHTML = `
                    <div class="p-4 text-center border rounded bg-white text-muted">
                        <i class="fas fa-history fa-2x mb-2 text-secondary opacity-50"></i>
                        <p class="mb-0">No detailed yearly history cards recorded yet.</p>
                    </div>
                `;
            } else {
                cardsContainer.innerHTML = historyList.map((h, idx) => `
                    <div class="academic-history-card">
                        <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                            <div>
                                <span class="academic-year-badge me-2">${h.academicYear}</span>
                                <span class="fs-6 fw-bold text-dark">${h.className} (Section ${h.section})</span>
                                <span class="text-muted ms-2" style="font-size: 13px;">• Roll No: <strong>${h.rollNumber}</strong></span>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-2">${h.promotionStatus}</span>
                                <button class="btn btn-sm btn-outline-danger" title="Delete Academic Year Record" onclick="StudentsModule.deleteAcademicHistoryRecord('${student.id}', ${idx})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-3 col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="text-muted" style="font-size: 11px; text-transform: uppercase;">Class Teacher</div>
                                    <div class="fw-bold" style="font-size: 13px;">${h.classTeacher || 'Teacher Assigned'}</div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="text-muted" style="font-size: 11px; text-transform: uppercase;">Attendance</div>
                                    <div class="fw-bold text-success" style="font-size: 13px;">${h.presentDays || 0} / ${h.totalDays || 0} (${h.attendancePercentage || 90}%)</div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="text-muted" style="font-size: 11px; text-transform: uppercase;">Marks / Total</div>
                                    <div class="fw-bold" style="font-size: 13px;">${h.marksObtained || '-'} / ${h.totalMarks || '-'} (${h.percentage || '-'}%)</div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="text-muted" style="font-size: 11px; text-transform: uppercase;">Grade & Position</div>
                                    <div class="fw-bold text-primary" style="font-size: 13px;">Grade ${h.grade || '-'} • Position: ${h.position || '-'}</div>
                                </div>
                            </div>
                        </div>

                        <div class="p-3 bg-light rounded" style="font-size: 13px; color: #334155;">
                            <strong><i class="fas fa-comment-dots text-primary me-2"></i>Teacher Remarks:</strong>
                            ${h.remarks || 'Diligent student with consistent performance across terms.'}
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Open Add Academic History Record Modal
    function openAddAcademicHistoryModal(studentId) {
        const student = SchoolDB.getStudentById(studentId);
        if (!student) return;

        document.getElementById('acad-hist-student-id').value = student.id;
        document.getElementById('acad-hist-student-name').textContent = student.fullName;
        
        // Reset modal form
        document.getElementById('academic-history-form').reset();
        
        // Populate academic years
        const years = SchoolDB.getAcademicYears();
        const yearSel = document.getElementById('hist-input-year');
        yearSel.innerHTML = years.map(y => `<option value="${y.year}">${y.year}</option>`).join('');

        const modalEl = document.getElementById('academic-history-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Save Academic History Record
    function handleAcademicHistorySubmit(e) {
        e.preventDefault();
        const studentId = document.getElementById('acad-hist-student-id').value;
        if (!studentId) return;

        const totalDays = parseInt(document.getElementById('hist-input-total-days').value) || 200;
        const presentDays = parseInt(document.getElementById('hist-input-present-days').value) || 185;
        const absentDays = parseInt(document.getElementById('hist-input-absent-days').value) || 10;
        const leaveDays = parseInt(document.getElementById('hist-input-leave-days').value) || 5;
        const attPct = parseFloat(((presentDays / totalDays) * 100).toFixed(1));

        const marksObtained = parseFloat(document.getElementById('hist-input-marks').value) || 0;
        const totalMarks = parseFloat(document.getElementById('hist-input-total-marks').value) || 1000;
        const pct = totalMarks > 0 ? parseFloat(((marksObtained / totalMarks) * 100).toFixed(1)) : 0;

        const record = {
            academicYear: document.getElementById('hist-input-year').value,
            className: document.getElementById('hist-input-class').value,
            section: document.getElementById('hist-input-section').value,
            rollNumber: document.getElementById('hist-input-roll').value.trim(),
            classTeacher: document.getElementById('hist-input-teacher').value.trim(),
            totalDays: totalDays,
            presentDays: presentDays,
            absentDays: absentDays,
            leaveDays: leaveDays,
            attendancePercentage: attPct,
            marksObtained: marksObtained,
            totalMarks: totalMarks,
            percentage: pct,
            grade: document.getElementById('hist-input-grade').value.trim(),
            position: document.getElementById('hist-input-position').value.trim(),
            result: document.getElementById('hist-input-result').value,
            promotionStatus: document.getElementById('hist-input-promo').value,
            remarks: document.getElementById('hist-input-remarks').value.trim()
        };

        SchoolDB.addAcademicHistory(studentId, record);
        App.showToast('Academic record added successfully.', 'success', 'fa-history');

        // Hide modal
        const modalEl = document.getElementById('academic-history-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        // Refresh profile
        viewProfile(studentId);
    }

    // Delete Academic History Record
    function deleteAcademicHistoryRecord(studentId, index) {
        App.confirmAction(
            'Delete Academic Record',
            'Are you sure you want to remove this academic history entry from the student dossier?',
            'Yes, Remove',
            function () {
                SchoolDB.deleteAcademicHistory(studentId, index);
                App.showToast('Academic record removed.', 'warning', 'fa-trash');
                viewProfile(studentId);
            }
        );
    }

    // =========================================================================
    // PRINTABLE STUDENT PROFILE (SECTION 22)
    // =========================================================================
    function printProfile(studentId) {
        const student = SchoolDB.getStudentById(studentId);
        if (!student) return;

        const settings = SchoolDB.getSettings();
        const historyList = student.academicHistory || [];
        const att = student.attendanceSummary || { totalDays: 168, presentDays: 155, absentDays: 8, leaveDays: 5, percentage: 92 };
        const feeSum = student.feeSummary || { totalFees: 90000, paid: 90000, pending: 0, lastPayment: "-", dueDate: "-", status: "Paid" };
        const leaves = SchoolDB.getStudentLeaves().filter(l => l.studentId === student.id);

        const printContainer = document.getElementById('print-document-content');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="printable-document">
                <!-- School Header -->
                <div class="official-doc-header">
                    <div class="school-print-brand">
                        <div class="school-print-logo-box"><i class="fas fa-graduation-cap"></i></div>
                        <div class="school-print-details">
                            <h2>${settings.schoolName}</h2>
                            <p>${settings.campus}</p>
                            <p>Phone: ${settings.phone} • Email: ${settings.email}</p>
                            <p>Affiliation: ${settings.affiliation}</p>
                        </div>
                    </div>
                    <div class="doc-type-badge">
                        <div class="doc-type-title">OFFICIAL STUDENT DOSSIER</div>
                        <div class="doc-date-meta">Printed: ${new Date().toLocaleDateString()} • Session ${settings.activeAcademicYear}</div>
                    </div>
                </div>

                <!-- Top Student Header with Photo -->
                <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: center; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px;">
                    <img src="${student.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}" style="width: 110px; height: 110px; border-radius: 6px; object-fit: cover; border: 2px solid #0f172a;" alt="${student.fullName}">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 6px 0; font-size: 16pt; font-weight: 800; color: #0f172a;">${student.fullName}</h3>
                        <div style="font-size: 10pt; line-height: 1.4; color: #334155;">
                            <strong>Student ID:</strong> ${student.id} &nbsp;|&nbsp; 
                            <strong>Current Class:</strong> ${student.className} (${student.section}) &nbsp;|&nbsp; 
                            <strong>Roll No:</strong> ${student.rollNumber || '-'}<br>
                            <strong>Admission Date:</strong> ${student.admissionDate} &nbsp;|&nbsp; 
                            <strong>Admission No:</strong> ${student.admissionNumber || '-'} &nbsp;|&nbsp; 
                            <strong>Status:</strong> ${student.status}
                        </div>
                    </div>
                </div>

                <!-- Personal Information -->
                <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                    1. Personal & Guardian Details
                </h4>
                <table class="print-table">
                    <tr>
                        <th style="width: 20%;">Full Name</th>
                        <td style="width: 30%;">${student.fullName}</td>
                        <th style="width: 20%;">Date of Birth</th>
                        <td style="width: 30%;">${student.dob || '-'}</td>
                    </tr>
                    <tr>
                        <th>Father's Name</th>
                        <td>${student.fatherName}</td>
                        <th>Mother's Name</th>
                        <td>${student.motherName || '-'}</td>
                    </tr>
                    <tr>
                        <th>B-Form / CNIC</th>
                        <td>${student.bForm || '-'}</td>
                        <th>Blood Group</th>
                        <td>${student.bloodGroup || '-'}</td>
                    </tr>
                    <tr>
                        <th>Contact Phone</th>
                        <td>${student.studentPhone || student.fatherPhone || '-'}</td>
                        <th>Emergency Contact</th>
                        <td>${student.emergencyContactName} (${student.emergencyContactNumber || '-'})</td>
                    </tr>
                    <tr>
                        <th>Permanent Address</th>
                        <td colspan="3">${student.address}, ${student.city}</td>
                    </tr>
                </table>

                <!-- Complete Academic History Table -->
                <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px; margin-top: 20px;">
                    2. Complete School Academic History
                </h4>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>Academic Year</th>
                            <th>Class & Section</th>
                            <th>Roll No</th>
                            <th>Class Teacher</th>
                            <th>Attendance</th>
                            <th>Marks / Total</th>
                            <th>Grade / Pos</th>
                            <th>Result Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${historyList.map(h => `
                            <tr>
                                <td><strong>${h.academicYear}</strong></td>
                                <td>${h.className} (${h.section})</td>
                                <td>${h.rollNumber}</td>
                                <td>${h.classTeacher || '-'}</td>
                                <td>${h.presentDays || 0}/${h.totalDays || 0} (${h.attendancePercentage || 90}%)</td>
                                <td>${h.marksObtained || '-'}/${h.totalMarks || '-'} (${h.percentage || '-'}%)</td>
                                <td>Grade ${h.grade || '-'} (${h.position || '-'})</td>
                                <td><strong>${h.promotionStatus}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Attendance & Fee Summary Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                    <div>
                        <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                            3. Current Session Attendance
                        </h4>
                        <table class="print-table">
                            <tr><th>Total Working Days</th><td>${att.totalDays} Days</td></tr>
                            <tr><th>Days Present</th><td>${att.presentDays} Days</td></tr>
                            <tr><th>Days Absent</th><td>${att.absentDays} Days</td></tr>
                            <tr><th>Leaves Approved</th><td>${att.leaveDays} Days</td></tr>
                            <tr><th>Overall Percentage</th><td><strong>${att.percentage}%</strong></td></tr>
                        </table>
                    </div>
                    <div>
                        <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                            4. Financial Account Summary
                        </h4>
                        <table class="print-table">
                            <tr><th>Total Annual Fee</th><td>${settings.currency} ${feeSum.totalFees.toLocaleString()}</td></tr>
                            <tr><th>Total Paid</th><td>${settings.currency} ${feeSum.paid.toLocaleString()}</td></tr>
                            <tr><th>Pending Arrears</th><td><strong>${settings.currency} ${feeSum.pending.toLocaleString()}</strong></td></tr>
                            <tr><th>Last Payment Date</th><td>${feeSum.lastPayment || '-'}</td></tr>
                            <tr><th>Fee Account Status</th><td><strong>${feeSum.status}</strong></td></tr>
                        </table>
                    </div>
                </div>

                <!-- Signatures & Official Stamp -->
                <div class="print-signature-section">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Class Teacher Signature</div>
                        <div class="signature-sub">Verified & Approved</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Examination Incharge</div>
                        <div class="signature-sub">Academic Controller</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">${settings.principalName}</div>
                        <div class="signature-sub">Principal / Head of Institution (Seal & Sign)</div>
                    </div>
                </div>
            </div>
        `;

        window.print();
    }

    // Attach listeners
    function init() {
        document.getElementById('filter-student-search')?.addEventListener('input', renderStudents);
        document.getElementById('filter-student-class')?.addEventListener('change', renderStudents);
        document.getElementById('filter-student-section')?.addEventListener('change', renderStudents);
        document.getElementById('filter-student-year')?.addEventListener('change', renderStudents);
        document.getElementById('filter-student-gender')?.addEventListener('change', renderStudents);
        document.getElementById('filter-student-status')?.addEventListener('change', renderStudents);
        document.getElementById('filter-student-reset-btn')?.addEventListener('click', resetFilters);

        document.getElementById('btn-add-student')?.addEventListener('click', openAddModal);
        document.getElementById('student-form')?.addEventListener('submit', handleStudentFormSubmit);
        document.getElementById('academic-history-form')?.addEventListener('submit', handleAcademicHistorySubmit);

        // Photo URL change live preview in modal
        document.getElementById('std-input-photo')?.addEventListener('input', function (e) {
            const preview = document.getElementById('std-photo-preview');
            if (preview && e.target.value) preview.src = e.target.value;
        });

        // Navigation listener
        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'students') {
                renderStudents();
            }
        });

        // Initial render
        renderStudents();
    }

    return {
        init: init,
        render: renderStudents,
        openAddModal: openAddModal,
        openEditModal: openEditModal,
        deleteStudent: deleteStudent,
        viewProfile: viewProfile,
        printProfile: printProfile,
        openAddAcademicHistoryModal: openAddAcademicHistoryModal,
        deleteAcademicHistoryRecord: deleteAcademicHistoryRecord,
        resetFilters: resetFilters
    };
})();

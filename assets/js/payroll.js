/**
 * School Management System - Teacher Payroll & Compensation Controller
 * Formula: Net Salary = Basic Salary + Allowances + Bonus - Deductions
 * Handles monthly payroll overview, salary slip generation, and official payslip printing.
 */

const PayrollModule = (function () {

    function renderPayroll() {
        const payroll = SchoolDB.getPayroll();
        const settings = SchoolDB.getSettings();

        const monthVal = document.getElementById('filter-payroll-month')?.value || '';
        const statusVal = document.getElementById('filter-payroll-status')?.value || '';
        const searchVal = document.getElementById('filter-payroll-search')?.value.trim().toLowerCase() || '';

        const filtered = payroll.filter(p => {
            if (monthVal && p.paymentMonth !== monthVal) return false;
            if (statusVal && p.paymentStatus !== statusVal) return false;
            if (searchVal) {
                const matchName = p.teacherName.toLowerCase().includes(searchVal);
                const matchId = p.teacherId.toLowerCase().includes(searchVal);
                if (!matchName && !matchId) return false;
            }
            return true;
        });

        // Calculate Monthly Summary Stats
        const totalPayroll = filtered.reduce((sum, p) => sum + (p.netSalary || 0), 0);
        const paidSalaries = filtered.filter(p => p.paymentStatus === 'Paid').reduce((sum, p) => sum + (p.netSalary || 0), 0);
        const pendingSalaries = filtered.filter(p => p.paymentStatus !== 'Paid').reduce((sum, p) => sum + (p.netSalary || 0), 0);
        const totalDeductions = filtered.reduce((sum, p) => sum + (p.deductions || 0), 0);
        const totalBonuses = filtered.reduce((sum, p) => sum + (p.bonus || 0), 0);

        document.getElementById('stat-pay-total').textContent = `${settings.currency} ${totalPayroll.toLocaleString()}`;
        document.getElementById('stat-pay-paid').textContent = `${settings.currency} ${paidSalaries.toLocaleString()}`;
        document.getElementById('stat-pay-pending').textContent = `${settings.currency} ${pendingSalaries.toLocaleString()}`;
        document.getElementById('stat-pay-deductions').textContent = `${settings.currency} ${totalDeductions.toLocaleString()}`;
        document.getElementById('stat-pay-bonuses').textContent = `${settings.currency} ${totalBonuses.toLocaleString()}`;

        const tbody = document.getElementById('payroll-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" class="text-center py-4 text-muted">No salary disbursement records found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td><span class="badge bg-light text-dark border">${p.teacherId}</span></td>
                <td>
                    <div class="fw-bold">${p.teacherName}</div>
                    <div class="text-muted" style="font-size: 11px;">Ref: ${p.id}</div>
                </td>
                <td>${settings.currency} ${(p.basicSalary || 0).toLocaleString()}</td>
                <td><span class="text-info">+${settings.currency} ${(p.allowances || 0).toLocaleString()}</span></td>
                <td><span class="text-success">+${settings.currency} ${(p.bonus || 0).toLocaleString()}</span></td>
                <td><span class="text-danger">-${settings.currency} ${(p.deductions || 0).toLocaleString()}</span></td>
                <td><strong class="text-primary">${settings.currency} ${(p.netSalary || 0).toLocaleString()}</strong></td>
                <td><span class="badge bg-secondary-subtle text-secondary">${p.paymentMonth}</span></td>
                <td>${p.paymentDate || '-'}</td>
                <td><span class="badge-status badge-status-${p.paymentStatus.toLowerCase()}">${p.paymentStatus}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" style="font-size: 11px;" title="Generate & Print Payslip" onclick="PayrollModule.printSalarySlip('${p.id}')">
                            <i class="fas fa-file-invoice me-1"></i> Slip
                        </button>
                        <button class="table-action-btn edit-btn" title="Edit Salary Parameters" onclick="PayrollModule.openEditModal('${p.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="table-action-btn delete-btn" title="Delete Payroll Record" onclick="PayrollModule.deletePayroll('${p.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Open Edit / Record Payment Modal
    function openEditModal(payrollId) {
        const payroll = SchoolDB.getPayroll();
        const record = payroll.find(p => p.id === payrollId);
        if (!record) return;

        document.getElementById('payroll-form-id').value = record.id;
        document.getElementById('pay-teacher-name').textContent = record.teacherName;
        document.getElementById('pay-input-month').value = record.paymentMonth;
        document.getElementById('pay-input-basic').value = record.basicSalary;
        document.getElementById('pay-input-allowances').value = record.allowances;
        document.getElementById('pay-input-bonus').value = record.bonus || 0;
        document.getElementById('pay-input-deductions').value = record.deductions || 0;
        document.getElementById('pay-input-status').value = record.paymentStatus;
        document.getElementById('pay-input-date').value = record.paymentDate === '-' ? new Date().toISOString().split('T')[0] : record.paymentDate;

        calculateModalNetSalary();

        const modalEl = document.getElementById('payroll-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function calculateModalNetSalary() {
        const basic = parseFloat(document.getElementById('pay-input-basic').value) || 0;
        const allow = parseFloat(document.getElementById('pay-input-allowances').value) || 0;
        const bon = parseFloat(document.getElementById('pay-input-bonus').value) || 0;
        const ded = parseFloat(document.getElementById('pay-input-deductions').value) || 0;

        const net = (basic + allow + bon) - ded;
        const settings = SchoolDB.getSettings();
        document.getElementById('pay-modal-net-preview').textContent = `${settings.currency} ${net.toLocaleString()}`;
    }

    function handlePayrollSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('payroll-form-id').value;
        const payroll = SchoolDB.getPayroll();
        const existing = payroll.find(p => p.id === id);
        if (!existing) return;

        existing.paymentMonth = document.getElementById('pay-input-month').value;
        existing.basicSalary = parseFloat(document.getElementById('pay-input-basic').value) || 0;
        existing.allowances = parseFloat(document.getElementById('pay-input-allowances').value) || 0;
        existing.bonus = parseFloat(document.getElementById('pay-input-bonus').value) || 0;
        existing.deductions = parseFloat(document.getElementById('pay-input-deductions').value) || 0;
        existing.paymentStatus = document.getElementById('pay-input-status').value;
        existing.paymentDate = existing.paymentStatus === 'Paid' ? document.getElementById('pay-input-date').value : '-';

        SchoolDB.savePayroll(existing);
        App.showToast(`Salary details updated for ${existing.teacherName}.`, 'success', 'fa-check');

        const modalEl = document.getElementById('payroll-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderPayroll();
    }

    function deletePayroll(id) {
        App.confirmAction(
            'Delete Payroll Record',
            'Are you sure you want to delete this salary record?',
            'Yes, Delete',
            function () {
                SchoolDB.deletePayroll(id);
                App.showToast('Salary record deleted.', 'warning');
                renderPayroll();
            }
        );
    }

    // Print Official Salary Slip
    function printSalarySlip(payrollId) {
        const payroll = SchoolDB.getPayroll();
        const rec = payroll.find(p => p.id === payrollId);
        if (!rec) return;

        const teacher = SchoolDB.getTeacherById(rec.teacherId) || {};
        const settings = SchoolDB.getSettings();

        const printContainer = document.getElementById('print-document-content');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="printable-document">
                <!-- School Header -->
                <div class="official-doc-header">
                    <div class="school-print-brand">
                        <div class="school-print-logo-box"><i class="fas fa-money-check-alt"></i></div>
                        <div class="school-print-details">
                            <h2>${settings.schoolName}</h2>
                            <p>${settings.campus}</p>
                            <p>Phone: ${settings.phone} • Email: ${settings.email}</p>
                        </div>
                    </div>
                    <div class="doc-type-badge">
                        <div class="doc-type-title">SALARY DISBURSEMENT SLIP</div>
                        <div class="doc-date-meta">Pay Period: ${rec.paymentMonth}</div>
                    </div>
                </div>

                <!-- Employee Header (No photo) -->
                <table class="print-table mb-4">
                    <tr>
                        <th style="width: 20%;">Employee Name</th>
                        <td style="width: 30%;"><strong>${rec.teacherName}</strong></td>
                        <th style="width: 20%;">Employee ID</th>
                        <td style="width: 30%;">${rec.teacherId}</td>
                    </tr>
                    <tr>
                        <th>Designation / Subject</th>
                        <td>${teacher.subject || 'Faculty'}</td>
                        <th>CNIC / National ID</th>
                        <td>${teacher.cnic || '-'}</td>
                    </tr>
                    <tr>
                        <th>Assigned Class</th>
                        <td>${teacher.classAssigned || 'Senior School'}</td>
                        <th>Disbursement Date</th>
                        <td>${rec.paymentDate}</td>
                    </tr>
                </table>

                <!-- Earnings and Deductions 2-Column Table -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                            Earnings
                        </h4>
                        <table class="print-table">
                            <tr>
                                <th>Basic Salary</th>
                                <td style="text-align: right;">${settings.currency} ${(rec.basicSalary || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Fixed Allowances</th>
                                <td style="text-align: right;">${settings.currency} ${(rec.allowances || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Special Bonus / Incentive</th>
                                <td style="text-align: right;">${settings.currency} ${(rec.bonus || 0).toLocaleString()}</td>
                            </tr>
                            <tr style="background-color: #f8fafc; font-weight: bold;">
                                <th>Gross Earnings</th>
                                <td style="text-align: right;">${settings.currency} ${((rec.basicSalary || 0) + (rec.allowances || 0) + (rec.bonus || 0)).toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <h4 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
                            Deductions
                        </h4>
                        <table class="print-table">
                            <tr>
                                <th>Tax & Provident Fund</th>
                                <td style="text-align: right;">${settings.currency} ${(rec.deductions || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Unpaid Leave Deductions</th>
                                <td style="text-align: right;">${settings.currency} 0</td>
                            </tr>
                            <tr>
                                <th>Security / Other Fund</th>
                                <td style="text-align: right;">${settings.currency} 0</td>
                            </tr>
                            <tr style="background-color: #f8fafc; font-weight: bold;">
                                <th>Total Deductions</th>
                                <td style="text-align: right;">${settings.currency} ${(rec.deductions || 0).toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Net Pay Box -->
                <div style="border: 2px solid #0f172a; padding: 15px; border-radius: 6px; margin: 25px 0; background-color: #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 10pt; text-transform: uppercase; font-weight: 700; color: #475569;">NET TAKE-HOME PAYABLE SALARY</div>
                        <div style="font-size: 11pt; font-weight: 600; color: #0f172a;">Formula: Basic + Allowances + Bonus - Deductions</div>
                    </div>
                    <div style="font-size: 20pt; font-weight: 800; color: #1e3a8a;">
                        ${settings.currency} ${(rec.netSalary || 0).toLocaleString()}
                    </div>
                </div>

                <!-- Signatures -->
                <div class="print-signature-section">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Employee Signature</div>
                        <div class="signature-sub">Received & Acknowledged</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Accounts / Finance Manager</div>
                        <div class="signature-sub">Disbursed & Audited</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">${settings.principalName}</div>
                        <div class="signature-sub">Principal / Executive Director</div>
                    </div>
                </div>
            </div>
        `;

        window.print();
    }

    function init() {
        document.getElementById('payroll-form')?.addEventListener('submit', handlePayrollSubmit);
        document.getElementById('filter-payroll-month')?.addEventListener('change', renderPayroll);
        document.getElementById('filter-payroll-status')?.addEventListener('change', renderPayroll);
        document.getElementById('filter-payroll-search')?.addEventListener('input', renderPayroll);

        ['pay-input-basic', 'pay-input-allowances', 'pay-input-bonus', 'pay-input-deductions'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', calculateModalNetSalary);
        });

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'payroll') {
                renderPayroll();
            }
        });

        // Initial render
        renderPayroll();
    }

    return {
        init: init,
        render: renderPayroll,
        openEditModal: openEditModal,
        deletePayroll: deletePayroll,
        printSalarySlip: printSalarySlip
    };
})();

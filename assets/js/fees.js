/**
 * School Management System - Fees Management Controller
 * Handles student fee vouchers, collection tracking, payment records,
 * and official 3-part Fee Challan / Receipt printing.
 */

const FeesModule = (function () {

    function renderFees() {
        const fees = SchoolDB.getFees();
        const settings = SchoolDB.getSettings();

        const monthVal = document.getElementById('filter-fee-month')?.value || '';
        const statusVal = document.getElementById('filter-fee-status')?.value || '';
        const searchVal = document.getElementById('filter-fee-search')?.value.trim().toLowerCase() || '';

        const filtered = fees.filter(f => {
            if (monthVal && f.feeMonth !== monthVal) return false;
            if (statusVal && f.status !== statusVal) return false;
            if (searchVal) {
                const matchName = f.studentName.toLowerCase().includes(searchVal);
                const matchId = f.studentId.toLowerCase().includes(searchVal);
                const matchClass = f.className && f.className.toLowerCase().includes(searchVal);
                if (!matchName && !matchId && !matchClass) return false;
            }
            return true;
        });

        // Statistics
        const totalCollectible = filtered.reduce((sum, f) => sum + (f.totalFee || 0), 0);
        const totalCollected = filtered.reduce((sum, f) => sum + (f.paid || 0), 0);
        const totalPending = filtered.reduce((sum, f) => sum + (f.pending || 0), 0);
        const defaulters = filtered.filter(f => f.status === 'Pending').length;

        document.getElementById('stat-fee-total').textContent = `${settings.currency} ${totalCollectible.toLocaleString()}`;
        document.getElementById('stat-fee-collected').textContent = `${settings.currency} ${totalCollected.toLocaleString()}`;
        document.getElementById('stat-fee-pending').textContent = `${settings.currency} ${totalPending.toLocaleString()}`;
        document.getElementById('stat-fee-defaulters').textContent = defaulters;

        const tbody = document.getElementById('fees-table-body');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">No fee records found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(f => `
            <tr>
                <td><span class="badge bg-light text-dark border">${f.id}</span></td>
                <td>
                    <div class="fw-bold">${f.studentName}</div>
                    <div class="text-muted" style="font-size: 11px;">ID: ${f.studentId}</div>
                </td>
                <td>${f.className} (${f.section || 'A'})</td>
                <td><span class="badge bg-secondary-subtle text-secondary">${f.feeMonth}</span></td>
                <td><strong>${settings.currency} ${(f.totalFee || 0).toLocaleString()}</strong></td>
                <td><span class="text-success fw-bold">${settings.currency} ${(f.paid || 0).toLocaleString()}</span></td>
                <td><span class="text-danger fw-bold">${settings.currency} ${(f.pending || 0).toLocaleString()}</span></td>
                <td><span class="text-muted" style="font-size: 12px;">${f.dueDate}</span></td>
                <td><span class="badge-status badge-status-${f.status.toLowerCase()}">${f.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-sm btn-outline-primary py-1 px-2" style="font-size: 11px;" title="Print Official Fee Receipt" onclick="FeesModule.printFeeReceipt('${f.id}')">
                            <i class="fas fa-print me-1"></i> Receipt
                        </button>
                        <button class="table-action-btn edit-btn" title="Record Payment" onclick="FeesModule.openPaymentModal('${f.id}')">
                            <i class="fas fa-cash-register"></i>
                        </button>
                        <button class="table-action-btn delete-btn" title="Delete Voucher" onclick="FeesModule.deleteFee('${f.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function openRecordPaymentModal() {
        document.getElementById('fee-form').reset();
        document.getElementById('fee-form-id').value = '';
        document.getElementById('fee-modal-title').textContent = 'Generate New Fee Voucher';

        // Populate student selector
        const sel = document.getElementById('fee-input-student');
        const students = SchoolDB.getStudents();
        sel.innerHTML = students.map(s => `
            <option value="${s.id}" data-name="${s.fullName}" data-class="${s.className}" data-sec="${s.section}">
                ${s.fullName} (${s.className}-${s.section} | ID: ${s.id})
            </option>
        `).join('');

        document.getElementById('fee-input-month').value = 'October 2026';
        document.getElementById('fee-input-due').value = '2026-10-15';
        document.getElementById('fee-input-tuition').value = '15000';
        document.getElementById('fee-input-exam').value = '1500';
        document.getElementById('fee-input-lab').value = '500';
        document.getElementById('fee-input-other').value = '0';
        document.getElementById('fee-input-paid').value = '17000';
        document.getElementById('fee-input-date').value = new Date().toISOString().split('T')[0];

        calculateModalFeeTotals();

        const modalEl = document.getElementById('fee-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function openPaymentModal(feeId) {
        const fees = SchoolDB.getFees();
        const f = fees.find(item => item.id === feeId);
        if (!f) return;

        document.getElementById('fee-form-id').value = f.id;
        document.getElementById('fee-modal-title').textContent = `Record Payment: ${f.studentName}`;

        const sel = document.getElementById('fee-input-student');
        sel.innerHTML = `<option value="${f.studentId}" selected>${f.studentName} (${f.className})</option>`;
        
        document.getElementById('fee-input-month').value = f.feeMonth;
        document.getElementById('fee-input-due').value = f.dueDate;
        document.getElementById('fee-input-tuition').value = f.tuitionFee || (f.totalFee - 2000);
        document.getElementById('fee-input-exam').value = f.examFee || 1500;
        document.getElementById('fee-input-lab').value = f.labFee || 500;
        document.getElementById('fee-input-other').value = f.otherFee || 0;
        document.getElementById('fee-input-paid').value = f.paid;
        document.getElementById('fee-input-date').value = f.paymentDate === '-' ? new Date().toISOString().split('T')[0] : f.paymentDate;
        document.getElementById('fee-input-method').value = f.paymentMethod || 'Online Bank Transfer';

        calculateModalFeeTotals();

        const modalEl = document.getElementById('fee-modal');
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function calculateModalFeeTotals() {
        const tuition = parseFloat(document.getElementById('fee-input-tuition').value) || 0;
        const exam = parseFloat(document.getElementById('fee-input-exam').value) || 0;
        const lab = parseFloat(document.getElementById('fee-input-lab').value) || 0;
        const other = parseFloat(document.getElementById('fee-input-other').value) || 0;
        const paid = parseFloat(document.getElementById('fee-input-paid').value) || 0;

        const total = tuition + exam + lab + other;
        const pending = Math.max(0, total - paid);

        const settings = SchoolDB.getSettings();
        document.getElementById('fee-modal-total-preview').textContent = `${settings.currency} ${total.toLocaleString()}`;
        document.getElementById('fee-modal-pending-preview').textContent = `${settings.currency} ${pending.toLocaleString()}`;
    }

    function handleFeeSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('fee-form-id').value;
        const sel = document.getElementById('fee-input-student');
        const selectedOpt = sel.options[sel.selectedIndex];

        const tuition = parseFloat(document.getElementById('fee-input-tuition').value) || 0;
        const exam = parseFloat(document.getElementById('fee-input-exam').value) || 0;
        const lab = parseFloat(document.getElementById('fee-input-lab').value) || 0;
        const other = parseFloat(document.getElementById('fee-input-other').value) || 0;
        const paid = parseFloat(document.getElementById('fee-input-paid').value) || 0;
        const total = tuition + exam + lab + other;
        const pending = Math.max(0, total - paid);

        let status = 'Pending';
        if (pending === 0) status = 'Paid';
        else if (paid > 0) status = 'Partial';

        const feeData = {
            id: id || undefined,
            studentId: sel.value,
            studentName: selectedOpt ? selectedOpt.getAttribute('data-name') || selectedOpt.text.split('(')[0].trim() : 'Student',
            className: selectedOpt ? selectedOpt.getAttribute('data-class') || 'Grade' : 'Grade',
            section: selectedOpt ? selectedOpt.getAttribute('data-sec') || 'A' : 'A',
            feeMonth: document.getElementById('fee-input-month').value,
            tuitionFee: tuition,
            examFee: exam,
            labFee: lab,
            otherFee: other,
            totalFee: total,
            paid: paid,
            pending: pending,
            dueDate: document.getElementById('fee-input-due').value,
            paymentDate: paid > 0 ? document.getElementById('fee-input-date').value : '-',
            paymentMethod: document.getElementById('fee-input-method').value,
            status: status
        };

        SchoolDB.saveFee(feeData);
        App.showToast(`Fee record saved for ${feeData.studentName}.`, 'success', 'fa-receipt');

        const modalEl = document.getElementById('fee-modal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        renderFees();
    }

    function deleteFee(id) {
        App.confirmAction(
            'Delete Fee Voucher',
            'Are you sure you want to delete this fee voucher?',
            'Yes, Delete',
            function () {
                SchoolDB.deleteFee(id);
                App.showToast('Fee voucher deleted.', 'warning');
                renderFees();
            }
        );
    }

    // Official 3-Part Bank/School/Student Challan Printing
    function printFeeReceipt(feeId) {
        const fees = SchoolDB.getFees();
        const f = fees.find(item => item.id === feeId);
        if (!f) return;

        const student = SchoolDB.getStudentById(f.studentId) || {};
        const settings = SchoolDB.getSettings();

        const printContainer = document.getElementById('print-document-content');
        if (!printContainer) return;

        function renderCopy(copyName) {
            return `
                <div class="challan-copy">
                    <div style="text-align: center; border-bottom: 1.5px solid #0f172a; padding-bottom: 6px; margin-bottom: 8px;">
                        <h4 style="margin: 0; font-size: 11pt; font-weight: 800; color: #0f172a;">${settings.schoolName}</h4>
                        <div style="font-size: 7.5pt; color: #475569;">${settings.campus}</div>
                        <div style="display: inline-block; background: #0f172a; color: #fff; font-size: 8pt; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-top: 4px;">
                            ${copyName.toUpperCase()}
                        </div>
                    </div>

                    <div style="font-size: 8.5pt; line-height: 1.4; margin-bottom: 8px;">
                        <strong>Challan No:</strong> ${f.id}<br>
                        <strong>Fee Month:</strong> ${f.feeMonth}<br>
                        <strong>Issue Date:</strong> 2026-10-01<br>
                        <strong>Due Date:</strong> ${f.dueDate}
                    </div>

                    <div style="border: 1px solid #cbd5e1; padding: 6px; border-radius: 4px; margin-bottom: 8px; font-size: 8.5pt;">
                        <strong>Student:</strong> ${f.studentName}<br>
                        <strong>ID:</strong> ${f.studentId} &nbsp;|&nbsp; <strong>Roll:</strong> ${student.rollNumber || '-'}<br>
                        <strong>Class:</strong> ${f.className} (${f.section || 'A'})<br>
                        <strong>Father:</strong> ${student.fatherName || '-'}
                    </div>

                    <table class="print-table" style="font-size: 8pt; margin-bottom: 8px;">
                        <tr><th>Tuition Fee</th><td style="text-align: right;">${settings.currency} ${(f.tuitionFee || (f.totalFee - 2000)).toLocaleString()}</td></tr>
                        <tr><th>Examination Fee</th><td style="text-align: right;">${settings.currency} ${(f.examFee || 1500).toLocaleString()}</td></tr>
                        <tr><th>Science / Lab Fund</th><td style="text-align: right;">${settings.currency} ${(f.labFee || 500).toLocaleString()}</td></tr>
                        <tr style="font-weight: bold; background: #f1f5f9;">
                            <th>Payable Total</th>
                            <td style="text-align: right;">${settings.currency} ${(f.totalFee || 0).toLocaleString()}</td>
                        </tr>
                        <tr><th>Amount Paid</th><td style="text-align: right; color: green;">${settings.currency} ${(f.paid || 0).toLocaleString()}</td></tr>
                        <tr style="font-weight: bold; color: ${f.pending > 0 ? 'red' : 'black'};">
                            <th>Balance Arrears</th>
                            <td style="text-align: right;">${settings.currency} ${(f.pending || 0).toLocaleString()}</td>
                        </tr>
                    </table>

                    <div style="font-size: 7.5pt; color: #64748b; margin-bottom: 15px;">
                        <em>Bank: Askari Bank / HBL Sector F-8 Branch (A/C: 0102-8492019401)</em><br>
                        <em>Status: <strong>${f.status}</strong></em>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 7.5pt;">
                        <div>
                            <div style="border-top: 1px solid #0f172a; width: 80px; text-align: center;">Cashier</div>
                        </div>
                        <div>
                            <div style="border-top: 1px solid #0f172a; width: 80px; text-align: center;">Officer Seal</div>
                        </div>
                    </div>
                </div>
            `;
        }

        printContainer.innerHTML = `
            <div class="printable-document">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 14pt; font-weight: 800;">OFFICIAL SCHOOL FEE CHALLAN</h3>
                    <div style="font-size: 9pt; color: #64748b;">Deposit valid at all designated bank branches or school cashier desk</div>
                </div>

                <div class="challan-grid">
                    ${renderCopy('Bank Copy')}
                    ${renderCopy('School Accounts Copy')}
                    ${renderCopy('Student / Parent Copy')}
                </div>
            </div>
        `;

        window.print();
    }

    function init() {
        document.getElementById('btn-add-fee')?.addEventListener('click', openRecordPaymentModal);
        document.getElementById('fee-form')?.addEventListener('submit', handleFeeSubmit);
        document.getElementById('filter-fee-month')?.addEventListener('change', renderFees);
        document.getElementById('filter-fee-status')?.addEventListener('change', renderFees);
        document.getElementById('filter-fee-search')?.addEventListener('input', renderFees);

        ['fee-input-tuition', 'fee-input-exam', 'fee-input-lab', 'fee-input-other', 'fee-input-paid'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', calculateModalFeeTotals);
        });

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'fees') {
                renderFees();
            }
        });

        // Initial render
        renderFees();
    }

    return {
        init: init,
        render: renderFees,
        openRecordPaymentModal: openRecordPaymentModal,
        openPaymentModal: openPaymentModal,
        deleteFee: deleteFee,
        printFeeReceipt: printFeeReceipt
    };
})();

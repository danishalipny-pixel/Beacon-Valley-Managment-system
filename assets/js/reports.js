/**
 * School Management System - Reports Generator Controller
 * Generates Student, Teacher, and Financial Reports with live filters,
 * CSV export, and print-friendly official reporting layout.
 */

const ReportsModule = (function () {
    let currentReportType = 'student-list';
    let currentReportData = [];

    function generateReport(reportType) {
        currentReportType = reportType || currentReportType;
        const settings = SchoolDB.getSettings();

        // Update active tab buttons
        document.querySelectorAll('.report-type-btn').forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-primary');
            if (btn.getAttribute('data-type') === currentReportType) {
                btn.classList.add('active', 'btn-primary');
                btn.classList.remove('btn-outline-primary');
            }
        });

        const titleEl = document.getElementById('report-view-title');
        const thead = document.getElementById('report-table-head');
        const tbody = document.getElementById('report-table-body');
        if (!thead || !tbody) return;

        let headers = [];
        let rows = [];

        switch (currentReportType) {
            case 'student-list':
                titleEl.textContent = 'Student Directory Master Report';
                headers = ['Student ID', 'Full Name', 'Father Name', 'Class & Sec', 'Roll No', 'Gender', 'Phone', 'Status'];
                currentReportData = SchoolDB.getStudents();
                rows = currentReportData.map(s => [
                    s.id, s.fullName, s.fatherName, `${s.className} (${s.section})`, s.rollNumber || '-', s.gender, s.studentPhone || s.fatherPhone || '-', s.status
                ]);
                break;

            case 'student-attendance':
                titleEl.textContent = 'Student Attendance Register Summary';
                headers = ['Student ID', 'Student Name', 'Class & Sec', 'Total Days', 'Present', 'Absent', 'Leave', 'Percentage'];
                currentReportData = SchoolDB.getStudents();
                rows = currentReportData.map(s => {
                    const a = s.attendanceSummary || { totalDays: 168, presentDays: 155, absentDays: 8, leaveDays: 5, percentage: 92 };
                    return [s.id, s.fullName, `${s.className} (${s.section})`, a.totalDays, a.presentDays, a.absentDays, a.leaveDays, `${a.percentage}%`];
                });
                break;

            case 'student-leaves':
                titleEl.textContent = 'Student Leave Applications Log';
                headers = ['Leave ID', 'Student Name', 'Class & Sec', 'From', 'To', 'Days', 'Reason', 'Status'];
                currentReportData = SchoolDB.getStudentLeaves();
                rows = currentReportData.map(l => [
                    l.id, l.studentName, `${l.className} (${l.section})`, l.leaveFrom, l.leaveTo, l.days, l.reason, l.status
                ]);
                break;

            case 'student-academic':
                titleEl.textContent = 'Student Multi-Year Academic History Progress';
                headers = ['Student ID', 'Student Name', 'Year', 'Class', 'Roll', 'Attendance', 'Marks/Total', 'Grade', 'Status'];
                currentReportData = [];
                SchoolDB.getStudents().forEach(s => {
                    (s.academicHistory || []).forEach(h => {
                        currentReportData.push({ student: s, history: h });
                        rows.push([
                            s.id, s.fullName, h.academicYear, h.className, h.rollNumber, `${h.attendancePercentage || 90}%`, `${h.marksObtained || '-'}/${h.totalMarks || '-'}`, h.grade || '-', h.promotionStatus
                        ]);
                    });
                });
                break;

            case 'teacher-list':
                titleEl.textContent = 'Faculty Directory & Qualifications';
                headers = ['Teacher ID', 'Full Name', 'Father/Husband', 'Subject', 'Class Assigned', 'Qualification', 'Phone', 'Salary'];
                currentReportData = SchoolDB.getTeachers();
                rows = currentReportData.map(t => [
                    t.id, t.fullName, t.fatherOrHusbandName || '-', t.subject, t.classAssigned || 'General', t.qualification, t.phone, `${settings.currency} ${(t.basicSalary || 0).toLocaleString()}`
                ]);
                break;

            case 'teacher-attendance':
                titleEl.textContent = 'Faculty Daily Attendance Log';
                headers = ['Teacher ID', 'Teacher Name', 'Date', 'Check-In', 'Check-Out', 'Status', 'Punctuality'];
                currentReportData = SchoolDB.getTeacherAttendance();
                rows = currentReportData.map(t => [
                    t.teacherId, t.teacherName, t.date, t.checkIn, t.checkOut, t.status, t.lateArrival ? 'Late Arrival' : 'On Time'
                ]);
                break;

            case 'teacher-payroll':
                titleEl.textContent = 'Teacher Monthly Payroll Disbursement Report';
                headers = ['Voucher Ref', 'Teacher Name', 'Month', 'Basic', 'Allowances', 'Bonus', 'Deductions', 'Net Payable', 'Status'];
                currentReportData = SchoolDB.getPayroll();
                rows = currentReportData.map(p => [
                    p.id, p.teacherName, p.paymentMonth, `${settings.currency} ${(p.basicSalary || 0).toLocaleString()}`, `${settings.currency} ${(p.allowances || 0).toLocaleString()}`, `${settings.currency} ${(p.bonus || 0).toLocaleString()}`, `${settings.currency} ${(p.deductions || 0).toLocaleString()}`, `${settings.currency} ${(p.netSalary || 0).toLocaleString()}`, p.paymentStatus
                ]);
                break;

            case 'fee-collection':
                titleEl.textContent = 'Student Fee Collection Register';
                headers = ['Receipt No', 'Student Name', 'Class', 'Month', 'Total Fee', 'Paid Amount', 'Pending Arrears', 'Status'];
                currentReportData = SchoolDB.getFees();
                rows = currentReportData.map(f => [
                    f.id, f.studentName, f.className, f.feeMonth, `${settings.currency} ${(f.totalFee || 0).toLocaleString()}`, `${settings.currency} ${(f.paid || 0).toLocaleString()}`, `${settings.currency} ${(f.pending || 0).toLocaleString()}`, f.status
                ]);
                break;

            case 'pending-fees':
                titleEl.textContent = 'Overdue Arrears & Fee Defaulters List';
                headers = ['Voucher No', 'Student Name', 'Class', 'Due Date', 'Total Fee', 'Paid', 'Pending Arrears', 'Action'];
                currentReportData = SchoolDB.getFees().filter(f => f.pending > 0);
                rows = currentReportData.map(f => [
                    f.id, f.studentName, f.className, f.dueDate, `${settings.currency} ${(f.totalFee || 0).toLocaleString()}`, `${settings.currency} ${(f.paid || 0).toLocaleString()}`, `${settings.currency} ${(f.pending || 0).toLocaleString()}`, 'Send SMS Reminder'
                ]);
                break;

            default:
                break;
        }

        // Render Head
        thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;

        // Render Body
        if (rows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${headers.length}" class="text-center py-4 text-muted">No records found for this report type.</td></tr>`;
        } else {
            tbody.innerHTML = rows.map(r => `
                <tr>
                    ${r.map((cell, idx) => `<td>${cell}</td>`).join('')}
                </tr>
            `).join('');
        }

        // Update Record Count
        document.getElementById('report-record-count').textContent = `${rows.length} Records`;
    }

    // Export Current Report to CSV
    function exportToCSV() {
        const thead = document.getElementById('report-table-head');
        const tbody = document.getElementById('report-table-body');
        if (!thead || !tbody) return;

        let csv = [];
        // Extract headers
        const headerCells = Array.from(thead.querySelectorAll('th')).map(th => `"${th.textContent.replace(/"/g, '""')}"`);
        csv.push(headerCells.join(','));

        // Extract rows
        tbody.querySelectorAll('tr').forEach(tr => {
            const rowCells = Array.from(tr.querySelectorAll('td')).map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`);
            if (rowCells.length > 0) csv.push(rowCells.join(','));
        });

        const csvString = csv.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `SMS_Report_${currentReportType}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        App.showToast('Report CSV file downloaded successfully.', 'success', 'fa-file-csv');
    }

    // Print Report Document
    function printReport() {
        const title = document.getElementById('report-view-title').textContent;
        const thead = document.getElementById('report-table-head').innerHTML;
        const tbody = document.getElementById('report-table-body').innerHTML;
        const settings = SchoolDB.getSettings();

        const printContainer = document.getElementById('print-document-content');
        if (!printContainer) return;

        printContainer.innerHTML = `
            <div class="printable-document">
                <div class="official-doc-header">
                    <div class="school-print-brand">
                        <div class="school-print-logo-box"><i class="fas fa-file-alt"></i></div>
                        <div class="school-print-details">
                            <h2>${settings.schoolName}</h2>
                            <p>${settings.campus} • Affiliation: ${settings.affiliation}</p>
                        </div>
                    </div>
                    <div class="doc-type-badge">
                        <div class="doc-type-title">EXECUTIVE AUDIT REPORT</div>
                        <div class="doc-date-meta">Printed: ${new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                <h3 style="font-size: 13pt; font-weight: 800; margin-bottom: 12px; color: #0f172a; text-transform: uppercase;">
                    ${title}
                </h3>

                <table class="print-table">
                    <thead>${thead}</thead>
                    <tbody>${tbody}</tbody>
                </table>

                <div class="print-signature-section">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div class="signature-title">Prepared By</div>
                        <div class="signature-sub">Data Administration Office</div>
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

    function init() {
        document.querySelectorAll('.report-type-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const type = this.getAttribute('data-type');
                generateReport(type);
            });
        });

        document.getElementById('report-export-csv-btn')?.addEventListener('click', exportToCSV);
        document.getElementById('report-print-btn')?.addEventListener('click', printReport);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'reports') {
                generateReport('student-list');
            }
        });
    }

    return {
        init: init,
        generateReport: generateReport,
        exportToCSV: exportToCSV,
        printReport: printReport
    };
})();

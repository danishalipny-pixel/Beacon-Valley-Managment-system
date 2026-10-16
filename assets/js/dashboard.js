/**
 * School Management System - Dashboard Controller
 * Renders statistical cards, interactive Chart.js charts,
 * recent activities feed, and today's operational summaries.
 */

const DashboardModule = (function () {
    let studentAttChart = null;
    let teacherAttChart = null;
    let growthChart = null;
    let feeChart = null;

    function renderDashboard() {
        const stats = SchoolDB.getDashboardStats();
        const settings = SchoolDB.getSettings();

        // Render 10 Stat Cards
        document.getElementById('stat-total-students').textContent = stats.totalStudents;
        document.getElementById('stat-total-teachers').textContent = stats.totalTeachers;
        document.getElementById('stat-students-present').textContent = stats.presentStudentsToday;
        document.getElementById('stat-students-absent').textContent = stats.absentStudentsToday;
        document.getElementById('stat-students-leave').textContent = stats.studentsOnLeave;
        document.getElementById('stat-teachers-present').textContent = stats.teachersPresentToday;
        document.getElementById('stat-teachers-absent').textContent = stats.teachersAbsentToday;
        document.getElementById('stat-teachers-leave').textContent = stats.teachersOnLeave;
        document.getElementById('stat-pending-fees').textContent = `${settings.currency} ${stats.pendingFees.toLocaleString()}`;
        document.getElementById('stat-total-classes').textContent = stats.totalClasses;

        // Render Charts
        initCharts(stats);

        // Render Recent Activity Feed
        renderActivities();

        // Render Today's Absent Students Table & Teachers on Leave
        renderTodayOperationalLists();
    }

    function initCharts(stats) {
        // Destroy existing instances if any to prevent memory leaks / canvas glitches
        if (studentAttChart) studentAttChart.destroy();
        if (teacherAttChart) teacherAttChart.destroy();
        if (growthChart) growthChart.destroy();
        if (feeChart) feeChart.destroy();

        // 1. Student Attendance Doughnut Chart
        const stdCtx = document.getElementById('chart-student-attendance');
        if (stdCtx) {
            studentAttChart = new Chart(stdCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Absent', 'On Leave'],
                    datasets: [{
                        data: [stats.presentStudentsToday, stats.absentStudentsToday, stats.studentsOnLeave],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const total = stats.totalStudents || 1;
                                    const val = context.raw || 0;
                                    const pct = ((val / total) * 100).toFixed(1);
                                    return ` ${context.label}: ${val} (${pct}%)`;
                                }
                            }
                        }
                    },
                    cutout: '72%'
                }
            });
        }

        // 2. Teacher Attendance Doughnut Chart
        const tchCtx = document.getElementById('chart-teacher-attendance');
        if (tchCtx) {
            teacherAttChart = new Chart(tchCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Absent', 'On Leave'],
                    datasets: [{
                        data: [stats.teachersPresentToday, stats.teachersAbsentToday, stats.teachersOnLeave],
                        backgroundColor: ['#2563eb', '#ef4444', '#8b5cf6'],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } }
                    },
                    cutout: '72%'
                }
            });
        }

        // 3. Student Growth Chart by Academic Year
        const growthCtx = document.getElementById('chart-student-growth');
        if (growthCtx) {
            growthChart = new Chart(growthCtx, {
                type: 'bar',
                data: {
                    labels: ['2022-23', '2023-24', '2024-25', '2025-26 (Active)'],
                    datasets: [{
                        label: 'Student Enrollment',
                        data: [14, 18, 20, stats.totalStudents],
                        backgroundColor: ['#e2e8f0', '#cbd5e1', '#93c5fd', '#2563eb'],
                        borderRadius: 8,
                        barThickness: 28
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
                        }
                    }
                }
            });
        }

        // 4. Fee Overview Chart (Paid, Pending, Partial)
        const feeCtx = document.getElementById('chart-fee-overview');
        if (feeCtx) {
            const fees = SchoolDB.getFees();
            const paidCount = fees.filter(f => f.status === 'Paid').length;
            const partialCount = fees.filter(f => f.status === 'Partial').length;
            const pendingCount = fees.filter(f => f.status === 'Pending').length;

            feeChart = new Chart(feeCtx, {
                type: 'pie',
                data: {
                    labels: ['Fully Paid', 'Partial Payment', 'Pending Fee'],
                    datasets: [{
                        data: [paidCount, partialCount, pendingCount],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } }
                    }
                }
            });
        }
    }

    function renderActivities() {
        const listEl = document.getElementById('dashboard-activities-list');
        if (!listEl) return;

        const activities = SchoolDB.getActivities().slice(0, 7);
        if (activities.length === 0) {
            listEl.innerHTML = `<li class="text-muted text-center py-3">No recent activities recorded yet.</li>`;
            return;
        }

        listEl.innerHTML = activities.map(act => `
            <li class="activity-item">
                <div class="activity-icon-badge icon-${act.color || 'blue'}">
                    <i class="fas ${act.icon || 'fa-bell'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${act.text}</div>
                    <div class="activity-time"><i class="far fa-clock me-1"></i>${act.time}</div>
                </div>
            </li>
        `).join('');
    }

    function renderTodayOperationalLists() {
        // 1. Absent students today
        const absentTableBody = document.getElementById('today-absent-students-table');
        if (absentTableBody) {
            const todayStr = "2026-10-16";
            const records = SchoolDB.getStudentAttendance(todayStr).filter(r => r.status === 'Absent');
            const students = SchoolDB.getStudents();

            if (records.length === 0) {
                absentTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No students marked absent today.</td></tr>`;
            } else {
                absentTableBody.innerHTML = records.map(rec => {
                    const std = students.find(s => s.id === rec.studentId) || {};
                    return `
                        <tr>
                            <td>
                                <div class="table-student-cell">
                                    <img src="${std.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}" class="table-student-avatar" style="width:32px; height:32px;" alt="${rec.studentName}">
                                    <div>
                                        <div class="fw-bold" style="font-size: 13px;">${rec.studentName}</div>
                                        <div class="text-muted" style="font-size: 11px;">Roll: ${std.rollNumber || '-'}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${std.className || '-'} (${std.section || '-'})</td>
                            <td><span class="badge-status badge-status-absent">Absent</span></td>
                            <td>
                                <a href="tel:${std.fatherPhone || ''}" class="btn btn-sm btn-outline-secondary" title="Call Father: ${std.fatherPhone || '-'}">
                                    <i class="fas fa-phone me-1"></i> ${std.fatherPhone || 'Call'}
                                </a>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // 2. Teachers on leave today
        const leaveTableBody = document.getElementById('today-teachers-leave-table');
        if (leaveTableBody) {
            const todayStr = "2026-10-16";
            const tchLeaves = SchoolDB.getTeacherLeaves().filter(l => l.status === 'Approved' && l.leaveFrom <= todayStr && l.leaveTo >= todayStr);
            const teachers = SchoolDB.getTeachers();

            if (tchLeaves.length === 0) {
                leaveTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">All teaching faculty present today.</td></tr>`;
            } else {
                leaveTableBody.innerHTML = tchLeaves.map(lv => {
                    const tch = teachers.find(t => t.id === lv.teacherId) || {};
                    return `
                        <tr>
                            <td>
                                <div class="fw-bold" style="font-size: 13px;">${lv.teacherName}</div>
                                <div class="text-muted" style="font-size: 11px;">${tch.subject || '-'}</div>
                            </td>
                            <td>${lv.days} day(s)</td>
                            <td><span style="font-size: 12px; color: #475569;">${lv.reason}</span></td>
                            <td><span class="badge-status badge-status-leave">On Leave</span></td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }

    // Bind navigation event
    window.addEventListener('pageNavigated', function (e) {
        if (e.detail.page === 'dashboard') {
            renderDashboard();
        }
    });

    return {
        render: renderDashboard
    };
})();

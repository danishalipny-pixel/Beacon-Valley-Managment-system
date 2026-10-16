/**
 * School Management System - Settings & System Configuration Controller
 * Handles School Profile, Academic Configurations, and Database Backup/Restore.
 */

const SettingsModule = (function () {

    function renderSettings() {
        const settings = SchoolDB.getSettings();
        const years = SchoolDB.getAcademicYears();

        document.getElementById('set-input-school-name').value = settings.schoolName || '';
        document.getElementById('set-input-campus').value = settings.campus || '';
        document.getElementById('set-input-phone').value = settings.phone || '';
        document.getElementById('set-input-email').value = settings.email || '';
        document.getElementById('set-input-website').value = settings.website || '';
        document.getElementById('set-input-affiliation').value = settings.affiliation || '';
        document.getElementById('set-input-principal').value = settings.principalName || '';
        document.getElementById('set-input-currency').value = settings.currency || 'Rs.';
        document.getElementById('set-input-date-format').value = settings.dateFormat || 'YYYY-MM-DD';

        // Populate active year selector
        const yearSel = document.getElementById('set-input-active-year');
        if (yearSel) {
            yearSel.innerHTML = years.map(y => `
                <option value="${y.year}" ${y.year === settings.activeAcademicYear ? 'selected' : ''}>
                    ${y.year} (${y.status})
                </option>
            `).join('');
        }
    }

    function handleSettingsSubmit(e) {
        e.preventDefault();

        const newSettings = {
            schoolName: document.getElementById('set-input-school-name').value.trim(),
            campus: document.getElementById('set-input-campus').value.trim(),
            phone: document.getElementById('set-input-phone').value.trim(),
            email: document.getElementById('set-input-email').value.trim(),
            website: document.getElementById('set-input-website').value.trim(),
            affiliation: document.getElementById('set-input-affiliation').value.trim(),
            principalName: document.getElementById('set-input-principal').value.trim(),
            currency: document.getElementById('set-input-currency').value.trim() || 'Rs.',
            dateFormat: document.getElementById('set-input-date-format').value,
            activeAcademicYear: document.getElementById('set-input-active-year').value
        };

        SchoolDB.saveSettings(newSettings);
        App.syncHeaderSettings();
        App.showToast('School settings & profile updated successfully.', 'success', 'fa-save');
    }

    // Export entire database as JSON file
    function exportDatabaseJSON() {
        const backupData = {
            settings: SchoolDB.getSettings(),
            academicYears: SchoolDB.getAcademicYears(),
            classes: SchoolDB.getClasses(),
            subjects: SchoolDB.getSubjects(),
            teachers: SchoolDB.getTeachers(),
            students: SchoolDB.getStudents(),
            studentAttendance: SchoolDB.getStudentAttendance(),
            teacherAttendance: SchoolDB.getTeacherAttendance(),
            studentLeaves: SchoolDB.getStudentLeaves(),
            teacherLeaves: SchoolDB.getTeacherLeaves(),
            payroll: SchoolDB.getPayroll(),
            fees: SchoolDB.getFees(),
            backupDate: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `SMS_Full_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        App.showToast('Database backup downloaded successfully.', 'success', 'fa-download');
    }

    // Reset to factory sample data
    function resetDefaultData() {
        App.confirmAction(
            'Reset System Database',
            'Are you sure you want to restore the default sample database? All custom modifications will be reset to default Pakistani school records.',
            'Yes, Reset Everything',
            function () {
                SchoolDB.resetToDefaults();
                App.syncHeaderSettings();
                App.showToast('System database reset to initial sample data.', 'info', 'fa-undo');
                renderSettings();
                // If on dashboard, re-render
                DashboardModule.render();
            }
        );
    }

    function init() {
        document.getElementById('settings-form')?.addEventListener('submit', handleSettingsSubmit);
        document.getElementById('btn-export-backup')?.addEventListener('click', exportDatabaseJSON);
        document.getElementById('btn-reset-defaults')?.addEventListener('click', resetDefaultData);

        window.addEventListener('pageNavigated', function (e) {
            if (e.detail.page === 'settings') {
                renderSettings();
            }
        });

        // Initial render
        renderSettings();
    }

    return {
        init: init,
        render: renderSettings,
        exportDatabaseJSON: exportDatabaseJSON,
        resetDefaultData: resetDefaultData
    };
})();

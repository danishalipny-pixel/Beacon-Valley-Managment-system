# Beacon Valley International Academy — Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js%204.x-orange.svg)](https://www.chartjs.org/)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-success.svg)](#features)

> **Beacon Valley Management System** — A modern, fully responsive, production-ready School Management System (SMS) for managing students, teachers, attendance, leaves, payroll, fees, academic history, classes, and administrative reports.

Designed as an executive SaaS dashboard for educational institutions. The system opens **directly on the main operational dashboard** (no login friction) and works smoothly across all screen sizes (mobile, tablet, laptop, and desktop).

---

## 🌟 Key Features

### 1. 📊 Executive School Dashboard
- **Instant Entry**: Boots directly to the operational dashboard without login/signup barriers.
- **10 Core Metric KPI Cards**: Real-time totals for Students, Teachers, Present/Absent Students, Students on Leave, Teachers on Duty/Absent/Leave, Pending Fees, and Total Classes.
- **4 Interactive Visualizations (Chart.js)**:
  - Daily Student Attendance (Present / Absent / Leave doughnut)
  - Daily Teacher Attendance distribution
  - Multi-Year Student Enrollment Growth
  - Fee Collections breakdown (Paid, Partial, Pending)
- **Today's Operational Actions**: Uninformed student absence register with guardian one-click call buttons, and teachers on leave duty cover table.
- **Real-Time Activity Stream**: Live feed of attendance, enrollment, and payment operations.

### 2. 🎓 Student Management & 20+ Data Fields
- Complete CRUD operations (Add, Edit, View, Delete, Filter).
- Filter by Quick Search (Name, ID, Roll, Father, Phone), Academic Class, Section, Academic Session, Gender, and Status.
- **4 Field Categories**:
  - **Personal**: Full Name, Father Name, Mother Name, Gender, DOB, B-Form / CNIC, Student Photo, Blood Group, Religion, Nationality.
  - **Contact**: Student Phone, Father Phone, Mother Phone, Email, Complete Address, City.
  - **Academic**: Admission Number, Admission Date, Class, Section, Roll Number, Session, Previous School, Previous Class, Admission Type.
  - **Emergency**: Contact Name, Emergency Phone, Relationship.

### 3. 👤 Comprehensive Student Profile & Academic History
- **Hero Card**: Large student photograph, full details, roll number, session, and status badge.
- **Summary Cards**: Personal information, contact directory, academic admission specs, fee summary, and leave history.
- **Visual Attendance Progress**: Percentage progress bar with present/absent breakdown.
- **Complete School History (All Sessions)**:
  - Multi-year progression table (Year, Class, Section, Roll No, Attendance bar, Result, Promotion status).
  - Year-by-year dossier cards with Class Teacher, Attendance counts, Marks / Percentage, Grade, Position rank (*1st*, *2nd*, *3rd*), and Remarks.
  - Interactive **"+ Add Academic Record"** modal supporting unlimited academic history records per student.

### 4. 👨‍🏫 Teacher & Faculty Management (Strictly No Photos)
- Designed to institutional specifications with **no faculty photos**; uses clean typographic initials badges (`TM`, `SR`, `KA`).
- Tracking: Teacher ID, S/D/W Guardian name, Qualification, Primary Subject, Class Assigned, Joining Date, Phone, Basic Salary, Allowances, and Status.
- Printable Official Faculty Dossier with letterhead and signature seals.

### 5. 📅 Daily Attendance Registers
- **Student Attendance**: Class & Section roster selector, interactive `P` / `A` / `L` status pills, inline remarks, live rate percentage, and bulk "Mark All Present" / "Mark All Absent".
- **Teacher Attendance**: Daily faculty register with Check-in time, Check-out time, status, and late arrival tracking.

### 6. 🏖️ Leave Management
- Distinct approval workflows for students and faculty.
- Applied date, leave duration (days), date range, and reason.
- Approve/Reject actions that update real-time dashboard counts.

### 7. 💼 Teacher Payroll & Compensation
- Formula-driven compensation model:
  $$\text{Net Salary} = \text{Basic Salary} + \text{Allowances} + \text{Bonus} - \text{Deductions}$$
- Monthly payroll summary: Total Payroll, Disbursed, Pending, Deductions, and Bonuses.
- Printable Official Salary Payslip with institutional branding and triple verification signatures.

### 8. 🏫 Academic Structure: Classes, Sections & Subjects
- Standardized school tiers from Play Group, Nursery, Prep, through Grade 1 to 10.
- Class capacity, room assignments, active sections (`A`, `B`), and assigned class teachers.
- Curriculum subjects catalog with course codes and faculty allocation.

### 9. 💳 Fees Management & 3-Copy Bank Challan
- Voucher billing by month, student, class, and fee head (Tuition, Examination, Lab, Misc).
- Status tracking: `Paid`, `Partial`, `Pending` arrears.
- **Official 3-Copy Bank Challan**: Standard A4 print format featuring **Bank Copy**, **School Accounts Copy**, and **Student/Parent Copy**.

### 10. 📈 Institutional Reports & Audit Center
- 9 Exportable audit reports (Students, Attendance, Leaves, Academics, Faculty, Payroll, Fees, Defaulters).
- Instant **Export to CSV** for spreadsheets.
- **Print Formal Report** with official header and signature boxes.

### 11. ⚙️ System Settings & Data Engine
- Customizable school profile, campus address, board affiliation, currency symbol (`Rs.`), and principal name.
- **Export Data (JSON)**: Full database backup snapshot with a single click.
- **Reset to Sample Data**: Quick restore to default sample data.

---

## 📱 Mobile Responsiveness

The system is built mobile-first:
- **Responsive Drawer**: On mobile screens ($\le 1024\text{px}$), the sidebar converts into an off-canvas drawer with smooth slide-in animations.
- **Hamburger Menu**: One-touch topbar toggle with dark backdrop dismissal.
- **2-Column Mobile Stat Grid**: Metric cards neatly stack on phone viewports (360px - 480px).
- **Horizontal Scrollable Tables**: Tables use touch-swipe containers without breaking layouts.

---

## 🛠️ Technology Stack

- **HTML5** (Semantic structure, A4 print media layouts)
- **CSS3** (Custom properties, dark navy/royal blue theme, responsive grid/flexbox)
- **Bootstrap 5.3.3** (UI components, modals, dropdowns, grid)
- **JavaScript (ES6+)** (Modular architecture, vanilla DOM manipulation)
- **jQuery 3.7.1** (DOM utilities)
- **Chart.js** (Doughnut, Bar, and Polar Area data visualizations)
- **Font Awesome 6.5.1** (Vector icons)
- **LocalStorage / SchoolDB** (Persistent client-side database ready for REST API integration)

---

## 🚀 Quick Start

No build tools or compilers required! Simply clone and open:

```bash
# 1. Clone repository
git clone https://github.com/danishalipny-pixel/Beacon-Valley-Managment-system.git

# 2. Open directory
cd Beacon-Valley-Managment-system

# 3. Open index.html in your browser
# On Windows:
start index.html

# Or run with Python local server:
python -m http.server 8080
# Visit http://localhost:8080 in your browser
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

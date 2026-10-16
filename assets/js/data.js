/**
 * School Management System - Data Storage & Engine Layer (SchoolDB)
 * Production-ready mock data layer with LocalStorage persistence.
 * Ready to be replaced by REST API or Node.js backend.
 */

const SchoolDB = (function () {
    const STORAGE_KEY_PREFIX = 'SMS_DATA_';

    // Default Seed Data
    const defaultSettings = {
        schoolName: "Beacon Valley International Academy",
        campus: "Main Campus, Sector H-8/4, Islamabad",
        phone: "+92 51 4862190",
        email: "info@beaconvalley.edu.pk",
        website: "www.beaconvalley.edu.pk",
        affiliation: "FBISE Islamabad & Cambridge International (Reg # 84920)",
        principalName: "Prof. Dr. Tariq Mansoor (Ph.D Education)",
        currency: "Rs.",
        activeAcademicYear: "2025-26",
        dateFormat: "YYYY-MM-DD",
        establishedYear: "2008"
    };

    const defaultAcademicYears = [
        { id: "AY-1", year: "2022-23", status: "Archived", startDate: "2022-08-01", endDate: "2023-06-30" },
        { id: "AY-2", year: "2023-24", status: "Archived", startDate: "2023-08-01", endDate: "2024-06-30" },
        { id: "AY-3", year: "2024-25", status: "Archived", startDate: "2024-08-01", endDate: "2025-06-30" },
        { id: "AY-4", year: "2025-26", status: "Active", startDate: "2025-08-01", endDate: "2026-06-30" },
        { id: "AY-5", year: "2026-27", status: "Upcoming", startDate: "2026-08-01", endDate: "2027-06-30" }
    ];

    const defaultClasses = [
        { id: "CLS-PG", name: "Play Group", category: "Pre-School", sections: ["A", "B"], teacherId: "TCH-007", roomNo: "101", studentCapacity: 25 },
        { id: "CLS-NUR", name: "Nursery", category: "Pre-School", sections: ["A", "B"], teacherId: "TCH-008", roomNo: "102", studentCapacity: 30 },
        { id: "CLS-PREP", name: "Prep", category: "Pre-School", sections: ["A", "B"], teacherId: "TCH-006", roomNo: "103", studentCapacity: 30 },
        { id: "CLS-1", name: "Grade 1", category: "Primary", sections: ["A", "B"], teacherId: "TCH-002", roomNo: "201", studentCapacity: 35 },
        { id: "CLS-2", name: "Grade 2", category: "Primary", sections: ["A", "B"], teacherId: "TCH-004", roomNo: "202", studentCapacity: 35 },
        { id: "CLS-3", name: "Grade 3", category: "Primary", sections: ["A", "B"], teacherId: "TCH-002", roomNo: "203", studentCapacity: 35 },
        { id: "CLS-4", name: "Grade 4", category: "Primary", sections: ["A", "B"], teacherId: "TCH-006", roomNo: "204", studentCapacity: 35 },
        { id: "CLS-5", name: "Grade 5", category: "Middle", sections: ["A", "B"], teacherId: "TCH-005", roomNo: "301", studentCapacity: 40 },
        { id: "CLS-6", name: "Grade 6", category: "Middle", sections: ["A", "B"], teacherId: "TCH-003", roomNo: "302", studentCapacity: 40 },
        { id: "CLS-7", name: "Grade 7", category: "Middle", sections: ["A", "B"], teacherId: "TCH-001", roomNo: "303", studentCapacity: 40 },
        { id: "CLS-8", name: "Grade 8", category: "Middle", sections: ["A", "B"], teacherId: "TCH-005", roomNo: "304", studentCapacity: 40 },
        { id: "CLS-9", name: "Grade 9", category: "Secondary", sections: ["A", "B"], teacherId: "TCH-001", roomNo: "401", studentCapacity: 40 },
        { id: "CLS-10", name: "Grade 10", category: "Secondary", sections: ["A", "B"], teacherId: "TCH-003", roomNo: "402", studentCapacity: 40 }
    ];

    const defaultSubjects = [
        { id: "SUB-101", name: "Mathematics", code: "MATH-01", classId: "CLS-9", teacherId: "TCH-001", type: "Core", credits: 4, status: "Active" },
        { id: "SUB-102", name: "English Language & Literature", code: "ENG-01", classId: "CLS-9", teacherId: "TCH-002", type: "Core", credits: 4, status: "Active" },
        { id: "SUB-103", name: "Physics", code: "PHY-01", classId: "CLS-9", teacherId: "TCH-003", type: "Core (Practical)", credits: 4, status: "Active" },
        { id: "SUB-104", name: "Chemistry", code: "CHEM-01", classId: "CLS-9", teacherId: "TCH-005", type: "Core (Practical)", credits: 4, status: "Active" },
        { id: "SUB-105", name: "Biology", code: "BIO-01", classId: "CLS-9", teacherId: "TCH-004", type: "Elective", credits: 4, status: "Active" },
        { id: "SUB-106", name: "Computer Science", code: "CS-01", classId: "CLS-9", teacherId: "TCH-007", type: "Elective", credits: 4, status: "Active" },
        { id: "SUB-107", name: "Pakistan Studies & History", code: "PST-01", classId: "CLS-9", teacherId: "TCH-006", type: "Core", credits: 3, status: "Active" },
        { id: "SUB-108", name: "Islamiat / Ethics", code: "ISL-01", classId: "CLS-9", teacherId: "TCH-008", type: "Core", credits: 3, status: "Active" },
        { id: "SUB-201", name: "General Science", code: "GSCI-02", classId: "CLS-7", teacherId: "TCH-005", type: "Core", credits: 4, status: "Active" },
        { id: "SUB-202", name: "Urdu Literature", code: "URD-01", classId: "CLS-7", teacherId: "TCH-006", type: "Core", credits: 4, status: "Active" },
        { id: "SUB-203", name: "Mathematics Middle", code: "MATH-07", classId: "CLS-7", teacherId: "TCH-001", type: "Core", credits: 4, status: "Active" }
    ];

    // Teachers (NO photos as strictly instructed!)
    const defaultTeachers = [
        {
            id: "TCH-001",
            fullName: "Tariq Mehmood Abbasi",
            fatherOrHusbandName: "Ghulam Qadir Abbasi",
            gender: "Male",
            dob: "1983-05-14",
            cnic: "37405-1892834-1",
            qualification: "M.Phil Applied Mathematics (QAU)",
            subject: "Mathematics",
            classAssigned: "Grade 9 (Section A)",
            joiningDate: "2018-09-01",
            phone: "+92 300 5192841",
            email: "tariq.mehmood@beaconvalley.edu.pk",
            address: "House 42, St 18, F-10/2, Islamabad",
            employmentStatus: "Active",
            basicSalary: 85000,
            allowances: 15000,
            experienceYears: 12
        },
        {
            id: "TCH-002",
            fullName: "Sadia Rafiq",
            fatherOrHusbandName: "Muhammad Rafiq Sheikh",
            gender: "Female",
            dob: "1988-11-23",
            cnic: "61101-4928172-2",
            qualification: "M.A English Literature & Linguistics (NUML)",
            subject: "English Language & Literature",
            classAssigned: "Grade 1 (Section A)",
            joiningDate: "2019-03-15",
            phone: "+92 333 4819283",
            email: "sadia.rafiq@beaconvalley.edu.pk",
            address: "Apartment 4B, Silver Oaks, F-10, Islamabad",
            employmentStatus: "Active",
            basicSalary: 78000,
            allowances: 12000,
            experienceYears: 9
        },
        {
            id: "TCH-003",
            fullName: "Kamran Akmal Bhatti",
            fatherOrHusbandName: "Akmal Hussain Bhatti",
            gender: "Male",
            dob: "1985-07-09",
            cnic: "37405-7281920-3",
            qualification: "M.Sc Physics (Punjab University)",
            subject: "Physics",
            classAssigned: "Grade 10 (Section A)",
            joiningDate: "2017-08-10",
            phone: "+92 345 8192019",
            email: "kamran.akmal@beaconvalley.edu.pk",
            address: "Street 7, Sector G-9/1, Islamabad",
            employmentStatus: "Active",
            basicSalary: 92000,
            allowances: 18000,
            experienceYears: 14
        },
        {
            id: "TCH-004",
            fullName: "Nida Dar Chaudhry",
            fatherOrHusbandName: "Waqar Ahmad Chaudhry",
            gender: "Female",
            dob: "1991-04-18",
            cnic: "35202-9182740-4",
            qualification: "M.Sc Botany / Molecular Biology (NUST)",
            subject: "Biology & Life Sciences",
            classAssigned: "Grade 2 (Section B)",
            joiningDate: "2020-01-10",
            phone: "+92 321 7891234",
            email: "nida.dar@beaconvalley.edu.pk",
            address: "House 112, Street 34, I-8/2, Islamabad",
            employmentStatus: "Active",
            basicSalary: 74000,
            allowances: 11000,
            experienceYears: 7
        },
        {
            id: "TCH-005",
            fullName: "Dr. Abdul Rehman Niazi",
            fatherOrHusbandName: "Inamullah Khan Niazi",
            gender: "Male",
            dob: "1980-02-28",
            cnic: "38302-6182941-5",
            qualification: "Ph.D Organic Chemistry (QAU)",
            subject: "Chemistry & General Science",
            classAssigned: "Grade 8 (Section A)",
            joiningDate: "2016-04-01",
            phone: "+92 301 9283741",
            email: "abdul.rehman@beaconvalley.edu.pk",
            address: "House 24, Street 15, E-11/3, Islamabad",
            employmentStatus: "Active",
            basicSalary: 105000,
            allowances: 22000,
            experienceYears: 16
        },
        {
            id: "TCH-006",
            fullName: "Farah Naz Hashmi",
            fatherOrHusbandName: "Syed Kashif Hashmi",
            gender: "Female",
            dob: "1989-09-30",
            cnic: "61101-8374619-6",
            qualification: "M.A History & Pakistan Studies (QAU)",
            subject: "Pakistan Studies & Social Studies",
            classAssigned: "Grade 4 (Section A)",
            joiningDate: "2021-08-15",
            phone: "+92 334 5678901",
            email: "farah.hashmi@beaconvalley.edu.pk",
            address: "Block C, Police Foundation, Rawalpindi",
            employmentStatus: "Active",
            basicSalary: 70000,
            allowances: 10000,
            experienceYears: 6
        },
        {
            id: "TCH-007",
            fullName: "Engr. Imran Bashir",
            fatherOrHusbandName: "Bashir Ahmad",
            gender: "Male",
            dob: "1992-12-05",
            cnic: "37405-3928174-7",
            qualification: "B.S Software Engineering / M.S CS (FAST NUCES)",
            subject: "Computer Science & Robotics",
            classAssigned: "Grade 9 (Section B)",
            joiningDate: "2022-02-01",
            phone: "+92 306 9182736",
            email: "imran.bashir@beaconvalley.edu.pk",
            address: "House 89, Sector G-13/2, Islamabad",
            employmentStatus: "Active",
            basicSalary: 88000,
            allowances: 14000,
            experienceYears: 5
        },
        {
            id: "TCH-008",
            fullName: "Qari Muhammad Samina Tahir",
            fatherOrHusbandName: "Tahir Mahmood Alvi",
            gender: "Male",
            dob: "1984-06-21",
            cnic: "37405-1029384-8",
            qualification: "M.A Islamic Studies & Shahadat-ul-Almiya (Wafaq)",
            subject: "Islamiat & Quranic Studies",
            classAssigned: "Grade 6 (Section A)",
            joiningDate: "2017-01-15",
            phone: "+92 312 9876543",
            email: "samina.tahir@beaconvalley.edu.pk",
            address: "Madina Town, Kuri Road, Islamabad",
            employmentStatus: "Active",
            basicSalary: 72000,
            allowances: 10000,
            experienceYears: 13
        }
    ];

    // 22 realistic students with complete academic histories and full profile details
    const defaultStudents = [
        {
            id: "STD-2025-001",
            fullName: "Ahmed Khan Niazi",
            fatherName: "Jahangir Khan Niazi",
            motherName: "Shabana Kousar",
            gender: "Male",
            dob: "2010-04-12",
            bForm: "61101-9284719-1",
            photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 300 4819201",
            fatherPhone: "+92 300 9283711",
            motherPhone: "+92 301 8273619",
            email: "jahangir.niazi@gmail.com",
            address: "House 34-A, Street 12, Sector F-8/3",
            city: "Islamabad",
            admissionNumber: "ADM-2021-084",
            admissionDate: "2021-08-15",
            classId: "CLS-9",
            className: "Grade 9",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Army Public School Peshawar",
            previousClass: "Grade 5",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Jahangir Khan (Father)",
            emergencyContactNumber: "+92 300 9283711",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 158, absentDays: 6, leaveDays: 4, percentage: 94 },
            feeSummary: { totalFees: 90000, paid: 90000, pending: 0, lastPayment: "2026-10-05", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2022-23",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "04",
                    classTeacher: "Qari Samina Tahir",
                    totalDays: 210,
                    presentDays: 198,
                    absentDays: 8,
                    leaveDays: 4,
                    attendancePercentage: 94.3,
                    marksObtained: 945,
                    totalMarks: 1100,
                    percentage: 85.9,
                    grade: "A+",
                    position: "3rd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Excellent analytical mind, outstanding in science and mathematics."
                },
                {
                    academicYear: "2023-24",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "03",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 215,
                    presentDays: 202,
                    absentDays: 9,
                    leaveDays: 4,
                    attendancePercentage: 93.9,
                    marksObtained: 968,
                    totalMarks: 1100,
                    percentage: 88.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very active in robotics club. Consistent academic distinction."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 8",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Kamran Akmal Bhatti",
                    totalDays: 212,
                    presentDays: 204,
                    absentDays: 5,
                    leaveDays: 3,
                    attendancePercentage: 96.2,
                    marksObtained: 994,
                    totalMarks: 1100,
                    percentage: 90.3,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Awarded Best Student of the Year in Middle Section."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 9",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Tariq Mehmood Abbasi",
                    totalDays: 168,
                    presentDays: 158,
                    absentDays: 6,
                    leaveDays: 4,
                    attendancePercentage: 94.0,
                    marksObtained: 462,
                    totalMarks: 500,
                    percentage: 92.4,
                    grade: "A-1",
                    position: "1st (Midterm)",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Preparing for Board examination with exceptional focus."
                }
            ]
        },
        {
            id: "STD-2025-002",
            fullName: "Sara Fatima Sheikh",
            fatherName: "Tariq Mehmood Sheikh",
            motherName: "Farzana Tariq",
            gender: "Female",
            dob: "2011-08-19",
            bForm: "61101-3829104-2",
            photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 333 9182741",
            fatherPhone: "+92 333 4918270",
            motherPhone: "+92 334 1928374",
            email: "tariq.sheikh@hotmail.com",
            address: "Flat 12, Royal Heights, Sector E-11/2",
            city: "Islamabad",
            admissionNumber: "ADM-2022-112",
            admissionDate: "2022-08-10",
            classId: "CLS-9",
            className: "Grade 9",
            section: "A",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad Model School G-9",
            previousClass: "Grade 6",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Tariq Sheikh (Father)",
            emergencyContactNumber: "+92 333 4918270",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 162, absentDays: 3, leaveDays: 3, percentage: 96 },
            feeSummary: { totalFees: 90000, paid: 90000, pending: 0, lastPayment: "2026-10-02", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "05",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 215,
                    presentDays: 208,
                    absentDays: 4,
                    leaveDays: 3,
                    attendancePercentage: 96.7,
                    marksObtained: 950,
                    totalMarks: 1100,
                    percentage: 86.3,
                    grade: "A+",
                    position: "4th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Active in English Debating Club and inter-school speech contests."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 8",
                    section: "A",
                    rollNumber: "03",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 212,
                    presentDays: 206,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 97.1,
                    marksObtained: 980,
                    totalMarks: 1100,
                    percentage: 89.1,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very disciplined, exceptional writing skills and leadership."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 9",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Tariq Mehmood Abbasi",
                    totalDays: 168,
                    presentDays: 162,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 96.4,
                    marksObtained: 450,
                    totalMarks: 500,
                    percentage: 90.0,
                    grade: "A-1",
                    position: "2nd (Midterm)",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Head Girl nominee, superb academic consistency."
                }
            ]
        },
        {
            id: "STD-2025-003",
            fullName: "Muhammad Bilal Qureshi",
            fatherName: "Zahid Hussain Qureshi",
            motherName: "Saira Bano",
            gender: "Male",
            dob: "2010-12-04",
            bForm: "37405-1928374-1",
            photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "A+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 345 1029384",
            fatherPhone: "+92 345 9182736",
            motherPhone: "+92 345 8172635",
            email: "zahid.qureshi@yahoo.com",
            address: "Street 9, Sector I-8/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2022-098",
            admissionDate: "2022-08-12",
            classId: "CLS-9",
            className: "Grade 9",
            section: "B",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "OPF Boys College",
            previousClass: "Grade 6",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Zahid Qureshi (Father)",
            emergencyContactNumber: "+92 345 9182736",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 149, absentDays: 14, leaveDays: 5, percentage: 88 },
            feeSummary: { totalFees: 90000, paid: 60000, pending: 30000, lastPayment: "2026-09-10", dueDate: "2026-10-15", status: "Partial" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 7",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Engr. Imran Bashir",
                    totalDays: 215,
                    presentDays: 195,
                    absentDays: 15,
                    leaveDays: 5,
                    attendancePercentage: 90.6,
                    marksObtained: 890,
                    totalMarks: 1100,
                    percentage: 80.9,
                    grade: "A",
                    position: "5th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very good at sports and computer applications."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 8",
                    section: "B",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 212,
                    presentDays: 192,
                    absentDays: 14,
                    leaveDays: 6,
                    attendancePercentage: 90.5,
                    marksObtained: 915,
                    totalMarks: 1100,
                    percentage: 83.1,
                    grade: "A",
                    position: "4th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Captain of the School Cricket Team."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 9",
                    section: "B",
                    rollNumber: "01",
                    classTeacher: "Engr. Imran Bashir",
                    totalDays: 168,
                    presentDays: 149,
                    absentDays: 14,
                    leaveDays: 5,
                    attendancePercentage: 88.6,
                    marksObtained: 410,
                    totalMarks: 500,
                    percentage: 82.0,
                    grade: "A",
                    position: "3rd (Midterm)",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Needs to improve regular attendance in morning science practicals."
                }
            ]
        },
        {
            id: "STD-2025-004",
            fullName: "Ayesha Noor Malik",
            fatherName: "Malik Mansoor Akhtar",
            motherName: "Razia Sultana",
            gender: "Female",
            dob: "2011-02-14",
            bForm: "61101-4910293-2",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "AB+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 321 8291024",
            fatherPhone: "+92 321 5918273",
            motherPhone: "+92 322 4819201",
            email: "mansoor.malik@gmail.com",
            address: "House 51, Street 4, Sector G-10/2",
            city: "Islamabad",
            admissionNumber: "ADM-2023-045",
            admissionDate: "2023-08-05",
            classId: "CLS-8",
            className: "Grade 8",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beaconhouse School System",
            previousClass: "Grade 6",
            admissionType: "Transfer",
            status: "Active",
            emergencyContactName: "Malik Mansoor (Father)",
            emergencyContactNumber: "+92 321 5918273",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 165, absentDays: 1, leaveDays: 2, percentage: 98 },
            feeSummary: { totalFees: 85000, paid: 85000, pending: 0, lastPayment: "2026-10-01", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 215,
                    presentDays: 210,
                    absentDays: 2,
                    leaveDays: 3,
                    attendancePercentage: 97.6,
                    marksObtained: 998,
                    totalMarks: 1100,
                    percentage: 90.7,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Brilliant student, winner of regional science exhibition."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 212,
                    presentDays: 209,
                    absentDays: 1,
                    leaveDays: 2,
                    attendancePercentage: 98.5,
                    marksObtained: 1012,
                    totalMarks: 1100,
                    percentage: 92.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Highest aggregate in FBISE affiliated schools network."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 8",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 168,
                    presentDays: 165,
                    absentDays: 1,
                    leaveDays: 2,
                    attendancePercentage: 98.2,
                    marksObtained: 480,
                    totalMarks: 500,
                    percentage: 96.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Top performer across all subjects."
                }
            ]
        },
        {
            id: "STD-2025-005",
            fullName: "Hamza Ali Chaudhry",
            fatherName: "Chaudhry Liaquat Ali",
            motherName: "Kalsoom Bibi",
            gender: "Male",
            dob: "2011-09-28",
            bForm: "37405-5918274-1",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B-",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 302 9182741",
            fatherPhone: "+92 300 7182940",
            motherPhone: "+92 301 6192847",
            email: "liaquat.chaudhry@gmail.com",
            address: "House 18, Street 5, Sector F-11/1",
            city: "Islamabad",
            admissionNumber: "ADM-2023-078",
            admissionDate: "2023-08-10",
            classId: "CLS-8",
            className: "Grade 8",
            section: "A",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "City School Capital Campus",
            previousClass: "Grade 6",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Liaquat Ali (Father)",
            emergencyContactNumber: "+92 300 7182940",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 152, absentDays: 10, leaveDays: 6, percentage: 90 },
            feeSummary: { totalFees: 85000, paid: 50000, pending: 35000, lastPayment: "2026-08-20", dueDate: "2026-10-15", status: "Partial" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "04",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 215,
                    presentDays: 198,
                    absentDays: 11,
                    leaveDays: 6,
                    attendancePercentage: 92.0,
                    marksObtained: 865,
                    totalMarks: 1100,
                    percentage: 78.6,
                    grade: "A",
                    position: "7th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Talented in arts and athletics."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "03",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 212,
                    presentDays: 195,
                    absentDays: 10,
                    leaveDays: 7,
                    attendancePercentage: 91.9,
                    marksObtained: 895,
                    totalMarks: 1100,
                    percentage: 81.3,
                    grade: "A",
                    position: "4th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Steady improvement in science subjects."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 8",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 168,
                    presentDays: 152,
                    absentDays: 10,
                    leaveDays: 6,
                    attendancePercentage: 90.4,
                    marksObtained: 405,
                    totalMarks: 500,
                    percentage: 81.0,
                    grade: "A",
                    position: "4th",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Keep maintaining focus in mathematics."
                }
            ]
        },
        {
            id: "STD-2025-006",
            fullName: "Zainab Bibi Abbasi",
            fatherName: "Muhammad Aslam Abbasi",
            motherName: "Nazia Aslam",
            gender: "Female",
            dob: "2012-05-10",
            bForm: "37405-1829471-2",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O-",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 313 5918274",
            fatherPhone: "+92 313 9283741",
            motherPhone: "+92 312 8374619",
            email: "aslam.abbasi@gmail.com",
            address: "Main Murree Road, Bhara Kahu",
            city: "Islamabad",
            admissionNumber: "ADM-2021-032",
            admissionDate: "2021-08-20",
            classId: "CLS-7",
            className: "Grade 7",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Modern Schooling System",
            previousClass: "Grade 3",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Aslam Abbasi (Father)",
            emergencyContactNumber: "+92 313 9283741",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 161, absentDays: 4, leaveDays: 3, percentage: 95 },
            feeSummary: { totalFees: 80000, paid: 80000, pending: 0, lastPayment: "2026-10-04", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2022-23",
                    className: "Grade 4",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 210,
                    presentDays: 202,
                    absentDays: 5,
                    leaveDays: 3,
                    attendancePercentage: 96.1,
                    marksObtained: 940,
                    totalMarks: 1000,
                    percentage: 94.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very disciplined and bright student."
                },
                {
                    academicYear: "2023-24",
                    className: "Grade 5",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 215,
                    presentDays: 206,
                    absentDays: 5,
                    leaveDays: 4,
                    attendancePercentage: 95.8,
                    marksObtained: 935,
                    totalMarks: 1000,
                    percentage: 93.5,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Excellent handwriting and participation."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Qari Samina Tahir",
                    totalDays: 212,
                    presentDays: 205,
                    absentDays: 4,
                    leaveDays: 3,
                    attendancePercentage: 96.6,
                    marksObtained: 1015,
                    totalMarks: 1100,
                    percentage: 92.2,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Consistently on top of the honor roll."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Tariq Mehmood Abbasi",
                    totalDays: 168,
                    presentDays: 161,
                    absentDays: 4,
                    leaveDays: 3,
                    attendancePercentage: 95.8,
                    marksObtained: 465,
                    totalMarks: 500,
                    percentage: 93.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Remarkable dedication to studies."
                }
            ]
        },
        {
            id: "STD-2025-007",
            fullName: "Omer Farooq Janjua",
            fatherName: "Farooq Ahmed Janjua",
            motherName: "Salma Janjua",
            gender: "Male",
            dob: "2012-07-22",
            bForm: "37405-6182947-1",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "A-",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 345 9283741",
            fatherPhone: "+92 300 8192840",
            motherPhone: "+92 301 7182930",
            email: "farooq.janjua@yahoo.com",
            address: "Street 14, Sector G-11/3, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2022-044",
            admissionDate: "2022-08-15",
            classId: "CLS-7",
            className: "Grade 7",
            section: "A",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad Science School",
            previousClass: "Grade 4",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Farooq Janjua (Father)",
            emergencyContactNumber: "+92 300 8192840",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 154, absentDays: 8, leaveDays: 6, percentage: 91 },
            feeSummary: { totalFees: 80000, paid: 40000, pending: 40000, lastPayment: "2026-08-15", dueDate: "2026-10-15", status: "Partial" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 5",
                    section: "A",
                    rollNumber: "03",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 215,
                    presentDays: 200,
                    absentDays: 10,
                    leaveDays: 5,
                    attendancePercentage: 93.0,
                    marksObtained: 870,
                    totalMarks: 1000,
                    percentage: 87.0,
                    grade: "A+",
                    position: "3rd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Shows deep interest in history and geography."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Qari Samina Tahir",
                    totalDays: 212,
                    presentDays: 198,
                    absentDays: 8,
                    leaveDays: 6,
                    attendancePercentage: 93.3,
                    marksObtained: 940,
                    totalMarks: 1100,
                    percentage: 85.4,
                    grade: "A+",
                    position: "3rd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very active in football and sports events."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 7",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Tariq Mehmood Abbasi",
                    totalDays: 168,
                    presentDays: 154,
                    absentDays: 8,
                    leaveDays: 6,
                    attendancePercentage: 91.6,
                    marksObtained: 420,
                    totalMarks: 500,
                    percentage: 84.0,
                    grade: "A",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Hardworking and cooperative."
                }
            ]
        },
        {
            id: "STD-2025-008",
            fullName: "Fatima Zahra Hashmi",
            fatherName: "Syed Nadeem Hashmi",
            motherName: "Bushra Nadeem",
            gender: "Female",
            dob: "2013-03-15",
            bForm: "61101-7192840-2",
            photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 300 1928471",
            fatherPhone: "+92 300 9182746",
            motherPhone: "+92 301 9283746",
            email: "nadeem.hashmi@gmail.com",
            address: "House 72, Sector G-13/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2023-019",
            admissionDate: "2023-08-01",
            classId: "CLS-6",
            className: "Grade 6",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Roots Millennium",
            previousClass: "Grade 4",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Syed Nadeem (Father)",
            emergencyContactNumber: "+92 300 9182746",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 160, absentDays: 4, leaveDays: 4, percentage: 95 },
            feeSummary: { totalFees: 75000, paid: 75000, pending: 0, lastPayment: "2026-10-06", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 4",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 215,
                    presentDays: 209,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 97.2,
                    marksObtained: 960,
                    totalMarks: 1000,
                    percentage: 96.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Top in English and Mathematics."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 5",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 212,
                    presentDays: 204,
                    absentDays: 5,
                    leaveDays: 3,
                    attendancePercentage: 96.2,
                    marksObtained: 955,
                    totalMarks: 1000,
                    percentage: 95.5,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Elected class monitor for excellent leadership."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Kamran Akmal Bhatti",
                    totalDays: 168,
                    presentDays: 160,
                    absentDays: 4,
                    leaveDays: 4,
                    attendancePercentage: 95.2,
                    marksObtained: 472,
                    totalMarks: 500,
                    percentage: 94.4,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "High aptitude in languages and sciences."
                }
            ]
        },
        {
            id: "STD-2025-009",
            fullName: "Usman Tariq Alvi",
            fatherName: "Tariq Mahmood Alvi",
            motherName: "Tahira Tariq",
            gender: "Male",
            dob: "2013-10-08",
            bForm: "37405-9281740-1",
            photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 321 9182740",
            fatherPhone: "+92 321 8291047",
            motherPhone: "+92 322 7182940",
            email: "tariq.alvi@outlook.com",
            address: "Street 22, Sector I-9/1, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2023-091",
            admissionDate: "2023-08-14",
            classId: "CLS-6",
            className: "Grade 6",
            section: "A",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad College for Boys G-6",
            previousClass: "Grade 4",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Tariq Alvi (Father)",
            emergencyContactNumber: "+92 321 8291047",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 146, absentDays: 15, leaveDays: 7, percentage: 86 },
            feeSummary: { totalFees: 75000, paid: 75000, pending: 0, lastPayment: "2026-10-03", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 5",
                    section: "A",
                    rollNumber: "04",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 212,
                    presentDays: 185,
                    absentDays: 18,
                    leaveDays: 9,
                    attendancePercentage: 87.2,
                    marksObtained: 810,
                    totalMarks: 1000,
                    percentage: 81.0,
                    grade: "A",
                    position: "6th",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Good potential, needs extra practice in Urdu writing."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 6",
                    section: "A",
                    rollNumber: "02",
                    classTeacher: "Kamran Akmal Bhatti",
                    totalDays: 168,
                    presentDays: 146,
                    absentDays: 15,
                    leaveDays: 7,
                    attendancePercentage: 86.9,
                    marksObtained: 395,
                    totalMarks: 500,
                    percentage: 79.0,
                    grade: "B+",
                    position: "5th",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Attendance needs improvement for second term."
                }
            ]
        },
        {
            id: "STD-2025-010",
            fullName: "Hania Amir Butt",
            fatherName: "Amir Sohail Butt",
            motherName: "Farah Amir",
            gender: "Female",
            dob: "2014-01-20",
            bForm: "61101-1928471-2",
            photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "AB-",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 333 1928374",
            fatherPhone: "+92 333 8192039",
            motherPhone: "+92 334 9182730",
            email: "amir.butt@gmail.com",
            address: "House 9, Street 8, Sector F-7/2, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2022-011",
            admissionDate: "2022-08-01",
            classId: "CLS-5",
            className: "Grade 5",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Froebel's International",
            previousClass: "Grade 2",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Amir Butt (Father)",
            emergencyContactNumber: "+92 333 8192039",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 164, absentDays: 2, leaveDays: 2, percentage: 97 },
            feeSummary: { totalFees: 70000, paid: 70000, pending: 0, lastPayment: "2026-10-02", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 3",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 215,
                    presentDays: 210,
                    absentDays: 2,
                    leaveDays: 3,
                    attendancePercentage: 97.6,
                    marksObtained: 975,
                    totalMarks: 1000,
                    percentage: 97.5,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Outstanding in creative writing and art."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 4",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 212,
                    presentDays: 208,
                    absentDays: 2,
                    leaveDays: 2,
                    attendancePercentage: 98.1,
                    marksObtained: 980,
                    totalMarks: 1000,
                    percentage: 98.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Model student of primary section."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 5",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 168,
                    presentDays: 164,
                    absentDays: 2,
                    leaveDays: 2,
                    attendancePercentage: 97.6,
                    marksObtained: 485,
                    totalMarks: 500,
                    percentage: 97.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Superb confidence and presentation skills."
                }
            ]
        },
        {
            id: "STD-2025-011",
            fullName: "Danyal Murtaza Syed",
            fatherName: "Syed Murtaza Shah",
            motherName: "Zubaida Murtaza",
            gender: "Male",
            dob: "2014-06-11",
            bForm: "61101-8291047-1",
            photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 305 9182740",
            fatherPhone: "+92 300 5192840",
            motherPhone: "+92 301 4918274",
            email: "murtaza.shah@gmail.com",
            address: "House 120, Street 19, Sector G-9/2, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2023-102",
            admissionDate: "2023-08-10",
            classId: "CLS-5",
            className: "Grade 5",
            section: "B",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Army Public School Rawalpindi",
            previousClass: "Grade 3",
            admissionType: "Transfer",
            status: "Active",
            emergencyContactName: "Syed Murtaza (Father)",
            emergencyContactNumber: "+92 300 5192840",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 150, absentDays: 12, leaveDays: 6, percentage: 89 },
            feeSummary: { totalFees: 70000, paid: 35000, pending: 35000, lastPayment: "2026-08-10", dueDate: "2026-10-15", status: "Partial" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 4",
                    section: "B",
                    rollNumber: "03",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 212,
                    presentDays: 194,
                    absentDays: 12,
                    leaveDays: 6,
                    attendancePercentage: 91.5,
                    marksObtained: 840,
                    totalMarks: 1000,
                    percentage: 84.0,
                    grade: "A",
                    position: "3rd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Great teamwork and athletic capabilities."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 5",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Dr. Abdul Rehman Niazi",
                    totalDays: 168,
                    presentDays: 150,
                    absentDays: 12,
                    leaveDays: 6,
                    attendancePercentage: 89.2,
                    marksObtained: 415,
                    totalMarks: 500,
                    percentage: 83.0,
                    grade: "A",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Active in school sports and chess competitions."
                }
            ]
        },
        {
            id: "STD-2025-012",
            fullName: "Zoya Tariq Gondal",
            fatherName: "Tariq Mahmood Gondal",
            motherName: "Sobia Tariq",
            gender: "Female",
            dob: "2015-03-24",
            bForm: "37405-2948192-2",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "A+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 345 1928470",
            fatherPhone: "+92 345 8192048",
            motherPhone: "+92 346 7182940",
            email: "tariq.gondal@yahoo.com",
            address: "House 31, Street 7, Sector F-10/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2022-077",
            admissionDate: "2022-08-01",
            classId: "CLS-4",
            className: "Grade 4",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beaconhouse Early Years",
            previousClass: "Grade 1",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Tariq Gondal (Father)",
            emergencyContactNumber: "+92 345 8192048",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 162, absentDays: 3, leaveDays: 3, percentage: 96 },
            feeSummary: { totalFees: 65000, paid: 65000, pending: 0, lastPayment: "2026-10-05", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2023-24",
                    className: "Grade 2",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Nida Dar Chaudhry",
                    totalDays: 215,
                    presentDays: 209,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 97.2,
                    marksObtained: 980,
                    totalMarks: 1000,
                    percentage: 98.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very eager learner, remarkable memory."
                },
                {
                    academicYear: "2024-25",
                    className: "Grade 3",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 212,
                    presentDays: 205,
                    absentDays: 4,
                    leaveDays: 3,
                    attendancePercentage: 96.6,
                    marksObtained: 975,
                    totalMarks: 1000,
                    percentage: 97.5,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Excellent conduct and peer collaboration."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 4",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 168,
                    presentDays: 162,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 96.4,
                    marksObtained: 480,
                    totalMarks: 500,
                    percentage: 96.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Star pupil of Grade 4."
                }
            ]
        },
        {
            id: "STD-2025-013",
            fullName: "Saad Abdullah Malik",
            fatherName: "Malik Abdullah Jan",
            motherName: "Amna Abdullah",
            gender: "Male",
            dob: "2015-08-17",
            bForm: "61101-3928174-1",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 312 9182740",
            fatherPhone: "+92 312 8192039",
            motherPhone: "+92 313 7182940",
            email: "abdullah.malik@gmail.com",
            address: "House 45, Street 10, Sector I-10/2, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2023-058",
            admissionDate: "2023-08-05",
            classId: "CLS-4",
            className: "Grade 4",
            section: "B",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad Model School",
            previousClass: "Grade 2",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Abdullah Malik (Father)",
            emergencyContactNumber: "+92 312 8192039",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 153, absentDays: 9, leaveDays: 6, percentage: 91 },
            feeSummary: { totalFees: 65000, paid: 65000, pending: 0, lastPayment: "2026-10-01", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 3",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 212,
                    presentDays: 196,
                    absentDays: 10,
                    leaveDays: 6,
                    attendancePercentage: 92.4,
                    marksObtained: 860,
                    totalMarks: 1000,
                    percentage: 86.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very observant and active in group activities."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 4",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 168,
                    presentDays: 153,
                    absentDays: 9,
                    leaveDays: 6,
                    attendancePercentage: 91.0,
                    marksObtained: 430,
                    totalMarks: 500,
                    percentage: 86.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Keeps improving every term."
                }
            ]
        },
        {
            id: "STD-2025-014",
            fullName: "Maryam Shahzadi",
            fatherName: "Shahzad Akhtar",
            motherName: "Shagufta Shahzad",
            gender: "Female",
            dob: "2016-04-10",
            bForm: "61101-7291048-2",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 333 9182746",
            fatherPhone: "+92 333 7182940",
            motherPhone: "+92 334 8192039",
            email: "shahzad.akhtar@yahoo.com",
            address: "House 102, Street 18, Sector G-11/1, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2023-014",
            admissionDate: "2023-08-01",
            classId: "CLS-3",
            className: "Grade 3",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beaconhouse School System",
            previousClass: "Grade 1",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Shahzad Akhtar (Father)",
            emergencyContactNumber: "+92 333 7182940",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 163, absentDays: 2, leaveDays: 3, percentage: 97 },
            feeSummary: { totalFees: 60000, paid: 60000, pending: 0, lastPayment: "2026-10-04", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 2",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Nida Dar Chaudhry",
                    totalDays: 212,
                    presentDays: 206,
                    absentDays: 3,
                    leaveDays: 3,
                    attendancePercentage: 97.1,
                    marksObtained: 970,
                    totalMarks: 1000,
                    percentage: 97.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very bright, reads well above grade level."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 3",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 168,
                    presentDays: 163,
                    absentDays: 2,
                    leaveDays: 3,
                    attendancePercentage: 97.0,
                    marksObtained: 488,
                    totalMarks: 500,
                    percentage: 97.6,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Top performer in primary section."
                }
            ]
        },
        {
            id: "STD-2025-015",
            fullName: "Mustafa Kamal Pasha",
            fatherName: "Kamal Pasha Durrani",
            motherName: "Nilofar Pasha",
            gender: "Male",
            dob: "2016-11-02",
            bForm: "37405-8192039-1",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "AB+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 300 8192849",
            fatherPhone: "+92 300 7182949",
            motherPhone: "+92 301 6182940",
            email: "kamal.pasha@gmail.com",
            address: "House 19-B, Sector F-6/3, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2024-022",
            admissionDate: "2024-08-10",
            classId: "CLS-3",
            className: "Grade 3",
            section: "B",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad Grammar School",
            previousClass: "Grade 2",
            admissionType: "Transfer",
            status: "Active",
            emergencyContactName: "Kamal Pasha (Father)",
            emergencyContactNumber: "+92 300 7182949",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 156, absentDays: 7, leaveDays: 5, percentage: 92 },
            feeSummary: { totalFees: 60000, paid: 60000, pending: 0, lastPayment: "2026-10-03", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 2",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Nida Dar Chaudhry",
                    totalDays: 212,
                    presentDays: 198,
                    absentDays: 8,
                    leaveDays: 6,
                    attendancePercentage: 93.3,
                    marksObtained: 890,
                    totalMarks: 1000,
                    percentage: 89.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very creative in recitation and mental math."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 3",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 168,
                    presentDays: 156,
                    absentDays: 7,
                    leaveDays: 5,
                    attendancePercentage: 92.8,
                    marksObtained: 445,
                    totalMarks: 500,
                    percentage: 89.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Keeps high academic standing."
                }
            ]
        },
        {
            id: "STD-2025-016",
            fullName: "Rameen Faisal Tarar",
            fatherName: "Faisal Mahmood Tarar",
            motherName: "Rubina Faisal",
            gender: "Female",
            dob: "2017-05-19",
            bForm: "61101-9182740-2",
            photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 301 9283741",
            fatherPhone: "+92 301 8192038",
            motherPhone: "+92 302 7182940",
            email: "faisal.tarar@gmail.com",
            address: "House 88, Street 15, Sector G-8/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2024-055",
            admissionDate: "2024-08-05",
            classId: "CLS-2",
            className: "Grade 2",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beacon Valley Pre-School",
            previousClass: "Grade 1",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Faisal Tarar (Father)",
            emergencyContactNumber: "+92 301 8192038",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 160, absentDays: 4, leaveDays: 4, percentage: 95 },
            feeSummary: { totalFees: 55000, paid: 55000, pending: 0, lastPayment: "2026-10-02", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 1",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 212,
                    presentDays: 204,
                    absentDays: 5,
                    leaveDays: 3,
                    attendancePercentage: 96.2,
                    marksObtained: 970,
                    totalMarks: 1000,
                    percentage: 97.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Very active in reading and arts."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 2",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Nida Dar Chaudhry",
                    totalDays: 168,
                    presentDays: 160,
                    absentDays: 4,
                    leaveDays: 4,
                    attendancePercentage: 95.2,
                    marksObtained: 478,
                    totalMarks: 500,
                    percentage: 95.6,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Remarkable student, cheerful and polite."
                }
            ]
        },
        {
            id: "STD-2025-017",
            fullName: "Zain Ul Abideen",
            fatherName: "Zulfiqar Ali",
            motherName: "Nasreen Zulfiqar",
            gender: "Male",
            dob: "2017-09-30",
            bForm: "37405-1928471-1",
            photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "A+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 345 8192049",
            fatherPhone: "+92 345 7182940",
            motherPhone: "+92 346 6182940",
            email: "zulfiqar.ali@gmail.com",
            address: "House 67, Street 11, Sector I-8/1, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2024-089",
            admissionDate: "2024-08-12",
            classId: "CLS-2",
            className: "Grade 2",
            section: "B",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Islamabad Learning Academy",
            previousClass: "Grade 1",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Zulfiqar Ali (Father)",
            emergencyContactNumber: "+92 345 7182940",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 154, absentDays: 8, leaveDays: 6, percentage: 91 },
            feeSummary: { totalFees: 55000, paid: 55000, pending: 0, lastPayment: "2026-10-06", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2024-25",
                    className: "Grade 1",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 212,
                    presentDays: 196,
                    absentDays: 10,
                    leaveDays: 6,
                    attendancePercentage: 92.4,
                    marksObtained: 885,
                    totalMarks: 1000,
                    percentage: 88.5,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Promoted",
                    remarks: "Enjoys general knowledge and physical exercise."
                },
                {
                    academicYear: "2025-26",
                    className: "Grade 2",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Nida Dar Chaudhry",
                    totalDays: 168,
                    presentDays: 154,
                    absentDays: 8,
                    leaveDays: 6,
                    attendancePercentage: 91.6,
                    marksObtained: 440,
                    totalMarks: 500,
                    percentage: 88.0,
                    grade: "A+",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Very disciplined in class."
                }
            ]
        },
        {
            id: "STD-2025-018",
            fullName: "Khadija Tul Kubra",
            fatherName: "Hafiz Abdul Quddus",
            motherName: "Saeeda Bano",
            gender: "Female",
            dob: "2018-02-14",
            bForm: "61101-4918274-2",
            photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 311 9182740",
            fatherPhone: "+92 311 8192039",
            motherPhone: "+92 312 7182940",
            email: "abdul.quddus@yahoo.com",
            address: "House 23, Street 3, Sector G-7/3, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2025-001",
            admissionDate: "2025-08-01",
            classId: "CLS-1",
            className: "Grade 1",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beacon Valley Prep",
            previousClass: "Prep",
            admissionType: "Promotion",
            status: "Active",
            emergencyContactName: "Hafiz Abdul Quddus (Father)",
            emergencyContactNumber: "+92 311 8192039",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 161, absentDays: 4, leaveDays: 3, percentage: 95 },
            feeSummary: { totalFees: 50000, paid: 50000, pending: 0, lastPayment: "2026-10-04", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2025-26",
                    className: "Grade 1",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 168,
                    presentDays: 161,
                    absentDays: 4,
                    leaveDays: 3,
                    attendancePercentage: 95.8,
                    marksObtained: 490,
                    totalMarks: 500,
                    percentage: 98.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Outstanding pronunciation and handwriting."
                }
            ]
        },
        {
            id: "STD-2025-019",
            fullName: "Ali Haider Naqvi",
            fatherName: "Syed Haider Abbas",
            motherName: "Syeda Kaneez Fatima",
            gender: "Male",
            dob: "2018-07-25",
            bForm: "37405-6182930-1",
            photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 300 4819203",
            fatherPhone: "+92 300 3819204",
            motherPhone: "+92 301 2819205",
            email: "haider.naqvi@gmail.com",
            address: "House 15-C, Street 8, Sector F-11/3, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2025-012",
            admissionDate: "2025-08-05",
            classId: "CLS-1",
            className: "Grade 1",
            section: "B",
            rollNumber: "02",
            academicYear: "2025-26",
            previousSchool: "Supernova School",
            previousClass: "Prep",
            admissionType: "Regular",
            status: "Active",
            emergencyContactName: "Syed Haider (Father)",
            emergencyContactNumber: "+92 300 3819204",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 155, absentDays: 8, leaveDays: 5, percentage: 92 },
            feeSummary: { totalFees: 50000, paid: 50000, pending: 0, lastPayment: "2026-10-02", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2025-26",
                    className: "Grade 1",
                    section: "B",
                    rollNumber: "02",
                    classTeacher: "Sadia Rafiq",
                    totalDays: 168,
                    presentDays: 155,
                    absentDays: 8,
                    leaveDays: 5,
                    attendancePercentage: 92.2,
                    marksObtained: 460,
                    totalMarks: 500,
                    percentage: 92.0,
                    grade: "A-1",
                    position: "2nd",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Very sharp mind, loves building blocks."
                }
            ]
        },
        {
            id: "STD-2025-020",
            fullName: "Aima Noor Lodhi",
            fatherName: "Tariq Lodhi",
            motherName: "Saima Lodhi",
            gender: "Female",
            dob: "2019-01-18",
            bForm: "61101-8291040-2",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "O+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 321 4918270",
            fatherPhone: "+92 321 3819201",
            motherPhone: "+92 322 2819203",
            email: "tariq.lodhi@gmail.com",
            address: "House 55, Street 21, Sector G-10/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2025-033",
            admissionDate: "2025-08-10",
            classId: "CLS-PREP",
            className: "Prep",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "Beacon Valley Nursery",
            previousClass: "Nursery",
            admissionType: "Promotion",
            status: "Active",
            emergencyContactName: "Tariq Lodhi (Father)",
            emergencyContactNumber: "+92 321 3819201",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 159, absentDays: 5, leaveDays: 4, percentage: 94 },
            feeSummary: { totalFees: 45000, paid: 45000, pending: 0, lastPayment: "2026-10-01", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2025-26",
                    className: "Prep",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Farah Naz Hashmi",
                    totalDays: 168,
                    presentDays: 159,
                    absentDays: 5,
                    leaveDays: 4,
                    attendancePercentage: 94.6,
                    marksObtained: 475,
                    totalMarks: 500,
                    percentage: 95.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Very expressive and joyful."
                }
            ]
        },
        {
            id: "STD-2025-021",
            fullName: "Zaviyar Shahzad Khan",
            fatherName: "Shahzad Aslam Khan",
            motherName: "Amber Shahzad",
            gender: "Male",
            dob: "2019-09-12",
            bForm: "37405-4918274-1",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "B+",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 333 4819201",
            fatherPhone: "+92 333 3819202",
            motherPhone: "+92 334 2819203",
            email: "shahzad.khan@gmail.com",
            address: "House 77, Street 14, Sector E-11/4, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2025-048",
            admissionDate: "2025-08-15",
            classId: "CLS-NUR",
            className: "Nursery",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "None",
            previousClass: "Play Group",
            admissionType: "New",
            status: "Active",
            emergencyContactName: "Shahzad Khan (Father)",
            emergencyContactNumber: "+92 333 3819202",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 158, absentDays: 6, leaveDays: 4, percentage: 94 },
            feeSummary: { totalFees: 40000, paid: 40000, pending: 0, lastPayment: "2026-10-02", dueDate: "2026-10-15", status: "Paid" },
            academicHistory: [
                {
                    academicYear: "2025-26",
                    className: "Nursery",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Qari Samina Tahir",
                    totalDays: 168,
                    presentDays: 158,
                    absentDays: 6,
                    leaveDays: 4,
                    attendancePercentage: 94.0,
                    marksObtained: 470,
                    totalMarks: 500,
                    percentage: 94.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Very enthusiastic in phonics."
                }
            ]
        },
        {
            id: "STD-2025-022",
            fullName: "Manha Rehan Siddiqui",
            fatherName: "Rehan Ahmed Siddiqui",
            motherName: "Farheen Rehan",
            gender: "Female",
            dob: "2020-03-05",
            bForm: "61101-1029384-2",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            bloodGroup: "A-",
            religion: "Islam",
            nationality: "Pakistani",
            studentPhone: "+92 345 3819201",
            fatherPhone: "+92 345 2819202",
            motherPhone: "+92 346 1819203",
            email: "rehan.siddiqui@gmail.com",
            address: "House 12, Street 6, Sector F-8/1, Islamabad",
            city: "Islamabad",
            admissionNumber: "ADM-2025-061",
            admissionDate: "2025-08-20",
            classId: "CLS-PG",
            className: "Play Group",
            section: "A",
            rollNumber: "01",
            academicYear: "2025-26",
            previousSchool: "None",
            previousClass: "None",
            admissionType: "New",
            status: "Active",
            emergencyContactName: "Rehan Siddiqui (Father)",
            emergencyContactNumber: "+92 345 2819202",
            relationship: "Father",
            attendanceSummary: { totalDays: 168, presentDays: 152, absentDays: 10, leaveDays: 6, percentage: 90 },
            feeSummary: { totalFees: 40000, paid: 20000, pending: 20000, lastPayment: "2026-08-25", dueDate: "2026-10-15", status: "Partial" },
            academicHistory: [
                {
                    academicYear: "2025-26",
                    className: "Play Group",
                    section: "A",
                    rollNumber: "01",
                    classTeacher: "Engr. Imran Bashir",
                    totalDays: 168,
                    presentDays: 152,
                    absentDays: 10,
                    leaveDays: 6,
                    attendancePercentage: 90.4,
                    marksObtained: 460,
                    totalMarks: 500,
                    percentage: 92.0,
                    grade: "A-1",
                    position: "1st",
                    result: "Pass",
                    promotionStatus: "Current Year",
                    remarks: "Very cheerful and social child."
                }
            ]
        }
    ];

    // Student Attendance Records for Today
    const todayStr = "2026-10-16";
    const defaultStudentAttendance = [
        { id: "SA-01", studentId: "STD-2025-001", studentName: "Ahmed Khan Niazi", classId: "CLS-9", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-02", studentId: "STD-2025-002", studentName: "Sara Fatima Sheikh", classId: "CLS-9", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-03", studentId: "STD-2025-003", studentName: "Muhammad Bilal Qureshi", classId: "CLS-9", section: "B", date: todayStr, status: "Absent", remarks: "Sick leave awaited" },
        { id: "SA-04", studentId: "STD-2025-004", studentName: "Ayesha Noor Malik", classId: "CLS-8", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-05", studentId: "STD-2025-005", studentName: "Hamza Ali Chaudhry", classId: "CLS-8", section: "A", date: todayStr, status: "Leave", remarks: "Family wedding" },
        { id: "SA-06", studentId: "STD-2025-006", studentName: "Zainab Bibi Abbasi", classId: "CLS-7", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-07", studentId: "STD-2025-007", studentName: "Omer Farooq Janjua", classId: "CLS-7", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-08", studentId: "STD-2025-008", studentName: "Fatima Zahra Hashmi", classId: "CLS-6", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-09", studentId: "STD-2025-009", studentName: "Usman Tariq Alvi", classId: "CLS-6", section: "A", date: todayStr, status: "Absent", remarks: "Uninformed" },
        { id: "SA-10", studentId: "STD-2025-010", studentName: "Hania Amir Butt", classId: "CLS-5", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-11", studentId: "STD-2025-011", studentName: "Danyal Murtaza Syed", classId: "CLS-5", section: "B", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-12", studentId: "STD-2025-012", studentName: "Zoya Tariq Gondal", classId: "CLS-4", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-13", studentId: "STD-2025-013", studentName: "Saad Abdullah Malik", classId: "CLS-4", section: "B", date: todayStr, status: "Leave", remarks: "Dental appointment" },
        { id: "SA-14", studentId: "STD-2025-014", studentName: "Maryam Shahzadi", classId: "CLS-3", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-15", studentId: "STD-2025-015", studentName: "Mustafa Kamal Pasha", classId: "CLS-3", section: "B", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-16", studentId: "STD-2025-016", studentName: "Rameen Faisal Tarar", classId: "CLS-2", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-17", studentId: "STD-2025-017", studentName: "Zain Ul Abideen", classId: "CLS-2", section: "B", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-18", studentId: "STD-2025-018", studentName: "Khadija Tul Kubra", classId: "CLS-1", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-19", studentId: "STD-2025-019", studentName: "Ali Haider Naqvi", classId: "CLS-1", section: "B", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-20", studentId: "STD-2025-020", studentName: "Aima Noor Lodhi", classId: "CLS-PREP", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-21", studentId: "STD-2025-021", studentName: "Zaviyar Shahzad Khan", classId: "CLS-NUR", section: "A", date: todayStr, status: "Present", remarks: "On time" },
        { id: "SA-22", studentId: "STD-2025-022", studentName: "Manha Rehan Siddiqui", classId: "CLS-PG", section: "A", date: todayStr, status: "Present", remarks: "On time" }
    ];

    // Teacher Attendance Records for Today
    const defaultTeacherAttendance = [
        { id: "TA-01", teacherId: "TCH-001", teacherName: "Tariq Mehmood Abbasi", date: todayStr, checkIn: "07:45 AM", checkOut: "02:15 PM", status: "Present", lateArrival: false },
        { id: "TA-02", teacherId: "TCH-002", teacherName: "Sadia Rafiq", date: todayStr, checkIn: "07:50 AM", checkOut: "02:15 PM", status: "Present", lateArrival: false },
        { id: "TA-03", teacherId: "TCH-003", teacherName: "Kamran Akmal Bhatti", date: todayStr, checkIn: "08:15 AM", checkOut: "02:15 PM", status: "Present", lateArrival: true },
        { id: "TA-04", teacherId: "TCH-004", teacherName: "Nida Dar Chaudhry", date: todayStr, checkIn: "07:55 AM", checkOut: "02:15 PM", status: "Present", lateArrival: false },
        { id: "TA-05", teacherId: "TCH-005", teacherName: "Dr. Abdul Rehman Niazi", date: todayStr, checkIn: "-", checkOut: "-", status: "Leave", lateArrival: false },
        { id: "TA-06", teacherId: "TCH-006", teacherName: "Farah Naz Hashmi", date: todayStr, checkIn: "07:40 AM", checkOut: "02:15 PM", status: "Present", lateArrival: false },
        { id: "TA-07", teacherId: "TCH-007", teacherName: "Engr. Imran Bashir", date: todayStr, checkIn: "07:48 AM", checkOut: "02:15 PM", status: "Present", lateArrival: false },
        { id: "TA-08", teacherId: "TCH-008", teacherName: "Qari Muhammad Samina Tahir", date: todayStr, checkIn: "-", checkOut: "-", status: "Absent", lateArrival: false }
    ];

    // Student Leaves
    const defaultStudentLeaves = [
        { id: "SLV-01", studentId: "STD-2025-005", studentName: "Hamza Ali Chaudhry", className: "Grade 8", section: "A", leaveFrom: "2026-10-16", leaveTo: "2026-10-18", days: 3, reason: "Attending elder sister's wedding in Lahore", appliedDate: "2026-10-14", status: "Approved" },
        { id: "SLV-02", studentId: "STD-2025-013", studentName: "Saad Abdullah Malik", className: "Grade 4", section: "B", leaveFrom: "2026-10-16", leaveTo: "2026-10-16", days: 1, reason: "Dental root-canal checkup", appliedDate: "2026-10-15", status: "Approved" },
        { id: "SLV-03", studentId: "STD-2025-003", studentName: "Muhammad Bilal Qureshi", className: "Grade 9", section: "B", leaveFrom: "2026-10-17", leaveTo: "2026-10-19", days: 3, reason: "Severe viral fever and throat infection", appliedDate: "2026-10-16", status: "Pending" },
        { id: "SLV-04", studentId: "STD-2025-009", studentName: "Usman Tariq Alvi", className: "Grade 6", section: "A", leaveFrom: "2026-10-20", leaveTo: "2026-10-22", days: 3, reason: "Travelling to hometown for urgent family matter", appliedDate: "2026-10-15", status: "Pending" },
        { id: "SLV-05", studentId: "STD-2025-001", studentName: "Ahmed Khan Niazi", className: "Grade 9", section: "A", leaveFrom: "2026-09-12", leaveTo: "2026-09-13", days: 2, reason: "Represented school in Regional Science Olympiad", appliedDate: "2026-09-08", status: "Approved" }
    ];

    // Teacher Leaves
    const defaultTeacherLeaves = [
        { id: "TLV-01", teacherId: "TCH-005", teacherName: "Dr. Abdul Rehman Niazi", leaveFrom: "2026-10-16", leaveTo: "2026-10-17", days: 2, reason: "Attending National Chemistry Symposium as guest keynote", appliedDate: "2026-10-12", status: "Approved", approvedBy: "Principal Dr. Tariq Mansoor" },
        { id: "TLV-02", teacherId: "TCH-002", teacherName: "Sadia Rafiq", leaveFrom: "2026-10-22", leaveTo: "2026-10-23", days: 2, reason: "Urgent personal family engagement", appliedDate: "2026-10-15", status: "Pending", approvedBy: "Pending" },
        { id: "TLV-03", teacherId: "TCH-003", teacherName: "Kamran Akmal Bhatti", leaveFrom: "2026-09-05", leaveTo: "2026-09-06", days: 2, reason: "Medical leave for back pain therapy", appliedDate: "2026-09-02", status: "Approved", approvedBy: "Principal Dr. Tariq Mansoor" },
        { id: "TLV-04", teacherId: "TCH-007", teacherName: "Engr. Imran Bashir", leaveFrom: "2026-09-18", leaveTo: "2026-09-19", days: 2, reason: "Personal leave without prior notice", appliedDate: "2026-09-17", status: "Rejected", approvedBy: "Principal Dr. Tariq Mansoor" }
    ];

    // Teacher Payroll (Formula: Net = Basic + Allowances + Bonus - Deductions)
    const defaultPayroll = [
        { id: "PAY-2026-10-01", teacherId: "TCH-001", teacherName: "Tariq Mehmood Abbasi", basicSalary: 85000, allowances: 15000, bonus: 5000, deductions: 2500, netSalary: 102500, paymentMonth: "October 2026", paymentDate: "2026-10-01", paymentStatus: "Paid" },
        { id: "PAY-2026-10-02", teacherId: "TCH-002", teacherName: "Sadia Rafiq", basicSalary: 78000, allowances: 12000, bonus: 3000, deductions: 2000, netSalary: 91000, paymentMonth: "October 2026", paymentDate: "2026-10-01", paymentStatus: "Paid" },
        { id: "PAY-2026-10-03", teacherId: "TCH-003", teacherName: "Kamran Akmal Bhatti", basicSalary: 92000, allowances: 18000, bonus: 6000, deductions: 3000, netSalary: 113000, paymentMonth: "October 2026", paymentDate: "2026-10-01", paymentStatus: "Paid" },
        { id: "PAY-2026-10-04", teacherId: "TCH-004", teacherName: "Nida Dar Chaudhry", basicSalary: 74000, allowances: 11000, bonus: 2500, deductions: 1500, netSalary: 86000, paymentMonth: "October 2026", paymentDate: "2026-10-01", paymentStatus: "Paid" },
        { id: "PAY-2026-10-05", teacherId: "TCH-005", teacherName: "Dr. Abdul Rehman Niazi", basicSalary: 105000, allowances: 22000, bonus: 8000, deductions: 3500, netSalary: 131500, paymentMonth: "October 2026", paymentDate: "2026-10-02", paymentStatus: "Paid" },
        { id: "PAY-2026-10-06", teacherId: "TCH-006", teacherName: "Farah Naz Hashmi", basicSalary: 70000, allowances: 10000, bonus: 2000, deductions: 2000, netSalary: 80000, paymentMonth: "October 2026", paymentDate: "2026-10-02", paymentStatus: "Paid" },
        { id: "PAY-2026-10-07", teacherId: "TCH-007", teacherName: "Engr. Imran Bashir", basicSalary: 88000, allowances: 14000, bonus: 4000, deductions: 2500, netSalary: 103500, paymentMonth: "October 2026", paymentDate: "2026-10-05", paymentStatus: "Paid" },
        { id: "PAY-2026-10-08", teacherId: "TCH-008", teacherName: "Qari Muhammad Samina Tahir", basicSalary: 72000, allowances: 10000, bonus: 0, deductions: 1500, netSalary: 80500, paymentMonth: "October 2026", paymentDate: "-", paymentStatus: "Pending" }
    ];

    // Fees Records
    const defaultFees = [
        { id: "FEE-2026-001", studentId: "STD-2025-001", studentName: "Ahmed Khan Niazi", className: "Grade 9", section: "A", feeMonth: "October 2026", tuitionFee: 15000, examFee: 2000, labFee: 1000, otherFee: 0, totalFee: 18000, paid: 18000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-05", paymentMethod: "Online Bank Transfer", status: "Paid" },
        { id: "FEE-2026-002", studentId: "STD-2025-002", studentName: "Sara Fatima Sheikh", className: "Grade 9", section: "A", feeMonth: "October 2026", tuitionFee: 15000, examFee: 2000, labFee: 1000, otherFee: 0, totalFee: 18000, paid: 18000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-02", paymentMethod: "Cash", status: "Paid" },
        { id: "FEE-2026-003", studentId: "STD-2025-003", studentName: "Muhammad Bilal Qureshi", className: "Grade 9", section: "B", feeMonth: "October 2026", tuitionFee: 15000, examFee: 2000, labFee: 1000, otherFee: 0, totalFee: 18000, paid: 10000, pending: 8000, dueDate: "2026-10-15", paymentDate: "2026-10-10", paymentMethod: "Cheque", status: "Partial" },
        { id: "FEE-2026-004", studentId: "STD-2025-004", studentName: "Ayesha Noor Malik", className: "Grade 8", section: "A", feeMonth: "October 2026", tuitionFee: 14000, examFee: 1500, labFee: 1000, otherFee: 0, totalFee: 16500, paid: 16500, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-01", paymentMethod: "Online Bank Transfer", status: "Paid" },
        { id: "FEE-2026-005", studentId: "STD-2025-005", studentName: "Hamza Ali Chaudhry", className: "Grade 8", section: "A", feeMonth: "October 2026", tuitionFee: 14000, examFee: 1500, labFee: 1000, otherFee: 0, totalFee: 16500, paid: 0, pending: 16500, dueDate: "2026-10-15", paymentDate: "-", paymentMethod: "-", status: "Pending" },
        { id: "FEE-2026-006", studentId: "STD-2025-006", studentName: "Zainab Bibi Abbasi", className: "Grade 7", section: "A", feeMonth: "October 2026", tuitionFee: 13000, examFee: 1500, labFee: 500, otherFee: 0, totalFee: 15000, paid: 15000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-04", paymentMethod: "Cash", status: "Paid" },
        { id: "FEE-2026-007", studentId: "STD-2025-007", studentName: "Omer Farooq Janjua", className: "Grade 7", section: "A", feeMonth: "October 2026", tuitionFee: 13000, examFee: 1500, labFee: 500, otherFee: 0, totalFee: 15000, paid: 8000, pending: 7000, dueDate: "2026-10-15", paymentDate: "2026-10-08", paymentMethod: "Cash", status: "Partial" },
        { id: "FEE-2026-008", studentId: "STD-2025-008", studentName: "Fatima Zahra Hashmi", className: "Grade 6", section: "A", feeMonth: "October 2026", tuitionFee: 12000, examFee: 1500, labFee: 500, otherFee: 0, totalFee: 14000, paid: 14000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-06", paymentMethod: "Online Bank Transfer", status: "Paid" },
        { id: "FEE-2026-009", studentId: "STD-2025-009", studentName: "Usman Tariq Alvi", className: "Grade 6", section: "A", feeMonth: "October 2026", tuitionFee: 12000, examFee: 1500, labFee: 500, otherFee: 0, totalFee: 14000, paid: 14000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-03", paymentMethod: "Cash", status: "Paid" },
        { id: "FEE-2026-010", studentId: "STD-2025-010", studentName: "Hania Amir Butt", className: "Grade 5", section: "A", feeMonth: "October 2026", tuitionFee: 11000, examFee: 1000, labFee: 0, otherFee: 0, totalFee: 12000, paid: 12000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-02", paymentMethod: "Online Bank Transfer", status: "Paid" },
        { id: "FEE-2026-011", studentId: "STD-2025-011", studentName: "Danyal Murtaza Syed", className: "Grade 5", section: "B", feeMonth: "October 2026", tuitionFee: 11000, examFee: 1000, labFee: 0, otherFee: 0, totalFee: 12000, paid: 0, pending: 12000, dueDate: "2026-10-15", paymentDate: "-", paymentMethod: "-", status: "Pending" },
        { id: "FEE-2026-012", studentId: "STD-2025-012", studentName: "Zoya Tariq Gondal", className: "Grade 4", section: "A", feeMonth: "October 2026", tuitionFee: 10000, examFee: 1000, labFee: 0, otherFee: 0, totalFee: 11000, paid: 11000, pending: 0, dueDate: "2026-10-15", paymentDate: "2026-10-05", paymentMethod: "Cash", status: "Paid" }
    ];

    // Recent Activities Feed
    const defaultActivities = [
        { id: "ACT-01", text: "Student Ahmed Khan marked present for Grade 9-A.", time: "12 minutes ago", type: "attendance", icon: "fa-user-check", color: "success" },
        { id: "ACT-02", text: "Teacher Dr. Abdul Rehman submitted official symposium leave.", time: "35 minutes ago", type: "leave", icon: "fa-calendar-minus", color: "warning" },
        { id: "ACT-03", text: "Fee payment of Rs. 18,000 recorded for Sara Fatima (Grade 9-A).", time: "1 hour ago", type: "fee", icon: "fa-file-invoice-dollar", color: "info" },
        { id: "ACT-04", text: "New academic record added for Ahmed Khan Niazi (Grade 8).", time: "2 hours ago", type: "student", icon: "fa-graduation-cap", color: "primary" },
        { id: "ACT-05", text: "Monthly payroll generated for October 2026 (8 staff members).", time: "4 hours ago", type: "payroll", icon: "fa-money-bill-wave", color: "purple" },
        { id: "ACT-06", text: "Student Hamza Ali Chaudhry leave request approved.", time: "5 hours ago", type: "leave", icon: "fa-check-circle", color: "success" },
        { id: "ACT-07", text: "Teacher Tariq Mehmood assigned as Head of Mathematics Department.", time: "1 day ago", type: "teacher", icon: "fa-user-tie", color: "indigo" }
    ];

    // Helper functions for LocalStorage
    function load(key, defaultVal) {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
            if (!raw) return defaultVal;
            return JSON.parse(raw);
        } catch (e) {
            console.error("Failed to load " + key, e);
            return defaultVal;
        }
    }

    function save(key, data) {
        try {
            localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save " + key, e);
        }
    }

    // Public API
    return {
        init: function () {
            if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized')) {
                this.resetToDefaults();
            }
        },

        resetToDefaults: function () {
            save('settings', defaultSettings);
            save('academicYears', defaultAcademicYears);
            save('classes', defaultClasses);
            save('subjects', defaultSubjects);
            save('teachers', defaultTeachers);
            save('students', defaultStudents);
            save('studentAttendance', defaultStudentAttendance);
            save('teacherAttendance', defaultTeacherAttendance);
            save('studentLeaves', defaultStudentLeaves);
            save('teacherLeaves', defaultTeacherLeaves);
            save('payroll', defaultPayroll);
            save('fees', defaultFees);
            save('activities', defaultActivities);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
        },

        // Settings
        getSettings: function () {
            return load('settings', defaultSettings);
        },
        saveSettings: function (newSettings) {
            const current = this.getSettings();
            const updated = Object.assign({}, current, newSettings);
            save('settings', updated);
            this.logActivity("System settings updated.", "settings", "fa-cog", "secondary");
            return updated;
        },

        // Academic Years
        getAcademicYears: function () {
            return load('academicYears', defaultAcademicYears);
        },
        saveAcademicYear: function (ay) {
            let list = this.getAcademicYears();
            const idx = list.findIndex(item => item.id === ay.id);
            if (idx > -1) {
                list[idx] = ay;
            } else {
                if (!ay.id) ay.id = "AY-" + (list.length + 1);
                list.push(ay);
            }
            save('academicYears', list);
            this.logActivity(`Academic Year ${ay.year} saved.`, "academic", "fa-calendar-alt", "info");
            return ay;
        },
        setActiveAcademicYear: function (yearName) {
            let list = this.getAcademicYears();
            list.forEach(ay => {
                if (ay.year === yearName) {
                    ay.status = "Active";
                } else if (ay.status === "Active") {
                    ay.status = "Archived";
                }
            });
            save('academicYears', list);
            let s = this.getSettings();
            s.activeAcademicYear = yearName;
            this.saveSettings(s);
            this.logActivity(`Active Academic Year set to ${yearName}.`, "academic", "fa-check-double", "primary");
            return list;
        },

        // Classes & Sections
        getClasses: function () {
            return load('classes', defaultClasses);
        },
        getClassById: function (id) {
            return this.getClasses().find(c => c.id === id);
        },
        saveClass: function (cls) {
            let list = this.getClasses();
            const idx = list.findIndex(c => c.id === cls.id);
            if (idx > -1) {
                list[idx] = cls;
            } else {
                if (!cls.id) cls.id = "CLS-" + Date.now();
                list.push(cls);
            }
            save('classes', list);
            this.logActivity(`Class ${cls.name} saved.`, "academic", "fa-chalkboard", "primary");
            return cls;
        },
        deleteClass: function (id) {
            let list = this.getClasses();
            const cls = list.find(c => c.id === id);
            list = list.filter(c => c.id !== id);
            save('classes', list);
            if (cls) this.logActivity(`Class ${cls.name} deleted.`, "academic", "fa-trash", "danger");
            return true;
        },

        // Subjects
        getSubjects: function () {
            return load('subjects', defaultSubjects);
        },
        saveSubject: function (sub) {
            let list = this.getSubjects();
            const idx = list.findIndex(s => s.id === sub.id);
            if (idx > -1) {
                list[idx] = sub;
            } else {
                if (!sub.id) sub.id = "SUB-" + (list.length + 101);
                list.push(sub);
            }
            save('subjects', list);
            this.logActivity(`Subject ${sub.name} saved.`, "subject", "fa-book", "info");
            return sub;
        },
        deleteSubject: function (id) {
            let list = this.getSubjects();
            const s = list.find(sub => sub.id === id);
            list = list.filter(sub => sub.id !== id);
            save('subjects', list);
            if (s) this.logActivity(`Subject ${s.name} deleted.`, "subject", "fa-trash", "danger");
            return true;
        },

        // Teachers (WITHOUT photos)
        getTeachers: function () {
            return load('teachers', defaultTeachers);
        },
        getTeacherById: function (id) {
            return this.getTeachers().find(t => t.id === id);
        },
        saveTeacher: function (tch) {
            let list = this.getTeachers();
            const idx = list.findIndex(t => t.id === tch.id);
            if (idx > -1) {
                list[idx] = tch;
                this.logActivity(`Teacher ${tch.fullName} profile updated.`, "teacher", "fa-user-edit", "info");
            } else {
                if (!tch.id) tch.id = "TCH-" + String(list.length + 1).padStart(3, '0');
                list.push(tch);
                this.logActivity(`New teacher ${tch.fullName} added.`, "teacher", "fa-user-plus", "success");
            }
            save('teachers', list);
            return tch;
        },
        deleteTeacher: function (id) {
            let list = this.getTeachers();
            const t = list.find(tch => tch.id === id);
            list = list.filter(tch => tch.id !== id);
            save('teachers', list);
            if (t) this.logActivity(`Teacher ${t.fullName} removed from records.`, "teacher", "fa-user-minus", "danger");
            return true;
        },

        // Students
        getStudents: function () {
            return load('students', defaultStudents);
        },
        getStudentById: function (id) {
            return this.getStudents().find(s => s.id === id);
        },
        saveStudent: function (std) {
            let list = this.getStudents();
            const idx = list.findIndex(s => s.id === std.id);
            if (idx > -1) {
                list[idx] = std;
                this.logActivity(`Student ${std.fullName} profile updated.`, "student", "fa-user-edit", "info");
            } else {
                if (!std.id) std.id = "STD-2025-" + String(list.length + 1).padStart(3, '0');
                if (!std.academicHistory) std.academicHistory = [];
                if (!std.attendanceSummary) std.attendanceSummary = { totalDays: 0, presentDays: 0, absentDays: 0, leaveDays: 0, percentage: 100 };
                if (!std.feeSummary) std.feeSummary = { totalFees: 0, paid: 0, pending: 0, lastPayment: "-", dueDate: "-", status: "Pending" };
                list.push(std);
                this.logActivity(`New student ${std.fullName} enrolled into ${std.className || 'school'}.`, "student", "fa-user-plus", "success");
            }
            save('students', list);
            return std;
        },
        deleteStudent: function (id) {
            let list = this.getStudents();
            const s = list.find(std => std.id === id);
            list = list.filter(std => std.id !== id);
            save('students', list);
            if (s) this.logActivity(`Student ${s.fullName} deleted from records.`, "student", "fa-trash", "danger");
            return true;
        },

        // Academic History within Student Profile
        addAcademicHistory: function (studentId, record) {
            let list = this.getStudents();
            const student = list.find(s => s.id === studentId);
            if (!student) return false;
            if (!student.academicHistory) student.academicHistory = [];
            student.academicHistory.push(record);
            save('students', list);
            this.logActivity(`Academic record for ${record.academicYear} added to ${student.fullName}.`, "academic", "fa-history", "primary");
            return true;
        },
        deleteAcademicHistory: function (studentId, index) {
            let list = this.getStudents();
            const student = list.find(s => s.id === studentId);
            if (!student || !student.academicHistory) return false;
            student.academicHistory.splice(index, 1);
            save('students', list);
            this.logActivity(`Academic record deleted for ${student.fullName}.`, "academic", "fa-trash", "warning");
            return true;
        },

        // Student Attendance
        getStudentAttendance: function (date, classId, section) {
            let list = load('studentAttendance', defaultStudentAttendance);
            return list.filter(rec => {
                let match = true;
                if (date && rec.date !== date) match = false;
                if (classId && rec.classId !== classId) match = false;
                if (section && rec.section !== section) match = false;
                return match;
            });
        },
        saveStudentAttendanceBatch: function (records) {
            let list = load('studentAttendance', defaultStudentAttendance);
            records.forEach(newRec => {
                const idx = list.findIndex(r => r.studentId === newRec.studentId && r.date === newRec.date);
                if (idx > -1) {
                    list[idx] = Object.assign({}, list[idx], newRec);
                } else {
                    if (!newRec.id) newRec.id = "SA-" + Date.now() + Math.random().toString(36).substr(2, 4);
                    list.push(newRec);
                }
            });
            save('studentAttendance', list);
            this.logActivity(`Student attendance saved for ${records.length} students.`, "attendance", "fa-calendar-check", "success");
            return true;
        },

        // Teacher Attendance
        getTeacherAttendance: function (date) {
            let list = load('teacherAttendance', defaultTeacherAttendance);
            if (date) {
                return list.filter(rec => rec.date === date);
            }
            return list;
        },
        saveTeacherAttendanceBatch: function (records) {
            let list = load('teacherAttendance', defaultTeacherAttendance);
            records.forEach(newRec => {
                const idx = list.findIndex(r => r.teacherId === newRec.teacherId && r.date === newRec.date);
                if (idx > -1) {
                    list[idx] = Object.assign({}, list[idx], newRec);
                } else {
                    if (!newRec.id) newRec.id = "TA-" + Date.now() + Math.random().toString(36).substr(2, 4);
                    list.push(newRec);
                }
            });
            save('teacherAttendance', list);
            this.logActivity(`Teacher attendance recorded for date ${records[0]?.date || ''}.`, "attendance", "fa-user-clock", "success");
            return true;
        },

        // Student Leaves
        getStudentLeaves: function () {
            return load('studentLeaves', defaultStudentLeaves);
        },
        saveStudentLeave: function (leave) {
            let list = this.getStudentLeaves();
            const idx = list.findIndex(l => l.id === leave.id);
            if (idx > -1) {
                list[idx] = leave;
            } else {
                if (!leave.id) leave.id = "SLV-" + Date.now().toString().slice(-4);
                list.unshift(leave);
            }
            save('studentLeaves', list);
            this.logActivity(`Student leave application submitted for ${leave.studentName}.`, "leave", "fa-calendar-minus", "warning");
            return leave;
        },
        updateStudentLeaveStatus: function (id, status) {
            let list = this.getStudentLeaves();
            const leave = list.find(l => l.id === id);
            if (leave) {
                leave.status = status;
                save('studentLeaves', list);
                this.logActivity(`Student leave for ${leave.studentName} marked ${status}.`, "leave", "fa-clipboard-check", status === 'Approved' ? 'success' : 'danger');
                return true;
            }
            return false;
        },
        deleteStudentLeave: function (id) {
            let list = this.getStudentLeaves();
            list = list.filter(l => l.id !== id);
            save('studentLeaves', list);
            return true;
        },

        // Teacher Leaves
        getTeacherLeaves: function () {
            return load('teacherLeaves', defaultTeacherLeaves);
        },
        saveTeacherLeave: function (leave) {
            let list = this.getTeacherLeaves();
            const idx = list.findIndex(l => l.id === leave.id);
            if (idx > -1) {
                list[idx] = leave;
            } else {
                if (!leave.id) leave.id = "TLV-" + Date.now().toString().slice(-4);
                list.unshift(leave);
            }
            save('teacherLeaves', list);
            this.logActivity(`Teacher leave submitted by ${leave.teacherName}.`, "leave", "fa-user-clock", "warning");
            return leave;
        },
        updateTeacherLeaveStatus: function (id, status, approvedBy) {
            let list = this.getTeacherLeaves();
            const leave = list.find(l => l.id === id);
            if (leave) {
                leave.status = status;
                if (approvedBy) leave.approvedBy = approvedBy;
                save('teacherLeaves', list);
                this.logActivity(`Teacher leave for ${leave.teacherName} marked ${status}.`, "leave", "fa-check-circle", status === 'Approved' ? 'success' : 'danger');
                return true;
            }
            return false;
        },
        deleteTeacherLeave: function (id) {
            let list = this.getTeacherLeaves();
            list = list.filter(l => l.id !== id);
            save('teacherLeaves', list);
            return true;
        },

        // Fees
        getFees: function () {
            return load('fees', defaultFees);
        },
        saveFee: function (fee) {
            let list = this.getFees();
            const idx = list.findIndex(f => f.id === fee.id);
            if (idx > -1) {
                list[idx] = fee;
            } else {
                if (!fee.id) fee.id = "FEE-" + Date.now().toString().slice(-6);
                list.unshift(fee);
            }
            save('fees', list);
            this.logActivity(`Fee voucher ${fee.id} recorded for ${fee.studentName}.`, "fee", "fa-file-invoice-dollar", "success");
            return fee;
        },
        updateFeePayment: function (id, paidAmount, paymentDate, paymentMethod) {
            let list = this.getFees();
            const f = list.find(item => item.id === id);
            if (f) {
                f.paid = parseFloat(paidAmount) || 0;
                f.pending = Math.max(0, f.totalFee - f.paid);
                f.paymentDate = paymentDate || new Date().toISOString().split('T')[0];
                if (paymentMethod) f.paymentMethod = paymentMethod;
                if (f.pending === 0) f.status = "Paid";
                else if (f.paid > 0) f.status = "Partial";
                else f.status = "Pending";
                save('fees', list);
                this.logActivity(`Payment of Rs. ${f.paid.toLocaleString()} recorded for ${f.studentName}.`, "fee", "fa-receipt", "success");
                return f;
            }
            return null;
        },
        deleteFee: function (id) {
            let list = this.getFees();
            list = list.filter(f => f.id !== id);
            save('fees', list);
            return true;
        },

        // Payroll
        getPayroll: function () {
            return load('payroll', defaultPayroll);
        },
        savePayroll: function (pay) {
            let list = this.getPayroll();
            // Calculate formula: Net = Basic + Allowances + Bonus - Deductions
            const basic = parseFloat(pay.basicSalary) || 0;
            const allow = parseFloat(pay.allowances) || 0;
            const bon = parseFloat(pay.bonus) || 0;
            const ded = parseFloat(pay.deductions) || 0;
            pay.netSalary = (basic + allow + bon) - ded;

            const idx = list.findIndex(p => p.id === pay.id);
            if (idx > -1) {
                list[idx] = pay;
            } else {
                if (!pay.id) pay.id = "PAY-" + Date.now().toString().slice(-6);
                list.unshift(pay);
            }
            save('payroll', list);
            this.logActivity(`Payroll entry saved for ${pay.teacherName}.`, "payroll", "fa-money-check-alt", "primary");
            return pay;
        },
        updatePayrollPayment: function (id, status, paymentDate) {
            let list = this.getPayroll();
            const pay = list.find(p => p.id === id);
            if (pay) {
                pay.paymentStatus = status;
                pay.paymentDate = paymentDate || (status === 'Paid' ? new Date().toISOString().split('T')[0] : "-");
                save('payroll', list);
                this.logActivity(`Teacher salary of Rs. ${pay.netSalary.toLocaleString()} marked ${status} for ${pay.teacherName}.`, "payroll", "fa-check", "success");
                return pay;
            }
            return null;
        },
        deletePayroll: function (id) {
            let list = this.getPayroll();
            list = list.filter(p => p.id !== id);
            save('payroll', list);
            return true;
        },

        // Activities
        getActivities: function () {
            return load('activities', defaultActivities);
        },
        logActivity: function (text, type, icon, color) {
            let list = this.getActivities();
            const newAct = {
                id: "ACT-" + Date.now(),
                text: text,
                time: "Just now",
                type: type || "info",
                icon: icon || "fa-bell",
                color: color || "primary"
            };
            list.unshift(newAct);
            if (list.length > 30) list = list.slice(0, 30);
            save('activities', list);
        },

        // Dashboard Aggregated Stats
        getDashboardStats: function () {
            const students = this.getStudents();
            const teachers = this.getTeachers();
            const classes = this.getClasses();
            const stdAtt = this.getStudentAttendance(todayStr);
            const tchAtt = this.getTeacherAttendance(todayStr);
            const fees = this.getFees();
            const stdLeaves = this.getStudentLeaves();
            const tchLeaves = this.getTeacherLeaves();

            // Student attendance counts for today
            let stdPresent = stdAtt.filter(a => a.status === 'Present').length;
            let stdAbsent = stdAtt.filter(a => a.status === 'Absent').length;
            let stdLeave = stdAtt.filter(a => a.status === 'Leave').length;
            // If some students don't have attendance recorded yet, count them realistically
            if (stdAtt.length === 0) {
                stdPresent = Math.round(students.length * 0.92);
                stdAbsent = Math.round(students.length * 0.05);
                stdLeave = students.length - stdPresent - stdAbsent;
            }

            // Teacher attendance counts for today
            let tchPresent = tchAtt.filter(a => a.status === 'Present').length;
            let tchAbsent = tchAtt.filter(a => a.status === 'Absent').length;
            let tchLeave = tchAtt.filter(a => a.status === 'Leave').length;
            if (tchAtt.length === 0) {
                tchPresent = Math.round(teachers.length * 0.85);
                tchAbsent = 0;
                tchLeave = teachers.length - tchPresent;
            }

            // Pending fees total
            let pendingFees = fees.reduce((sum, f) => sum + (parseFloat(f.pending) || 0), 0);

            return {
                totalStudents: students.length,
                totalTeachers: teachers.length,
                presentStudentsToday: stdPresent,
                absentStudentsToday: stdAbsent,
                studentsOnLeave: stdLeave,
                teachersPresentToday: tchPresent,
                teachersAbsentToday: tchAbsent,
                teachersOnLeave: tchLeave,
                pendingFees: pendingFees,
                totalClasses: classes.length
            };
        }
    };
})();

// Auto-initialize DB on load
SchoolDB.init();

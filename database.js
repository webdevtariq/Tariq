// database.js - Complete Laboratory Information System Database Module
// Updated with single ranges for all tests except CBC and Uric Acid

const LabDatabase = {
    DB_NAME: 'LabManagementDB',

    init: function () {
        if (!localStorage.getItem(this.DB_NAME)) {
            localStorage.setItem(this.DB_NAME, JSON.stringify({
                patients: [],
                reports: [],
                lastLabNumber: 0
            }));
        }
        this.initializeTestPanels(true); // force update
    },

    initializeTestPanels: function (forceOverwrite = false) {
        const panels = {
            // ==================== CBC PANEL (gender-specific where needed) ====================
            cbc: {
                name: 'CBC (Complete Blood Count)',
                tests: [
                    { id: 'hb', name: 'Hemoglobin', unit: 'g/dL', maleRange: '13-18', femaleRange: '12-16', childRange: 'N/A' },
                    { id: 'rbc', name: 'RBC', unit: 'million/µL', maleRange: '4.5-5.5', femaleRange: '3.9-5.3', childRange: 'N/A' },
                    { id: 'hct', name: 'HCT', unit: '%', maleRange: '40-54', femaleRange: '40-54', childRange: '40-54' },
                    { id: 'mcv', name: 'MCV', unit: 'fL', maleRange: '76-96', femaleRange: '76-96', childRange: '76-96' },
                    { id: 'mch', name: 'MCH', unit: 'pg', maleRange: '28-32', femaleRange: '28-32', childRange: '28-32' },
                    { id: 'mchc', name: 'MCHC', unit: 'g/dL', maleRange: '32-36', femaleRange: '32-36', childRange: '32-36' },

                    { id: 'plt', name: 'Platelets', unit: '/µL', maleRange: '150000-400000', femaleRange: '150000-400000', childRange: '150000-400000' },
                    { id: 'wbc', name: 'WBC', unit: '/µL', maleRange: '4000-11000', femaleRange: '4000-11000', childRange: '4000-11000' },
                    { id: 'esr', name: 'ESR', unit: 'mm/30min', maleRange: '0-9', femaleRange: '0-15', childRange: 'N/A' },
                    { id: 'neut', name: 'Neutrophils', unit: '%', maleRange: '40-70', femaleRange: '40-70', childRange: '40-70' },
                    { id: 'lymp', name: 'Lymphocytes', unit: '%', maleRange: '20-50', femaleRange: '20-50', childRange: '20-50' },
                    { id: 'mono', name: 'Monocytes', unit: '%', maleRange: '1-6', femaleRange: '1-6', childRange: '1-6' },
                    { id: 'eos', name: 'Eosinophils', unit: '%', maleRange: '1-6', femaleRange: '1-6', childRange: '1-6' },
                    { id: 'baso', name: 'Basophils', unit: '%', maleRange: '0-1', femaleRange: '0-1', childRange: '0-1' }
                ],
                category: 'Hematology'
            },

            // ==================== LFT PANEL (single ranges) ====================
            lft: {
                name: 'Liver Function Test (LFT)',
                tests: [
                    { id: 'total_bilirubin', name: 'Total Bilirubin', unit: 'mg/dL', maleRange: '0.1-1.0', femaleRange: '0.1-1.0', childRange: '0.1-1.0' },
                    { id: 'direct_bilirubin', name: 'Direct Bilirubin', unit: 'mg/dL', maleRange: '0.0-0.25', femaleRange: '0.0-0.25', childRange: '0.0-0.25' },
                    { id: 'indirect_bilirubin', name: 'Indirect Bilirubin', unit: 'mg/dL', maleRange: '0.4-1.0', femaleRange: '0.4-1.0', childRange: '0.4-1.0' },
                    { id: 'alt', name: 'ALT (SGPT)', unit: 'U/L', maleRange: 'up to 40', femaleRange: 'up to 40', childRange: 'up to 40' },
                    { id: 'alk_phos', name: 'Alk. Phosphatase', unit: 'U/L', maleRange: '60-275', femaleRange: '60-275', childRange: '60-275' }
                ],
                extraTests: [
                    { id: 'ggt', name: 'GGT', unit: 'U/L', range: '8-61', category: 'LFT' },
                    { id: 'total_protein', name: 'Total Protein', unit: 'g/dL', range: '6.0-8.3', category: 'LFT' },
                    { id: 'albumin', name: 'Albumin', unit: 'g/dL', range: '3.5-5.0', category: 'LFT' },
                    { id: 'globulin', name: 'Globulin', unit: 'g/dL', range: '2.0-3.5', category: 'LFT' },
                    { id: 'ag_ratio', name: 'A/G Ratio', unit: '', range: '1.0-2.0', category: 'LFT' }
                ],
                category: 'LFT'
            },

            // ==================== BIOCHEMISTRY PANEL (Uric Acid gender-specific, others single) ====================
            biochemistry: {
                name: 'Biochemistry',
                tests: [
                    { id: 'glucose_f', name: 'Glucose (Fasting)', unit: 'mg/dL', maleRange: '70-110', femaleRange: '70-110', childRange: '70-110' },
                    { id: 'glucose_r', name: 'Glucose (Random)', unit: 'mg/dL', maleRange: '70-180', femaleRange: '70-180', childRange: '70-180' },
                    { id: 'uric_acid', name: 'Uric Acid', unit: 'mg/dL', maleRange: '3.4-7.0', femaleRange: '2.4-5.7', childRange: '2.0-5.5' }, // gender-specific
                    { id: 'amylase', name: 'Amylase', unit: 'U/L', maleRange: 'up to 180', femaleRange: 'up to 180', childRange: 'up to 180' },
                    { id: 'urea', name: 'Urea', unit: 'mg/dL', maleRange: '10-50', femaleRange: '10-50', childRange: '10-50' },
                    { id: 'creatinine', name: 'Creatinine', unit: 'mg/dL', maleRange: '0.5-1.5', femaleRange: '0.5-1.5', childRange: '0.5-1.5' },
                    { id: 'calcium', name: 'Calcium', unit: 'mg/dL', maleRange: '8.8-10.2', femaleRange: '8.8-10.2', childRange: '8.8-10.2' },
                    { id: 'ldh', name: 'LDH', unit: 'U/L', maleRange: '230-460', femaleRange: '230-460', childRange: '230-460' }
                ],
                extraTests: [
                    { id: 'phosphorus', name: 'Phosphorus', unit: 'mg/dL', range: '2.5-4.5', category: 'Biochemistry' },
                    { id: 'magnesium', name: 'Magnesium', unit: 'mg/dL', range: '1.7-2.2', category: 'Biochemistry' },
                    { id: 'iron', name: 'Iron', unit: 'µg/dL', range: '60-170', category: 'Biochemistry' },
                    { id: 'tibc', name: 'TIBC', unit: 'µg/dL', range: '250-450', category: 'Biochemistry' },
                    { id: 'ferritin', name: 'Ferritin', unit: 'ng/mL', range: '20-300', category: 'Biochemistry' }
                ],
                category: 'Biochemistry'
            },

            // ==================== SEROLOGY PANEL (single ranges) ====================
            serology: {
                name: 'Serology',
                tests: [
                    { id: 'hbsag', name: 'HBsAg', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'anti_hcv', name: 'Anti-HCV', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'anti_hiv', name: 'Anti-HIV', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'aso_titre', name: 'ASO Titre', unit: 'Negative', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'ra_factor', name: 'RA Factor', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'widal_to', name: 'Widal TO', unit: '', maleRange: '1:40', femaleRange: '1:40', childRange: '1:40' },
                    { id: 'widal_th', name: 'Widal TH', unit: '', maleRange: '1:40', femaleRange: '1:40', childRange: '1:40' },
                    { id: 'typhidot_igg', name: 'TYPHIDOT IgG', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'typhidot_igm', name: 'TYPHIDOT IgM', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'mp_pf', name: 'MP Pf', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'mp_pv', name: 'MP Pv', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'dengue_ns1', name: 'Dengue NS1', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'hpylori', name: 'H. Pylori', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' }
                ],
                category: 'Serology'
            },

            // ==================== IMMUNOLOGY PANEL (single ranges) ====================
            immunology: {
                name: 'Immunology',
                tests: [
                    { id: 'crp', name: 'CRP', unit: 'mg/L', maleRange: '<6.0', femaleRange: '<6.0', childRange: '<6.0' },
                    { id: 'ra_factor_titer', name: 'RA Factor Titer', unit: 'Negative', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' }
                ],
                category: 'Immunology'
            },

            // ==================== LIPID PROFILE PANEL (single ranges) ====================
            lipid_profile: {
                name: 'Lipid Profile',
                tests: [
                    { id: 'cholesterol', name: 'Cholesterol', unit: 'mg/dL', maleRange: '<200', femaleRange: '<200', childRange: '<200' },
                    { id: 'triglyceride', name: 'Triglyceride', unit: 'mg/dL', maleRange: '0-200', femaleRange: '0-200', childRange: '0-200' },
                    { id: 'hdl', name: 'HDL', unit: 'mg/dL', maleRange: '45', femaleRange: '45', childRange: '45' },
                    { id: 'ldl', name: 'LDL', unit: 'mg/dL', maleRange: '0-150', femaleRange: '0-150', childRange: '0-150' }
                ],
                category: 'Lipid Profile'
            },

            // ==================== ELECTROLYTES PANEL (updated ranges) ====================
            electrolytes: {
                name: 'Electrolytes',
                tests: [
                    { id: 'na', name: 'Sodium (Na)', unit: 'mmol/L', maleRange: '136-149', femaleRange: '136-149', childRange: '136-149' },
                    { id: 'k', name: 'Potassium (K)', unit: 'mmol/L', maleRange: '3.8-5.2', femaleRange: '3.8-5.2', childRange: '3.8-5.2' },
                    { id: 'cl', name: 'Chloride (Cl)', unit: 'mmol/L', maleRange: '96-107', femaleRange: '96-107', childRange: '96-107' }
                ],
                category: 'Electrolytes'
            },

            // ==================== URINE PANEL (single ranges) ====================
            urine: {
                name: 'Urine D/R',
                tests: [
                    { id: 'urine_app', name: 'Appearance', unit: '', maleRange: 'Clear', femaleRange: 'Clear', childRange: 'Clear' },
                    { id: 'urine_ph', name: 'pH', unit: '', maleRange: '5.0-8.0', femaleRange: '5.0-8.0', childRange: '5.0-8.0' }
                ],
                category: 'Urine'
            },

            // ==================== STOOL PANEL (single ranges) ====================
            stool: {
                name: 'Stool D/R',
                tests: [
                    { id: 'stool_app', name: 'Appearance', unit: '', maleRange: 'Brown', femaleRange: 'Brown', childRange: 'Brown' },
                    { id: 'stool_hpylori', name: 'Stool H. Pylori', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' }
                ],
                category: 'Stool'
            },
            // ==================== H. PYLORI TESTS PANEL (combined) ====================
            hpylori: {
                name: 'H. Pylori Tests',
                tests: [
                    { id: 'stool_hpylori', name: 'Stool H. Pylori', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'hpylori', name: 'H. Pylori', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' }
                ]
            },
            // ==================== THYROID PANEL (single ranges) ====================
            thyroid: {
                name: 'Thyroid Profile',
                tests: [
                    { id: 't3', name: 'T3 (Total Triiodothyronine)', unit: 'nmol/ml', maleRange: '0.9-2.8', femaleRange: '0.9-2.8', childRange: '0.9-2.8' },
                    { id: 't4', name: 'T4 (Total Thyroxine)', unit: 'nmol/L', maleRange: '10.23-300', femaleRange: '5.0-12.0', childRange: '5.0-12.0' },
                    { id: 'tsh', name: 'TSH', unit: 'µIU/mL', maleRange: '0.4-4.0', femaleRange: '0.4-4.0', childRange: '0.4-4.0' }
                ],
                extraTests: [
                    { id: 'free_t3', name: 'Free T3', unit: 'pg/mL', range: '2.3-4.2' },
                    { id: 'free_t4', name: 'Free T4', unit: 'ng/dL', range: '0.8-1.8' }
                ],
                category: 'Thyroid'
            },

            // ==================== COAGULATION PANEL (single ranges) ====================

            coagulation: {
                name: 'Coagulation',
                tests: [
                    { id: 'pt', name: 'PT', unit: 'sec', maleRange: '11-16', femaleRange: '11-16', childRange: '11-16' },
                    { id: 'aptt', name: 'APTT', unit: 'sec', maleRange: '30-40', femaleRange: '30-40', childRange: '30-40' },
                    { id: 'inr', name: 'INR', unit: '', maleRange: '0.1-3.0', femaleRange: '0.1-3.0', childRange: '0.1-3.0' }
                ],
                category: 'Coagulation'
            },

            // ==================== MISCELLANEOUS PANEL (single ranges) ====================
            miscellaneous: {
                name: 'Miscellaneous',
                tests: [
                    { id: 'blood_group', name: 'Blood Group', unit: '', maleRange: 'A/B/AB/O', femaleRange: 'A/B/AB/O', childRange: 'A/B/AB/O' },
                    { id: 'sputum_afb', name: 'Sputum for AFB', unit: '', maleRange: 'Negative', femaleRange: 'Negative', childRange: 'Negative' },
                    { id: 'hba1c', name: 'HbA1c', unit: '%', maleRange: '4.0-6.0', femaleRange: '4.0-6.0', childRange: '4.0-6.0' }
                ],
                category: 'Miscellaneous'
            },
            // ==================== Urine Pregnancy) ====================
            urine_pt: {
                name: 'Urine PT (Pregnancy Test)',
                tests: [
                    { id: 'urine_pregnancy', name: 'Urine Pregnancy', unit: '', maleRange: 'N/A', femaleRange: 'Negative', childRange: 'N/A' }
                ],
                category: 'Urine PT'
            },
            semen: {
                name: 'Semen Analysis',
                tests: [],
                category: 'Semen Analysis'
            },
            // ==================== BT CT PANEL ====================
            btct: {
                name: 'BT CT (Bleeding Time / Clotting Time)',
                tests: [
                    { id: 'bt', name: 'Bleeding Time (BT)', unit: 'min', maleRange: '2-7', femaleRange: '2-7', childRange: '2-7' },
                    { id: 'ct', name: 'Clotting Time (CT)', unit: 'min', maleRange: '5-11', femaleRange: '5-11', childRange: '5-11' }
                ],
                category: 'Coagulation'
            },

            // ==================== VITAMIN D PANEL ====================
            vitamind: {
                name: 'Vitamin D',
                tests: [
                    { id: 'vitamin_d', name: 'Vitamin D', unit: 'ng/mL', maleRange: '', femaleRange: '', childRange: '' }
                ],
                category: 'Biochemistry'
            },

            // ==================== HB PANEL ====================
            hb: {
                name: 'HB (Hemoglobin)',
                tests: [
                    { id: 'hb_only', name: 'Hemoglobin', unit: 'g/dL', maleRange: '13.5-18.0', femaleRange: '12.0-15.0', childRange: '11.0-16.0' }
                ],
                category: 'Hematology'
            },
        };




        localStorage.setItem('testPanels', JSON.stringify(panels));
        console.log('Test panels initialized/updated with corrected ranges and units.');
    },

    // ========== Database helper functions ==========
    generateLabNumber: function () {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        let last = db.lastLabNumber || 0;
        last++;
        db.lastLabNumber = last;
        localStorage.setItem(this.DB_NAME, JSON.stringify(db));
        return last.toString();
    },

    updateLabNumberCounter: function (usedNumber) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        let last = db.lastLabNumber || 0;
        const num = parseInt(usedNumber, 10);
        if (!isNaN(num) && num > last) {
            db.lastLabNumber = num;
            localStorage.setItem(this.DB_NAME, JSON.stringify(db));
        }
    },

    savePatient: function (patientData) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        patientData.id = this.generateId();
        patientData.timestamp = new Date().toISOString();
        db.patients.push(patientData);
        this.updateLabNumberCounter(patientData.labNumber);
        localStorage.setItem(this.DB_NAME, JSON.stringify(db));
        return patientData;
    },

    saveReport: function (reportData) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        reportData.id = this.generateId();
        reportData.timestamp = new Date().toISOString();
        db.reports.push(reportData);
        localStorage.setItem(this.DB_NAME, JSON.stringify(db));
        return reportData;
    },

    getAllPatients: function () {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        return db.patients || [];
    },

    getPatientById: function (patientId) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        return db.patients.find(p => p.id === patientId);
    },

    searchPatients: function (query) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        const patients = db.patients || [];
        query = query.toLowerCase();
        return patients.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.labNumber.toLowerCase().includes(query)
        );
    },

    getPatientReports: function (patientId) {
        const db = JSON.parse(localStorage.getItem(this.DB_NAME));
        return (db.reports || []).filter(r => r.patientId === patientId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    generateId: function () {
        return 'PAT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    getTestPanels: function () {
        return JSON.parse(localStorage.getItem('testPanels')) || {};
    },

    getPanelTests: function (panelId) {
        const panels = this.getTestPanels();
        return panels[panelId] ? panels[panelId].tests : [];
    },

    getPanelExtraTests: function (panelId) {
        const panels = this.getTestPanels();
        return panels[panelId] ? panels[panelId].extraTests || [] : [];
    }
};

LabDatabase.init();
window.LabDatabase = LabDatabase;
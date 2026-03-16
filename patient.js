// patient.js - Patient Registration and Management Module
// Lab number is now manually entered; no duplicate check.

// Mapping from panel key to HTML file
const panelToPage = {
    cbc: 'cbc.html',
    lft: 'lft.html',
    biochemistry: 'biochemistry.html',
    serology: 'serology.html',
    immunology: 'immunology.html',
    lipid_profile: 'lipid.html',
    electrolytes: 'electrolytes.html',
    urine: 'urine.html',
    stool: 'stool.html',
    hpylori: 'hpylori.html',
    thyroid: 'thyroid.html',
    coagulation: 'coagulation.html',
    miscellaneous: 'miscellaneous.html',
    urine_pt: 'urine-pt.html',
    semen: 'semen.html',
    btct: 'btct.html',
    vitamind: 'vitamin-d.html',
    hb: 'hb.html'
};

document.addEventListener('DOMContentLoaded', function() {
    initializePatientPage();
    loadTestPanels();
    loadPatientHistory();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function initializePatientPage() {
    // Lab number is now empty – user enters manually
    document.getElementById('labNumber').value = '';
    document.getElementById('labNumber').readOnly = false;
    
    const today = new Date();
    document.getElementById('regDate').value = today.toLocaleDateString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function loadTestPanels() {
    const panels = LabDatabase.getTestPanels();
    const container = document.getElementById('testPanels');
    container.innerHTML = '';

    for (let [key, panel] of Object.entries(panels)) {
        const panelDiv = document.createElement('div');
        panelDiv.className = 'test-panel';
        panelDiv.innerHTML = `
            <h3>${panel.name}</h3>
            <label>
                <input type="checkbox" name="panel" value="${key}" onchange="handlePanelSelect(this)">
                Select this panel
            </label>
        `;
        container.appendChild(panelDiv);
    }
}

function handlePanelSelect(checkbox) {
    // optional
}

function registerPatient(event) {
    event.preventDefault();

    const selectedPanels = [];
    document.querySelectorAll('input[name="panel"]:checked').forEach(cb => {
        selectedPanels.push(cb.value);
    });

    if (selectedPanels.length === 0) {
        alert('Please select at least one test panel');
        return;
    }

    const labNumber = document.getElementById('labNumber').value.trim();
    if (!labNumber) {
        alert('Please enter a lab number');
        return;
    }

    const patientData = {
        labNumber: labNumber,
        date: document.getElementById('regDate').value,
        name: document.getElementById('patientName').value,
        gender: document.getElementById('gender').value,
        doctor: document.getElementById('doctor').value,
        panels: selectedPanels
    };

    const savedPatient = LabDatabase.savePatient(patientData);
    sessionStorage.setItem('currentPatient', JSON.stringify(savedPatient));

    // Redirect to the first selected panel's page
    let targetPage = null;
    for (let panel of selectedPanels) {
        if (panelToPage[panel]) {
            targetPage = panelToPage[panel];
            break;
        }
    }

    if (targetPage) {
        window.location.href = targetPage;
    } else {
        alert('No valid panel page found for the selected panels. Redirecting to CBC by default.');
        window.location.href = 'cbc.html';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (sectionId === 'history') loadPatientHistory();
}

function searchPatients() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 2) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }
    const results = LabDatabase.searchPatients(query);
    displaySearchResults(results);
}

function displaySearchResults(patients) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    if (patients.length === 0) {
        container.innerHTML = '<p class="no-results">No patients found</p>';
        return;
    }
    patients.forEach(patient => {
        const div = document.createElement('div');
        div.className = 'patient-result';
        div.onclick = () => viewPatientReports(patient);
        div.innerHTML = `
            <h4>${patient.name}</h4>
            <p>Lab #: ${patient.labNumber} | Date: ${patient.date}</p>
            <p>Doctor: ${patient.doctor}</p>
            <p>Panels: ${patient.panels.join(', ')}</p>
        `;
        container.appendChild(div);
    });
}

function loadPatientHistory() {
    const patients = LabDatabase.getAllPatients();
    const container = document.getElementById('patientHistory');
    container.innerHTML = '';
    patients.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    patients.slice(0, 10).forEach(patient => {
        const reports = LabDatabase.getPatientReports(patient.id);
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-info">
                <h4>${patient.name}</h4>
                <p>Lab #: ${patient.labNumber} | Date: ${patient.date}</p>
                <p>Doctor: ${patient.doctor} | Reports: ${reports.length}</p>
            </div>
            <div class="history-actions">
                <button class="btn-view" onclick="viewPatientReports(${JSON.stringify(patient).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i> View</button>
                <button class="btn-print" onclick="printPatientReport('${patient.id}')"><i class="fas fa-print"></i> Print</button>
                <button class="btn-edit" onclick="editPatient('${patient.id}')"><i class="fas fa-edit"></i> Edit</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function viewPatientReports(patient) {
    sessionStorage.setItem('currentPatient', JSON.stringify(patient));
    const reports = LabDatabase.getPatientReports(patient.id);
    if (reports.length > 0) {
        sessionStorage.setItem('currentReport', JSON.stringify(reports[0]));
    } else {
        sessionStorage.removeItem('currentReport');
    }
    
    const firstPanel = patient.panels && patient.panels[0];
    const targetPage = panelToPage[firstPanel] || 'cbc.html';
    window.location.href = targetPage;
}

function printPatientReport(patientId) {
    const patient = LabDatabase.getPatientById(patientId);
    const reports = LabDatabase.getPatientReports(patientId);
    if (reports.length === 0) {
        alert('No reports found for this patient');
        return;
    }
    const latestReport = reports[0];
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Report</title><link rel="stylesheet" href="cbc.css"></head>
        <body><div class="print-report">${latestReport.resultsHTML}</div>
        <script>window.onload=()=>{window.print();window.close()}</script></body>
    `);
    printWindow.document.close();
}

function editPatient(patientId) {
    const patient = LabDatabase.getPatientById(patientId);
    document.getElementById('labNumber').value = patient.labNumber;
    document.getElementById('regDate').value = patient.date;
    document.getElementById('patientName').value = patient.name;
    document.getElementById('gender').value = patient.gender;
    document.getElementById('doctor').value = patient.doctor;
    document.querySelectorAll('input[name="panel"]').forEach(cb => {
        cb.checked = patient.panels.includes(cb.value);
    });
    showSection('registration');
}

function resetForm() {
    document.getElementById('patientForm').reset();
    initializePatientPage();
    document.querySelectorAll('input[name="panel"]').forEach(cb => cb.checked = false);
}
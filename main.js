// ✅ Default kg/cm² Append Function
function formatPressure(value) {
  if (!value || value === "-" || value.toLowerCase().includes("atm")) return value;
  if (!value.toLowerCase().includes("kg/cm")) {
    return value + " kg/cm²";
  }
  return value;
}

// Load Units in Sidebar
function loadUnits() {
  const unitList = document.getElementById("unitList");
  unitList.innerHTML = "";

  const uniqueUnits = [...new Set(psvData.map(p => p.unit))];
  uniqueUnits.forEach(unit => {
    const totalCount = psvData.filter(p => p.unit === unit).length;
    const li = document.createElement("li");
    li.style.cssText =
      "background:#394b5a; padding:10px; margin-bottom:5px; border-radius:4px; color:white; display:flex; justify-content:space-between; cursor:pointer;";
    li.innerHTML = `<span>🏭 ${unit}</span> <span style="background:#1ab394; padding:3px 8px; border-radius:50%; font-size:12px;">${totalCount}</span>`;
    li.onclick = () => showPSVs(unit);
    unitList.appendChild(li);
  });
}

// Show PSV & TSV Tables
function showPSVs(unit) {
  document.getElementById("selectedUnit").innerText = `${unit} - PSV/TSV List`;

  const psvs = psvData.filter(p => p.unit === unit && p.psvNo.toUpperCase().includes("PSV"));
  const tsvs = psvData.filter(p => p.unit === unit && p.psvNo.toUpperCase().includes("TSV"));

  document.getElementById("psvSection").innerHTML = createTable(psvs, "PSV");
  document.getElementById("tsvSection").innerHTML = createTable(tsvs, "TSV");
}

// Create PSV/TSV Table
function createTable(data, type) {
  if (data.length === 0) return "";
  const headerColor = type === "PSV" ? "#007BFF" : "#FF9800";
  const totalCount = data.length; // ✅ Total count of PSV/TSV

  let html = `
    <div style="margin-bottom:20px;">
      <div style="background:${headerColor}; color:white; padding:8px; font-weight:bold; border-radius:5px 5px 0 0;">
        ${type} List <span style="float:right; background:white; color:${headerColor}; padding:2px 8px; border-radius:12px; font-size:12px;">
          Total: ${totalCount}
        </span>
      </div>
      <table style="width:100%; border-collapse:collapse; background:white;">
        <tr style="background:#f1f1f1;">
          <th style="padding:8px; border:1px solid #ddd;">${type} No</th>
          <th style="padding:8px; border:1px solid #ddd;">SP</th>
          <th style="padding:8px; border:1px solid #ddd;">Orifice</th>
          <th style="padding:8px; border:1px solid #ddd;">Type</th>
        </tr>`;

  data.forEach(item => {
    html += `
      <tr onclick="openModal('${item.psvNo}')" style="cursor:pointer;">
        <td style="padding:8px; border:1px solid #ddd;">${item.psvNo}</td>
        <td style="padding:8px; border:1px solid #ddd;">${formatPressure(item.sp)}</td>
        <td style="padding:8px; border:1px solid #ddd;">${item.orifice}</td>
        <td style="padding:8px; border:1px solid #ddd;">${item.type}</td>
      </tr>`;
  });

  html += `</table></div>`;
  return html;
}


// Search Units
function searchUnit() {
  const value = document.getElementById("searchBox").value.toLowerCase();
  const unitList = document.getElementById("unitList");
  unitList.innerHTML = "";

  const filteredUnits = [...new Set(psvData.map(p => p.unit))].filter(u =>
    u.toLowerCase().includes(value)
  );

  filteredUnits.forEach(unit => {
    const totalCount = psvData.filter(p => p.unit === unit).length;
    const li = document.createElement("li");
    li.style.cssText =
      "background:#394b5a; padding:10px; margin-bottom:5px; border-radius:4px; color:white; display:flex; justify-content:space-between; cursor:pointer;";
    li.innerHTML = `<span>🏭 ${unit}</span> <span style="background:#1ab394; padding:3px 8px; border-radius:50%; font-size:12px;">${totalCount}</span>`;
    li.onclick = () => showPSVs(unit);
    unitList.appendChild(li);
  });
}

// Modal Logic
// Modal Logic
function openModal(psvNo) {
  const loader = document.getElementById("modalLoader");
  const modalContent = document.querySelector("#psvModal .modal-content");

  // ✅ Show loader & hide modal content initially
  loader.style.display = "flex";
  modalContent.style.display = "none";
  document.getElementById("psvModal").style.display = "flex";
  document.body.style.overflow = "hidden";  // ✅ Lock background scroll

  // ✅ Delay to simulate loading effect (2 seconds)
  setTimeout(() => {
    const psv = psvData.find(p => p.psvNo === psvNo);

    document.getElementById("modalTitle").innerText = psv.psvNo;
    document.getElementById("modalUnit").innerText = psv.unit;
    document.getElementById("modalCDSP").innerText = `Cold Differential Test Pressure: ${formatPressure(psv.cdsp)}`;
    document.getElementById("modalSP").innerText = `Set Pressure: ${formatPressure(psv.sp)}`;
    document.getElementById("modalBP").innerText = psv.bp;
    document.getElementById("modalOrifice").innerText = psv.orifice;
    document.getElementById("modalType").innerText = psv.type;

    const typeImage = {
      "Conventional": "images/conventional.jpg",
      "Balanced Bellow": "images/balanced-bellow.jpg",
      "Pilot Operated": "images/pilot-operated.jpg"
    };
    document.getElementById("modalImage").src = typeImage[psv.type] || "images/default.jpg";

    // ✅ Hide loader & show modal content
    loader.style.display = "none";
    modalContent.style.display = "flex";
  }, 2000);
}

function closeModal() {
  document.getElementById("psvModal").style.display = "none";
  document.body.style.overflow = "auto";  // ✅ Unlock background scroll
}


// Calibration Redirect
function openCalibration() {
  window.location.href = "calibration.html";
}

// Initialize Dashboard
loadUnits();

// PSV/TSV Search Filter
function filterPSV() {
  const keyword = document.getElementById("psvSearch").value.toLowerCase();
  const selectedUnit = document.getElementById("selectedUnit").innerText.split(" - ")[0];

  if (!selectedUnit || selectedUnit === "Select a Unit") return;

  const filteredPSVs = psvData.filter(p =>
    p.unit === selectedUnit &&
    p.psvNo.toUpperCase().includes("PSV") &&
    (
      p.psvNo.toLowerCase().includes(keyword) ||
      p.sp.toLowerCase().includes(keyword) ||
      p.orifice.toLowerCase().includes(keyword) ||
      p.type.toLowerCase().includes(keyword)
    )
  );

  const filteredTSVs = psvData.filter(p =>
    p.unit === selectedUnit &&
    p.psvNo.toUpperCase().includes("TSV") &&
    (
      p.psvNo.toLowerCase().includes(keyword) ||
      p.sp.toLowerCase().includes(keyword) ||
      p.orifice.toLowerCase().includes(keyword) ||
      p.type.toLowerCase().includes(keyword)
    )
  );

  document.getElementById("psvSection").innerHTML = createTable(filteredPSVs, "PSV");
  document.getElementById("tsvSection").innerHTML = createTable(filteredTSVs, "TSV");
}

// ✅ Local Storage Initialization
let reports = JSON.parse(localStorage.getItem("psvReports")) || [];
let editIndex = null;

const dashboard = document.getElementById("dashboard");
const formPage = document.getElementById("formPage");
const reportList = document.getElementById("reportList");

// ✅ Render Reports in Dashboard Table
function renderReports() {
  reportList.innerHTML = "";
  reports.forEach((r, i) => {
    reportList.innerHTML += `
      <tr>
        <td>${r.tagNo}</td>
        <td>${r.date}</td>
        <td>${r.unit}</td>
        <td>
          <button onclick="viewReport(${i})">View/Edit</button>
          <button style="background:#dc3545" onclick="deleteReport(${i})">Delete</button>
        </td>
      </tr>`;
  });
}
renderReports();

// ✅ Add New Report Button
document.getElementById("addNewBtn").addEventListener("click", () => {
  formPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
  editIndex = null;
  clearForm();
});

// ✅ Save Report
document.getElementById("saveBtn").addEventListener("click", () => {
  const newReport = getFormData();
  if (!newReport.tagNo) {
    alert("⚠️ Tag No is required!");
    return;
  }
  if (editIndex !== null) {
    reports[editIndex] = newReport;
  } else {
    reports.push(newReport);
  }
  localStorage.setItem("psvReports", JSON.stringify(reports));
  alert("✅ Report Saved!");
  formPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  renderReports();
});

// ✅ View/Edit Report
function viewReport(index) {
  editIndex = index;
  fillForm(reports[index]);
  formPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

// ✅ Delete Report
function deleteReport(index) {
  if (confirm("Delete this report?")) {
    reports.splice(index, 1);
    localStorage.setItem("psvReports", JSON.stringify(reports));
    renderReports();
  }
}

// ✅ Back to Dashboard
document.getElementById("backBtn").addEventListener("click", () => {
  formPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

// ✅ Get Form Data
function getFormData() {
  return {
    bookNo: bookNo.value, slNo: slNo.value, date: date.value, time: time.value, unit: unit.value,
    tagNo: tagNo.value, type: type.value, manufacturer: manufacturer.value, service: service.value,
    workOrder: workOrder.value, woDate: woDate.value, changeSet: changeSet.value, authRef: authRef.value,
    coldDiff: coldDiff.value, backPressure: backPressure.value, setPressure: setPressure.value, orifice: orifice.value,
    testingMedium: testingMedium.value, reason: reason.value, repairs: repairs.value,
    asReceived: asReceived.value, setAt: setAt.value, holdingTime: holdingTime.value, bubbleMax: bubbleMax.value,
    bubbleObs: bubbleObs.value, status: status.value, remarks: remarks.value, sealed: sealed.value,
    witness: witness.value, nextDue: nextDue.value, signature: signature.value, name: name.value, signDate: signDate.value
  };
}

// ✅ Fill Form for Edit
function fillForm(data) {
  for (let key in data) {
    if (document.getElementById(key)) {
      document.getElementById(key).value = data[key];
    }
  }
}

// ✅ Clear Form for New Entry
function clearForm() {
  document.querySelectorAll("#formPage input, #formPage select").forEach(el => el.value = "");
}

// ✅ Excel Bulk Upload (Improved)
document.getElementById("excelUploadInput").addEventListener("change", handleExcelUpload);

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    let uploadedCount = 0;

    jsonData.forEach(row => {
      let newReport = {
        tagNo: row.tagNo || "",
        date: row.date || "",
        unit: row.unit || "",
        bookNo: row.bookNo || "",
        slNo: row.slNo || "",
        type: row.type || "",
        manufacturer: row.manufacturer || "",
        service: row.service || "",
        workOrder: row.workOrder || "",
        woDate: row.woDate || "",
        changeSet: row.changeSet || "",
        authRef: row.authRef || "",
        coldDiff: row.coldDiff || "",
        backPressure: row.backPressure || "",
        setPressure: row.setPressure || "",
        orifice: row.orifice || "",
        testingMedium: row.testingMedium || "",
        reason: row.reason || "",
        repairs: row.repairs || "",
        asReceived: row.asReceived || "",
        setAt: row.setAt || "",
        holdingTime: row.holdingTime || "",
        bubbleMax: row.bubbleMax || "",
        bubbleObs: row.bubbleObs || "",
        status: row.status || "",
        remarks: row.remarks || "",
        sealed: row.sealed || "",
        witness: row.witness || "",
        nextDue: row.nextDue || "",
        signature: row.signature || "",
        name: row.name || "",
        signDate: row.signDate || ""
      };

      // ✅ Optional Duplicate Prevention (Uncomment if needed)
      // if (!reports.some(r => r.tagNo === newReport.tagNo)) {
      reports.push(newReport);
      uploadedCount++;
      // }
    });

    localStorage.setItem("psvReports", JSON.stringify(reports));
    renderReports();
    alert(`✅ Excel Bulk Upload Successful!\nTotal Reports: ${reports.length}\nNewly Uploaded: ${uploadedCount}`);
    event.target.value = "";
  };

  reader.readAsArrayBuffer(file);
}

// ✅ Download Template Button
document.getElementById("downloadTemplateBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = "psv_bulk_template.xlsx"; // File should be in same folder as index.html
  link.download = "psv_bulk_template.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

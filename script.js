let reports = JSON.parse(localStorage.getItem("psvReports")) || [];
let editIndex = null;
const dashboard = document.getElementById("dashboard");
const formPage = document.getElementById("formPage");
const reportList = document.getElementById("reportList");

function renderReports() {
  reportList.innerHTML = "";
  reports.forEach((r, i) => {
    reportList.innerHTML += `<tr><td>${r.tagNo}</td><td>${r.date}</td><td>${r.unit}</td>
      <td><button onclick="viewReport(${i})">View/Edit</button>
      <button style="background:#dc3545" onclick="deleteReport(${i})">Delete</button></td></tr>`;
  });
}
renderReports();

document.getElementById("addNewBtn").addEventListener("click", () => {
  formPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
  editIndex = null;
  clearForm();
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const newReport = getFormData();
  if (editIndex !== null) {reports[editIndex] = newReport;} else {reports.push(newReport);}
  localStorage.setItem("psvReports", JSON.stringify(reports));
  alert("Report Saved!");
  formPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  renderReports();
});

function viewReport(index) {
  editIndex = index;
  fillForm(reports[index]);
  formPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

function deleteReport(index) {
  if (confirm("Delete this report?")) {
    reports.splice(index, 1);
    localStorage.setItem("psvReports", JSON.stringify(reports));
    renderReports();
  }
}

document.getElementById("backBtn").addEventListener("click", () => {
  formPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

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

function fillForm(data) {
  for (let key in data) {if (document.getElementById(key)) {document.getElementById(key).value = data[key];}}
}

function clearForm() {
  document.querySelectorAll("#formPage input, #formPage select").forEach(el => el.value = "");
}

// ✅ Excel Bulk Upload
document.getElementById("excelUploadInput").addEventListener("change", handleExcelUpload);
function handleExcelUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    jsonData.forEach(row => {
      let newReport = {};
      Object.keys(row).forEach(k => {newReport[k] = row[k] || "";});
      reports.push(newReport);
    });
    localStorage.setItem("psvReports", JSON.stringify(reports));
    renderReports();
    alert("✅ Excel Bulk Upload Successful! Total Reports: " + reports.length);
    event.target.value = "";
  };
  reader.readAsArrayBuffer(file);
}

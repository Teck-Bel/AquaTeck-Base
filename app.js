window.onload = function () {
  const setupDiv = document.getElementById("setup");
  const loginDiv = document.getElementById("login");

  if (!setupDiv || !loginDiv) return;

  const hasCode = localStorage.getItem("ACCESS_CODE");

  if (!hasCode) {
    setupDiv.style.display = "block";
    loginDiv.style.display = "none";
  } else {
    setupDiv.style.display = "none";
    loginDiv.style.display = "block";
  }
};

function setCode() {
  const newCodeInput = document.getElementById("newCode");
  const setupDiv = document.getElementById("setup");
  const loginDiv = document.getElementById("login");

  if (!newCodeInput) return;

  const newCode = newCodeInput.value;

  if (!newCode || newCode.length < 4) {
    alert("Code moet minstens 4 tekens zijn");
    return;
  }

  localStorage.setItem("ACCESS_CODE", newCode);
  alert("Toegangscode opgeslagen");

  if (setupDiv && loginDiv) {
    setupDiv.style.display = "none";
    loginDiv.style.display = "block";
  }
}

function checkCode() {
  const input = document.getElementById("codeInput").value;
  const storedCode = localStorage.getItem("ACCESS_CODE");

  if (input === storedCode) {
    localStorage.setItem("authenticated", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Foute code";
  }
}

function logout() {
  localStorage.removeItem("authenticated");
  window.location.href = "index.html";
}

/* ===== DASHBOARD ===== */

let map;
let marker;

function loadDashboard() {
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "index.html";
    return;
  }

  // Statusvelden
  document.getElementById("gpsSpeed").innerText = boatData.gpsSpeed;
  document.getElementById("logSpeed").innerText = boatData.logSpeed;
  document.getElementById("battery").innerText = boatData.battery;
  document.getElementById("charger").innerText = boatData.charger;
  document.getElementById("vhf").innerText = boatData.vhf;

  // Locatie
  const latlng = boatData.locationLatLng;
  document.getElementById("location").innerText =
    `${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`;

  // Kaart initialiseren
  map = L.map("map").setView(latlng, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  marker = L.marker(latlng)
    .addTo(map)
    .bindPopup("Vaartuig")
    .openPopup();

  // Start simulatie
  simulateLiveData();
}

/* ===== LIVE DATA SIMULATIE ===== */

function simulateLiveData() {
  setInterval(() => {
    // Beweging simuleren
    boatData.locationLatLng[0] += (Math.random() - 0.5) / 5000;
    boatData.locationLatLng[1] += (Math.random() - 0.5) / 5000;

    // Snelheden
    boatData.gpsSpeed = (Math.random() * 6).toFixed(1);
    boatData.logSpeed = (Math.random() * 6).toFixed(1);

    // Update scherm
    document.getElementById("gpsSpeed").innerText = boatData.gpsSpeed;
    document.getElementById("logSpeed").innerText = boatData.logSpeed;

    const latlng = boatData.locationLatLng;
    document.getElementById("location").innerText =
      `${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`;

    // Marker verplaatsen
    marker.setLatLng(latlng);
  }, 2000);
}

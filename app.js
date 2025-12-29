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

/* ===== FIREBASE CONFIGURATIE ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDngxA1a8VqzCPATS-8KD3BQxdHqQ3ulFc",
  authDomain: "base-d7d9f.firebaseapp.com",
  databaseURL: "https://base-d7d9f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "base-d7d9f",
  storageBucket: "base-d7d9f.firebasestorage.app",
  messagingSenderId: "923720459274",
  appId: "1:923720459274:web:d87698788e8915450c2bf3"
};

// Firebase initialiseren
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadDashboard() {
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "index.html";
    return;
  }

  // Kaart initialiseren met default locatie
  const defaultLatLng = [51.2194, 4.4025]; // Bijvoorbeeld Antwerpen
  map = L.map("map").setView(defaultLatLng, 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  marker = L.marker(defaultLatLng).addTo(map).bindPopup("Vaartuig").openPopup();

  // Firebase realtime listener
  db.ref('/metingen').limitToLast(1).on('value', snapshot => {
    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data);
      const laatste = data[keys[keys.length - 1]];

      // Update dashboard cards
      document.getElementById("location").innerText = laatste.locatie;
      document.getElementById("logSpeed").innerText = laatste.snelheid;
      document.getElementById("vhf").innerText = laatste.kanaal;

      // Andere velden kun je invullen als je data beschikbaar is
      // document.getElementById("gpsSpeed").innerText = laatste.gpsSpeed;
      // document.getElementById("battery").innerText = laatste.battery;
      // document.getElementById("charger").innerText = laatste.charger;

      // Marker bijwerken (als je echte Lat/Lng van Arduino hebt)
      // Bijvoorbeeld: laatste.lat, laatste.lng
      // let latlng = [parseFloat(laatste.lat), parseFloat(laatste.lng)];
      // marker.setLatLng(latlng);
      // map.setView(latlng, map.getZoom());
    }
  });
}

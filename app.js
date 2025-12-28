const ACCESS_CODE = "1234"; // later instelbaar

function checkCode() {
  const input = document.getElementById("codeInput").value;

  if (input === ACCESS_CODE) {
    localStorage.setItem("authenticated", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Foute code";
  }
}

function loadDashboard() {
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("location").innerText = boatData.location;
  document.getElementById("gpsSpeed").innerText = boatData.gpsSpeed;
  document.getElementById("logSpeed").innerText = boatData.logSpeed;
  document.getElementById("battery").innerText = boatData.battery;
  document.getElementById("charger").innerText = boatData.charger;
  document.getElementById("vhf").innerText = boatData.vhf;
}

function logout() {
  localStorage.removeItem("authenticated");
  window.location.href = "index.html";
}

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const bookingForm = document.getElementById("bookingForm");
const logoutButton = document.getElementById("logoutBtn");

const whatsappNumber = "918884822459";

menuButton.addEventListener("click", function () {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".menu-link").forEach(function (link) {
  link.addEventListener("click", function () {
    document.querySelectorAll(".menu-link").forEach(function (item) {
      item.classList.remove("active");
    });

    link.classList.add("active");
    closeSidebar();
  });
});

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const pickup = document.getElementById("pickup").value.trim();
  const drop = document.getElementById("drop").value.trim();
  const tripDate = document.getElementById("tripDate").value;
  const tripTime = document.getElementById("tripTime").value;
  const tripType = document.getElementById("tripType").value;
  const vehicle = document.getElementById("vehicle").value;

  if (!pickup || !drop || !tripDate || !tripTime) {
    alert("Please enter all trip details.");
    return;
  }

  const message = `
Hello Rejoice Travels,

I would like to book a taxi.

Pickup: ${pickup}
Drop: ${drop}
Date: ${tripDate}
Time: ${tripTime}
Trip Type: ${tripType}
Vehicle: ${vehicle}

Please confirm the availability and estimated fare.
  `.trim();

  const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
});

logoutButton.addEventListener("click", function () {
  const shouldLogout = confirm("Are you sure you want to logout?");

  if (shouldLogout) {
    window.location.href = "index.html";
  }
});

const dateInput = document.getElementById("tripDate");
const today = new Date().toISOString().split("T")[0];

dateInput.min = today;


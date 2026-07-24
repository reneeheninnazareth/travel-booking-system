// script2.js

(() => {
  const WHATSAPP_NUMBER = "918884822459";
  const BASE_FARE = 50;

  const RATES = {
    local: {
      perKm: 14,
      perMinute: 1,
      minimumFare: 100
    },
    outstation: {
      perKm: 11,
      perMinute: 0,
      minimumFare: 500
    },
    airport: {
      perKm: 16,
      perMinute: 0.5,
      minimumFare: 400
    }
  };

  let map;
  let pickupMarker;
  let dropMarker;
  let routeLine;

  function showError(message) {
    const errorElement = document.getElementById("formError");

    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }

  function clearError() {
    const errorElement = document.getElementById("formError");

    if (!errorElement) return;

    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  }

  function initMap() {
    if (typeof L === "undefined") {
      showError(
        "Leaflet map library did not load. Check your internet connection."
      );
      return;
    }

    const mapElement = document.getElementById("map");

    if (!mapElement) {
      console.error('Element with id="map" was not found.');
      return;
    }

    map = L.map("map", {
      center: [13.3525, 74.7864],
      zoom: 10,
      zoomControl: true
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

    setTimeout(() => {
      map.invalidateSize(true);
    }, 300);

    setTimeout(() => {
      map.invalidateSize(true);
    }, 1000);

    window.addEventListener("resize", () => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize(true);
        }, 150);
      }
    });
  }

  async function geocode(place) {
    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(place)}`;

    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en"
      }
    });

    if (!response.ok) {
      throw new Error("Location search failed.");
    }

    const data = await response.json();

    if (!data.length) {
      return null;
    }

    return {
      lat: Number.parseFloat(data[0].lat),
      lon: Number.parseFloat(data[0].lon)
    };
  }

  async function getRoadRoute(pickup, drop) {
    const url =
      "https://router.project-osrm.org/route/v1/driving/" +
      `${pickup.lon},${pickup.lat};${drop.lon},${drop.lat}` +
      "?overview=full&geometries=geojson";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Route service failed.");
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    return data.routes[0];
  }

  function calculateEstimatedFare(
    distanceKm,
    durationMinutes,
    tripType
  ) {
    const rate = RATES[tripType];

    const distanceCharge = distanceKm * rate.perKm;
    const timeCharge = durationMinutes * rate.perMinute;

    const calculatedFare =
      BASE_FARE + distanceCharge + timeCharge;

    return Math.round(
      Math.max(calculatedFare, rate.minimumFare)
    );
  }

  function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    }

    return `${hours} hr ${minutes} min`;
  }

  function clearOldRoute() {
    if (!map) return;

    if (pickupMarker) {
      map.removeLayer(pickupMarker);
      pickupMarker = null;
    }

    if (dropMarker) {
      map.removeLayer(dropMarker);
      dropMarker = null;
    }

    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }
  }

  function drawRoadRoute(geometry, pickup, drop) {
    if (!map) return;

    clearOldRoute();

    pickupMarker = L.marker([
      pickup.lat,
      pickup.lon
    ])
      .addTo(map)
      .bindPopup("Pickup Location");

    dropMarker = L.marker([
      drop.lat,
      drop.lon
    ])
      .addTo(map)
      .bindPopup("Drop Location");

    const routeCoordinates = geometry.coordinates.map(
      ([longitude, latitude]) => [
        latitude,
        longitude
      ]
    );

    routeLine = L.polyline(routeCoordinates, {
      color: "#8a6d3b",
      weight: 5,
      opacity: 0.9
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize(true);

      map.fitBounds(routeLine.getBounds(), {
        padding: [40, 40]
      });
    }, 200);
  }

  async function calculateFare() {
    clearError();

    const pickupInput = document.getElementById("pickup");
    const dropInput = document.getElementById("drop");
    const tripTypeInput = document.getElementById("tripType");
    const button = document.getElementById("calcFareBtn");

    const pickupText = pickupInput.value.trim();
    const dropText = dropInput.value.trim();
    const tripType = tripTypeInput.value;

    if (!pickupText || !dropText) {
      showError(
        "Please enter both pickup and drop locations."
      );
      return;
    }

    if (!RATES[tripType]) {
      showError("Please select a valid trip type.");
      return;
    }

    button.textContent = "Calculating...";
    button.disabled = true;

    try {
      const [pickup, drop] = await Promise.all([
        geocode(pickupText),
        geocode(dropText)
      ]);

      if (!pickup || !drop) {
        showError(
          "Location not found. Add city, district or state."
        );
        return;
      }

      const route = await getRoadRoute(
        pickup,
        drop
      );

      if (!route) {
        showError(
          "A driving route could not be found."
        );
        return;
      }

      const distanceKm = route.distance / 1000;
      const durationMinutes = Math.round(
        route.duration / 60
      );

      const fare = calculateEstimatedFare(
        distanceKm,
        durationMinutes,
        tripType
      );

      document.getElementById(
        "distanceOut"
      ).textContent = `${distanceKm.toFixed(1)} km`;

      document.getElementById(
        "timeOut"
      ).textContent = formatDuration(
        durationMinutes
      );

      document.getElementById(
        "fareOut"
      ).textContent = `₹${fare}`;

      document.getElementById(
        "fareResult"
      ).classList.remove("hidden");

      drawRoadRoute(
        route.geometry,
        pickup,
        drop
      );
    } catch (error) {
      console.error(error);

      showError(
        "Unable to calculate the route. Check your internet connection."
      );
    } finally {
      button.textContent =
        "Calculate Route and Fare";

      button.disabled = false;
    }
  }

  function sendBookingOnWhatsApp() {
    clearError();

    const pickup = document
      .getElementById("pickup")
      .value.trim();

    const drop = document
      .getElementById("drop")
      .value.trim();

    const tripType = document
      .getElementById("tripType")
      .value;

    const pickupDate = document
      .getElementById("pickupDate")
      .value;

    const customerName = document
      .getElementById("customerName")
      .value.trim();

    const customerPhone = document
      .getElementById("customerPhone")
      .value.trim();

    const fareResult =
      document.getElementById("fareResult");

    if (
      !pickup ||
      !drop ||
      !customerName ||
      !customerPhone
    ) {
      showError(
        "Please fill in pickup, drop, name and phone number."
      );
      return;
    }

    const cleanPhone =
      customerPhone.replace(/\D/g, "");

    if (
      cleanPhone.length < 10 ||
      cleanPhone.length > 15
    ) {
      showError(
        "Please enter a valid phone number."
      );
      return;
    }

    if (
      fareResult.classList.contains("hidden")
    ) {
      showError(
        "Please calculate the route and fare first."
      );
      return;
    }

    const distance = document
      .getElementById("distanceOut")
      .textContent;

    const time = document
      .getElementById("timeOut")
      .textContent;

    const fare = document
      .getElementById("fareOut")
      .textContent;

    const message =
      `New Booking Request - Rejoice Transport\n\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Pickup: ${pickup}\n` +
      `Drop: ${drop}\n` +
      `Trip Type: ${tripType}\n` +
      `Pickup Date/Time: ${pickupDate || "Not specified"}\n` +
      `Distance: ${distance}\n` +
      `Estimated Time: ${time}\n` +
      `Estimated Fare: ${fare}`;

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappURL,
      "_blank",
      "noopener"
    );
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initMap();

      const calculateButton =
        document.getElementById("calcFareBtn");

      const whatsappButton =
        document.getElementById("sendBookingBtn");

      if (calculateButton) {
        calculateButton.addEventListener(
          "click",
          calculateFare
        );
      }

      if (whatsappButton) {
        whatsappButton.addEventListener(
          "click",
          sendBookingOnWhatsApp
        );
      }
    }
  );
})();

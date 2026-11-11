
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#saved-trip-form");
  const tripList = document.querySelector("#saved-trip-list");
  const feedback = document.querySelector("#trip-manager-feedback");
  const saveButton = document.querySelector("#trip-save-button");
  const cancelButton = document.querySelector("#cancel-edit");
  const budgetChart = document.querySelector("#budget-chart");

  let trips = getSavedTrips();     
  let editingId = null;           

  function showMessage(text, isError) {
    feedback.textContent = text;
    feedback.className = "alert mt-3 " + (isError ? "alert-danger" : "alert-success");
    feedback.hidden = false;
  }

  function fieldValue(id) {
    return document.getElementById(id).value.trim();
  }

  function makeTripFromForm() {
    return new TripRecord({
      id: editingId,
      origin: fieldValue("trip-origin"),
      destination: fieldValue("trip-destination"),
      departure: fieldValue("trip-departure"),
      returnDate: fieldValue("trip-return"),
      travellers: fieldValue("trip-people"),
      budget: fieldValue("trip-budget"),
      purpose: fieldValue("trip-purpose"),
      notes: fieldValue("trip-notes")
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    saveButton.textContent = "Save trip";
    cancelButton.hidden = true;
  }

  function addText(parent, tagName, text, cssClass) {
    const element = document.createElement(tagName);
    element.textContent = text;
    if (cssClass) element.className = cssClass;
    parent.appendChild(element);
    return element;
  }

  function renderDashboard() {
    let peopleTotal = 0;
    let budgetTotal = 0;

    trips.forEach(function (trip) {
      peopleTotal += trip.travellers;
      budgetTotal += trip.budget;
    });

    document.querySelector("#stat-trips").textContent = trips.length;
    document.querySelector("#stat-travellers").textContent = peopleTotal;
    document.querySelector("#stat-budget").textContent = formatPrice(budgetTotal);
    budgetChart.innerHTML = "";

    if (trips.length === 0) {
      addText(budgetChart, "p", "Save a trip to see the budget chart.", "text-secondary");
      return;
    }

    let maxBudget = 1;
    trips.forEach(function (trip) {
      if (trip.budget > maxBudget) maxBudget = trip.budget;
    });

    trips.forEach(function (trip) {
      const row = document.createElement("div");
      row.className = "budget-bar-row";
      addText(row, "span", trip.destination, "budget-bar-label");

      const track = document.createElement("div");
      track.className = "budget-bar-track";
      const bar = document.createElement("div");
      bar.className = "budget-bar-fill";
      bar.style.width = (trip.budget / maxBudget * 100) + "%";
      bar.setAttribute("role", "img");
      bar.setAttribute("aria-label", trip.destination + " budget " + formatPrice(trip.budget));
      track.appendChild(bar);
      row.appendChild(track);

      addText(row, "span", formatPrice(trip.budget), "budget-bar-amount");
      budgetChart.appendChild(row);
    });
  }

  function renderTrips() {
    tripList.innerHTML = "";

    if (trips.length === 0) {
      addText(tripList, "p", "No trips yet. Add your first trip using the form.", "text-secondary");
    }

    trips.forEach(function (trip) {
      const card = document.createElement("article");
      card.className = "feature-card p-3 mb-3";
      addText(card, "h3", trip.origin + " → " + trip.destination, "h5");
      addText(card, "p",
        trip.departure + (trip.returnDate ? " to " + trip.returnDate : "") +
        " · " + trip.getDurationDays() + " day(s) · " + trip.travellers +
        " traveller(s) · " + trip.purpose, "mb-1");
      addText(card, "p",
        "Total budget: " + formatPrice(trip.budget) +
        " · Per person: " + formatPrice(Math.round(trip.getBudgetPerPerson())), "small mb-1");
      if (trip.notes) addText(card, "p", trip.notes, "small text-secondary");

      const actions = document.createElement("div");
      actions.className = "d-flex flex-wrap gap-2 mt-2";

      const editButton = addText(actions, "button", "Edit", "btn btn-sm btn-outline-success rounded-pill");
      editButton.type = "button";
      editButton.dataset.action = "edit";
      editButton.dataset.id = trip.id;

      const deleteButton = addText(actions, "button", "Delete", "btn btn-sm btn-outline-danger rounded-pill");
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = trip.id;

      const weatherLink = addText(actions, "a", "Check weather", "btn btn-sm btn-outline-success rounded-pill");
      weatherLink.href = "weather.html?city=" + encodeURIComponent(trip.destination);

      card.appendChild(actions);
      tripList.appendChild(card);
    });

    renderDashboard();
  }

  function reportSaving(successText) {
    if (setSavedTrips(trips)) {
      showMessage(successText, false);
    } else {
      showMessage("Changes are visible now but could not be saved in this browser.", true);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const trip = makeTripFromForm();

    if (!trip.isValid()) {
      showMessage("Check the cities, dates, travellers (1–10), budget (0–50,000), and notes (max 240 characters).", true);
      return;
    }

    if (editingId === null) {
      trips.push(trip);
      reportSaving("Trip created and saved in this browser.");
    } else {
      for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === editingId) {
          trips[i] = trip;
          break;
        }
      }
      reportSaving("Trip updated and saved in this browser.");
    }

    resetForm();
    renderTrips();
  });

  tripList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const trip = trips.find(function (item) { return item.id === button.dataset.id; });
    if (!trip) return;

    if (button.dataset.action === "delete") {
      if (!window.confirm("Delete this saved trip?")) return;
      trips = trips.filter(function (item) { return item.id !== trip.id; });
      if (editingId === trip.id) resetForm();
      reportSaving("Trip deleted.");
      renderTrips();
      return;
    }

    editingId = trip.id;
    const fields = {
      "trip-origin": trip.origin, "trip-destination": trip.destination,
      "trip-departure": trip.departure, "trip-return": trip.returnDate,
      "trip-people": trip.travellers, "trip-budget": trip.budget,
      "trip-purpose": trip.purpose, "trip-notes": trip.notes
    };
    for (const id in fields) {
      document.getElementById(id).value = fields[id];
    }
    saveButton.textContent = "Update trip";
    cancelButton.hidden = false;
    feedback.hidden = true;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  cancelButton.addEventListener("click", resetForm);

  document.querySelector("#clear-saved-trips").addEventListener("click", function () {
    if (trips.length === 0 || !window.confirm("Delete ALL saved trips?")) return;
    trips = [];
    resetForm();
    reportSaving("All saved trips cleared.");
    renderTrips();
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("from") === "plan") {
    const fields = {
      origin: "trip-origin", destination: "trip-destination",
      departure: "trip-departure", returnDate: "trip-return",
      travellers: "trip-people", budget: "trip-budget", purpose: "trip-purpose"
    };
    for (const key in fields) {
      if (params.has(key)) document.getElementById(fields[key]).value = params.get(key);
    }
    showMessage("Trip details copied from Plan. Click Save trip to store them here.", false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  renderTrips();
});

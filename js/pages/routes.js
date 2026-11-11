document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#route-body");
  const directCheckbox = document.querySelector("#direct-only");
  const sortSelect = document.querySelector("#sort-routes");
  const priceRange = document.querySelector("#max-price");
  const priceOutput = document.querySelector("#max-price-value");
  const resultCount = document.querySelector("#result-count");
  const shortlistBox = document.querySelector("#shortlist");
  const shortlistTotal = document.querySelector("#shortlist-total");
  const travellersInput = document.querySelector("#route-travellers");

  const params = new URLSearchParams(window.location.search);
  
  if (params.has("direct")) {
  directCheckbox.checked = params.get("direct") === "yes";
  }

  if (params.has("hotels")) {
  const showHotels = params.get("hotels") === "yes";
  document.querySelector("#route-table")
    .classList.toggle("hide-hotels", !showHotels);
  }

  document.querySelector("#nearby-recommendations").hidden =
  params.get("nearby") !== "yes";

  document.querySelector("#buffer-reminder").hidden =
  params.get("buffer") !== "yes";

  if (params.get("travellers")) {
    travellersInput.value = params.get("travellers");
  }
  if (params.get("budget")) {
    const perPerson = Math.round(Number(params.get("budget")) / Number(travellersInput.value));
    priceRange.value = Math.min(Math.max(perPerson, priceRange.min), priceRange.max);
  }

    let shortlist = loadData("nomadica-shortlist", [])
    .filter(id => routeOptions.some(route => route.id === id));


  function calculateTripTotal(pricePerPerson, travellers) {
    return pricePerPerson * travellers;
  }

  function getVisibleRoutes() {
    const maxPrice = Number(priceRange.value);
    const visible = routeOptions.filter(function (route) {
      const passesDirect = !directCheckbox.checked || route.stops === 0;
      return passesDirect && route.price <= maxPrice;
    });

    if (sortSelect.value === "price-low") {
      visible.sort(function (a, b) { return a.price - b.price; });
    } else if (sortSelect.value === "price-high") {
      visible.sort(function (a, b) { return b.price - a.price; });
    } else if (sortSelect.value === "type") {
      visible.sort(function (a, b) { return a.type.localeCompare(b.type); });
    }
    return visible;
  }

  function createRouteRow(route) {
    const row = document.createElement("tr");
    const isSaved = shortlist.includes(route.id);
    const stopsText = route.stops === 0 ? "direct" : route.stops + " stop";

    row.innerHTML =
      "<th scope='row'>" + route.type + "</th>" +
      "<td>" + route.flight + " · " + route.duration + " · " + stopsText + "</td>" +
      "<td>" + route.hotel + "</td>" +
      "<td>" + formatPrice(route.price) + " per person</td>" +
      "<td></td>";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm rounded-pill " + (isSaved ? "btn-nomad" : "btn-outline-success");
    button.textContent = isSaved ? "✓ Saved" : "+ Shortlist";
    button.dataset.id = route.id;
    row.lastElementChild.appendChild(button);
    return row;
  }

  function renderTable() {
      const visible = getVisibleRoutes();
      tableBody.innerHTML = "";

      for (const route of visible) {
        tableBody.appendChild(createRouteRow(route));
      }

      if (visible.length === 0) {
        
  const columnCount = document.querySelector("#route-table")
    .classList.contains("hide-hotels") ? 4 : 5;

  tableBody.innerHTML =
    "<tr><td colspan='" + columnCount +
    "' class='text-center py-4'>No routes match these filters. Try a higher price.</td></tr>";

    }
    resultCount.textContent = visible.length + " of " + routeOptions.length + " options shown";
    priceOutput.textContent = formatPrice(Number(priceRange.value));
  }

  function renderShortlist() {
    const travellers = Number(travellersInput.value) || 1;
    let cheapest = null;
    shortlistBox.innerHTML = "";

    shortlist.forEach(function (id) {
      const route = routeOptions.find(function (item) { return item.id === id; });
      if (!route) { return; }

      const total = calculateTripTotal(route.price, travellers);
      if (cheapest === null || total < cheapest) { cheapest = total; }

      const item = document.createElement("li");
      item.className = "shortlist-item";
      item.innerHTML =
        "<span><strong>" + route.type + "</strong> · " + route.flight +
        "<br><small>" + formatPrice(total) + " for " + travellers + " traveller(s)</small></span>";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn btn-sm btn-link text-danger remove-route";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", "Remove " + route.type + " route");
      removeButton.dataset.id = route.id;
      item.appendChild(removeButton);
      shortlistBox.appendChild(item);
    });

    if (shortlist.length === 0) {
      shortlistBox.innerHTML = "<li class='text-secondary'>Your shortlist is empty. Click “+ Shortlist” in the table.</li>";
      shortlistTotal.textContent = "";
    } else {
      shortlistTotal.textContent = "Cheapest saved option: " + formatPrice(cheapest) + " in total";
    }
  }

  function toggleShortlist(id) {
    if (shortlist.includes(id)) {
      shortlist = shortlist.filter(function (savedId) { return savedId !== id; });
      showToast("Route removed from shortlist");
    } else {
      shortlist.push(id);
      showToast("Route added to shortlist");
    }
    saveData("nomadica-shortlist", shortlist);
    renderTable();
    renderShortlist();
  }


  directCheckbox.addEventListener("change", renderTable);
  sortSelect.addEventListener("change", renderTable);
  priceRange.addEventListener("input", renderTable);
  travellersInput.addEventListener("input", renderShortlist);

  tableBody.addEventListener("click", function (event) {
    if (event.target.matches("button[data-id]")) {
      toggleShortlist(Number(event.target.dataset.id));
    }
  });

  shortlistBox.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-route")) {
      toggleShortlist(Number(event.target.dataset.id));
    }
  });

  renderTable();
  renderShortlist();
});document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#route-body");
  const directCheckbox = document.querySelector("#direct-only");
  const sortSelect = document.querySelector("#sort-routes");
  const priceRange = document.querySelector("#max-price");
  const priceOutput = document.querySelector("#max-price-value");
  const resultCount = document.querySelector("#result-count");
  const shortlistBox = document.querySelector("#shortlist");
  const shortlistTotal = document.querySelector("#shortlist-total");
  const travellersInput = document.querySelector("#route-travellers");

  const params = new URLSearchParams(window.location.search);
  
  if (params.has("direct")) {
  directCheckbox.checked = params.get("direct") === "yes";
  }

  if (params.has("hotels")) {
  const showHotels = params.get("hotels") === "yes";
  document.querySelector("#route-table")
    .classList.toggle("hide-hotels", !showHotels);
  }

  document.querySelector("#nearby-recommendations").hidden =
  params.get("nearby") !== "yes";

  document.querySelector("#buffer-reminder").hidden =
  params.get("buffer") !== "yes";

  if (params.get("travellers")) {
    travellersInput.value = params.get("travellers");
  }
  if (params.get("budget")) {
    const perPerson = Math.round(Number(params.get("budget")) / Number(travellersInput.value));
    priceRange.value = Math.min(Math.max(perPerson, priceRange.min), priceRange.max);
  }

    let shortlist = loadData("nomadica-shortlist", [])
    .filter(id => routeOptions.some(route => route.id === id));


  function calculateTripTotal(pricePerPerson, travellers) {
    return pricePerPerson * travellers;
  }

  function getVisibleRoutes() {
    const maxPrice = Number(priceRange.value);
    const visible = routeOptions.filter(function (route) {
      const passesDirect = !directCheckbox.checked || route.stops === 0;
      return passesDirect && route.price <= maxPrice;
    });

    if (sortSelect.value === "price-low") {
      visible.sort(function (a, b) { return a.price - b.price; });
    } else if (sortSelect.value === "price-high") {
      visible.sort(function (a, b) { return b.price - a.price; });
    } else if (sortSelect.value === "type") {
      visible.sort(function (a, b) { return a.type.localeCompare(b.type); });
    }
    return visible;
  }

  function createRouteRow(route) {
    const row = document.createElement("tr");
    const isSaved = shortlist.includes(route.id);
    const stopsText = route.stops === 0 ? "direct" : route.stops + " stop";

    row.innerHTML =
      "<th scope='row'>" + route.type + "</th>" +
      "<td>" + route.flight + " · " + route.duration + " · " + stopsText + "</td>" +
      "<td>" + route.hotel + "</td>" +
      "<td>" + formatPrice(route.price) + " per person</td>" +
      "<td></td>";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm rounded-pill " + (isSaved ? "btn-nomad" : "btn-outline-success");
    button.textContent = isSaved ? "✓ Saved" : "+ Shortlist";
    button.dataset.id = route.id;
    row.lastElementChild.appendChild(button);
    return row;
  }

  function renderTable() {
      const visible = getVisibleRoutes();
      tableBody.innerHTML = "";

      for (const route of visible) {
        tableBody.appendChild(createRouteRow(route));
      }

      if (visible.length === 0) {
        
  const columnCount = document.querySelector("#route-table")
    .classList.contains("hide-hotels") ? 4 : 5;

  tableBody.innerHTML =
    "<tr><td colspan='" + columnCount +
    "' class='text-center py-4'>No routes match these filters. Try a higher price.</td></tr>";

    }
    resultCount.textContent = visible.length + " of " + routeOptions.length + " options shown";
    priceOutput.textContent = formatPrice(Number(priceRange.value));
  }

  function renderShortlist() {
    const travellers = Number(travellersInput.value) || 1;
    let cheapest = null;
    shortlistBox.innerHTML = "";

    shortlist.forEach(function (id) {
      const route = routeOptions.find(function (item) { return item.id === id; });
      if (!route) { return; }

      const total = calculateTripTotal(route.price, travellers);
      if (cheapest === null || total < cheapest) { cheapest = total; }

      const item = document.createElement("li");
      item.className = "shortlist-item";
      item.innerHTML =
        "<span><strong>" + route.type + "</strong> · " + route.flight +
        "<br><small>" + formatPrice(total) + " for " + travellers + " traveller(s)</small></span>";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn btn-sm btn-link text-danger remove-route";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", "Remove " + route.type + " route");
      removeButton.dataset.id = route.id;
      item.appendChild(removeButton);
      shortlistBox.appendChild(item);
    });

    if (shortlist.length === 0) {
      shortlistBox.innerHTML = "<li class='text-secondary'>Your shortlist is empty. Click “+ Shortlist” in the table.</li>";
      shortlistTotal.textContent = "";
    } else {
      shortlistTotal.textContent = "Cheapest saved option: " + formatPrice(cheapest) + " in total";
    }
  }

  function toggleShortlist(id) {
    if (shortlist.includes(id)) {
      shortlist = shortlist.filter(function (savedId) { return savedId !== id; });
      showToast("Route removed from shortlist");
    } else {
      shortlist.push(id);
      showToast("Route added to shortlist");
    }
    saveData("nomadica-shortlist", shortlist);
    renderTable();
    renderShortlist();
  }


  directCheckbox.addEventListener("change", renderTable);
  sortSelect.addEventListener("change", renderTable);
  priceRange.addEventListener("input", renderTable);
  travellersInput.addEventListener("input", renderShortlist);

  tableBody.addEventListener("click", function (event) {
    if (event.target.matches("button[data-id]")) {
      toggleShortlist(Number(event.target.dataset.id));
    }
  });

  shortlistBox.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-route")) {
      toggleShortlist(Number(event.target.dataset.id));
    }
  });

  renderTable();
  renderShortlist();
});
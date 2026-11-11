document.addEventListener("DOMContentLoaded", function () {
  const filterBox = document.querySelector("#category-filters");
  const searchInput = document.querySelector("#place-search");
  const placeGrid = document.querySelector("#place-grid");
  const emptyMessage = document.querySelector("#no-places");
  const savedList = document.querySelector("#saved-places");
  const savedCount = document.querySelector("#saved-count");

  let activeCategory = "all";
    let savedPlaces = loadData("nomadica-saved-places", [])
    .filter(id => places.some(place => place.id === id));

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function matchesFilters(place, category, searchText) {
    const categoryOk = category === "all" || place.category === category;
    const text = (place.name + " " + place.area).toLowerCase();
    return categoryOk && text.includes(searchText.toLowerCase().trim());
  }

  function renderFilterButtons() {
    for (let i = 0; i < placeCategories.length; i++) {
      const category = placeCategories[i];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-btn" + (category === activeCategory ? " active" : "");
      button.textContent = category === "all" ? "All places" : capitalize(category);
      button.dataset.category = category;
      filterBox.appendChild(button);
    }
  }

  function createPlaceCard(place) {
    const column = document.createElement("div");
    column.className = "col-md-6 col-lg-4";
    const isSaved = savedPlaces.includes(place.id);

    column.innerHTML =
      "<article class='feature-card place-card'>" +
        "<span class='tag'>" + capitalize(place.category) + "</span>" +
        "<h2 class='h4 mt-3'>" + place.name + "</h2>" +
        "<p class='small text-secondary mb-2'>" + place.area + "</p>" +
        "<p>" + place.text + "</p>" +
      "</article>";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "save-btn" + (isSaved ? " saved" : "");
    saveButton.textContent = isSaved ? "♥ Saved" : "♡ Save";
    saveButton.dataset.id = place.id;
    saveButton.setAttribute("aria-pressed", isSaved);
    column.firstElementChild.appendChild(saveButton);
    return column;
  }

  function renderPlaces() {
    placeGrid.innerHTML = "";
    let shown = 0;

    places.forEach(function (place) {
      if (matchesFilters(place, activeCategory, searchInput.value)) {
        placeGrid.appendChild(createPlaceCard(place));
        shown++;
      }
    });

    emptyMessage.hidden = shown > 0;
  }

  function renderSaved() {
    savedList.innerHTML = "";
    for (const id of savedPlaces) {
      const place = places.find(function (item) { return item.id === id; });
      const item = document.createElement("li");
      item.className = "shortlist-item";
      item.innerHTML = "<span>" + place.name + "</span>";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn btn-sm btn-link text-danger";
      removeButton.textContent = "Remove";
      removeButton.dataset.id = id;
      item.appendChild(removeButton);
      savedList.appendChild(item);
    }
    if (savedPlaces.length === 0) {
      savedList.innerHTML = "<li class='text-secondary'>No saved places yet.</li>";
    }
    savedCount.textContent = savedPlaces.length;
  }

  function toggleSaved(id) {
    if (savedPlaces.includes(id)) {
      savedPlaces = savedPlaces.filter(function (savedId) { return savedId !== id; });
    } else {
      savedPlaces.push(id);
    }
    saveData("nomadica-saved-places", savedPlaces);
    renderPlaces();
    renderSaved();
  }


  filterBox.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (!button) { return; }
    activeCategory = button.dataset.category;

    filterBox.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn === button);
    });
    renderPlaces();
  });

  searchInput.addEventListener("input", renderPlaces);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      searchInput.value = "";
      renderPlaces();
    }
  });

  placeGrid.addEventListener("click", function (event) {
    if (event.target.classList.contains("save-btn")) {
      toggleSaved(Number(event.target.dataset.id));
    }
  });

  savedList.addEventListener("click", function (event) {
    if (event.target.dataset.id) {
      toggleSaved(Number(event.target.dataset.id));
    }
  });

  renderFilterButtons();
  renderPlaces();
  renderSaved();
});

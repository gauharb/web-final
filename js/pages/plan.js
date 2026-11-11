document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#trip-form");
  const purposeSelect = document.querySelector("#purpose");
  const successBox = document.querySelector("#trip-success");
  const errorSummary = document.querySelector("#form-errors");

  const fields = {
    fullName:   document.querySelector("#full-name"),
    email:      document.querySelector("#email"),
    origin:     document.querySelector("#origin"),
    destination:document.querySelector("#destination"),
    departure:  document.querySelector("#departure-date"),
    returnDate: document.querySelector("#return-date"),
    travellers: document.querySelector("#travellers"),
    budget:     document.querySelector("#budget"),
    purpose:    purposeSelect
  };

  tripPurposes.forEach(function (purpose) {
    const option = document.createElement("option");
    option.value = purpose;
    option.textContent = purpose;
    purposeSelect.appendChild(option);
  });

  const purposeFromUrl = new URLSearchParams(window.location.search).get("purpose");
  if (purposeFromUrl && tripPurposes.includes(purposeFromUrl)) {
    purposeSelect.value = purposeFromUrl;
  }

  function getTodayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }
  fields.departure.min = getTodayString();


  const rules = {
    fullName: function (value) {
      if (isEmpty(value)) { return "Please enter your full name."; }
      if (value.trim().length < 3) { return "Name must be at least 3 characters."; }
      return "";
    },
    email: function (value) {
      if (isEmpty(value)) { return "Please enter your e-mail."; }
      if (!isValidEmail(value)) { return "E-mail format should be like name@example.com."; }
      return "";
    },
    origin: function (value) {
      if (isEmpty(value)) { return "Enter the city or airport you start from."; }
      if (value.trim().length < 3) { return "Use at least 3 characters (e.g. JFK)."; }
      return "";
    },
    destination: function (value) {
      if (isEmpty(value)) { return "Enter your destination or event."; }
      if (value.trim().length < 3) { return "Use at least 3 characters."; }
      if (value.trim().toLowerCase() === fields.origin.value.trim().toLowerCase()) {
        return "Destination must be different from the starting point.";
      }
      return "";
    },
    departure: function (value) {
      if (isEmpty(value)) { return "Choose a departure date."; }
      if (value < getTodayString()) { return "Departure date cannot be in the past."; }
      return "";
    },
    returnDate: function (value) {
      if (isEmpty(value)) { return ""; } 
      if (fields.departure.value && value <= fields.departure.value) {
        return "Return date must be after the departure date.";
      }
      return "";
    },
    travellers: function (value) {
      const number = Number(value);
      if (isEmpty(value)) { return "Enter the number of travellers."; }
      if (!Number.isInteger(number) || number < 1 || number > 10) {
        return "Travellers must be a whole number from 1 to 10.";
      }
      return "";
    },
    budget: function (value) {
      if (isEmpty(value)) { return ""; } 
      const number = Number(value);
      if (number < 300 || number > 50000) { return "Budget should be between $300 and $50,000."; }
      return "";
    },
    purpose: function (value) {
      return value === "" ? "Please choose the purpose of your trip." : "";
    }
  };

  
  function validateForm() {
    let allValid = true;
    let firstInvalid = null;

    for (const name in fields) {
      const isValid = validateField(fields[name], rules[name]);
      if (!isValid) {
        allValid = false;
        if (!firstInvalid) { firstInvalid = fields[name]; }
      }
    }

    if (firstInvalid) { firstInvalid.focus(); }
    return allValid;
  }

  function getBudgetPerPerson(budget, travellers) {
    if (!budget) { return null; }
    return Math.round(budget / travellers);
  }


  for (const name in fields) {
    const input = fields[name];
    const eventType = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";

    input.addEventListener(eventType, function () {
      if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
        validateField(input, rules[name]);
      }
    });

    input.addEventListener("blur", function () {
      if (!isEmpty(input.value)) { validateField(input, rules[name]); }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    if (!validateForm()) {
      errorSummary.textContent = "Please correct the highlighted fields before continuing.";
      $(errorSummary).hide().fadeIn(200);
      $(successBox).hide();
      return;
    }

    errorSummary.textContent = "";
    $(errorSummary).hide();

    const travellers = Number(fields.travellers.value);
    const budget = Number(fields.budget.value);
    const perPerson = getBudgetPerPerson(budget, travellers);

    successBox.querySelector("#success-text").textContent =
      "Thanks, " + fields.fullName.value.trim() + "! Your " + fields.purpose.value.toLowerCase() +
      " trip from " + fields.origin.value.trim() + " to " + fields.destination.value.trim() +
      " for " + travellers + " traveller(s) is ready to compare." +
      (perPerson ? " Budget per person: " + formatPrice(perPerson) + "." : "");


      let routesLink = "routes.html?travellers=" + travellers;

      if (budget) {
        routesLink += "&budget=" + budget;
      }

      routesLink += "&direct=" + (document.querySelector("#direct-flights").checked ? "yes" : "no");
      routesLink += "&hotels=" + (document.querySelector("#hotel-suggestions").checked ? "yes" : "no");
      routesLink += "&nearby=" + (document.querySelector("#nearby-places").checked ? "yes" : "no");
      routesLink += "&buffer=" + (document.querySelector("#buffer-time").checked ? "yes" : "no");

      successBox.querySelector("a").setAttribute("href", routesLink);


    $(successBox).hide().fadeIn(400);
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", function () {
    for (const name in fields) {
      fields[name].classList.remove("is-valid", "is-invalid");
      document.querySelector("#" + fields[name].id + "-error").textContent = "";
    }
    $(successBox).fadeOut(200);
    $(errorSummary).hide();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#trip-form");
  const link = document.querySelector("#save-trip-link");
  if (!form || !link) return;
  link.addEventListener("click", function () {
    const params = new URLSearchParams({
      from: "plan", origin: form.querySelector("#origin").value,
      destination: form.querySelector("#destination").value,
      departure: form.querySelector("#departure-date").value,
      returnDate: form.querySelector("#return-date").value,
      travellers: form.querySelector("#travellers").value,
      budget: form.querySelector("#budget").value,
      purpose: form.querySelector("#purpose").value
    });
    link.href = "my-trips.html?" + params.toString();
  });
});

function formatPrice(amount) {
  return "$" + amount.toLocaleString("en-US");
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save data:", key);
  }
}

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      return fallback;
    }
    const data = JSON.parse(saved);
    if (Array.isArray(fallback) && !Array.isArray(data)) {
      return fallback;
    }
    return data;
  } catch (error) {
    return fallback;
  }
}

let toastTimer = null;

function showToast(text) {
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast-message";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("visible");
  }, 2200);
}

function applyTheme(theme) {
  const button = document.querySelector("#theme-toggle");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  if (button) {
    button.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";
    button.setAttribute("aria-pressed", theme === "dark");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let currentTheme = loadData("nomadica-theme", "light");
  applyTheme(currentTheme);

  const themeButton = document.querySelector("#theme-toggle");
  if (!themeButton) { return; }
  themeButton.addEventListener("click", function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    saveData("nomadica-theme", currentTheme);
  });
});

$(document).ready(function () {
  const $nav = $("#main-nav");
  const $menuButton = $("#nav-toggle");

  $menuButton.on("click", function () {
    $nav.slideToggle(250);
    const isOpen = $(this).attr("aria-expanded") === "true";
    $(this).attr("aria-expanded", !isOpen).text(isOpen ? "☰ Menu" : "✕ Close");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && $menuButton.attr("aria-expanded") === "true") {
      $menuButton.trigger("click");
    }
  });

  $(window).on("resize", function () {
    if (window.innerWidth >= 992) {
      $nav.css("display", "");
      $menuButton.attr("aria-expanded", "false").text("☰ Menu");
    }
  });

  const $backTop = $(".back-top");
  $backTop.hide();
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 400) {
      $backTop.fadeIn(200);
    } else {
      $backTop.fadeOut(200);
    }
  });

  $backTop.on("click", function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 400);
  });
});

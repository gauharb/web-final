document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const topicSelect = document.querySelector("#topic");
  const messageInput = document.querySelector("#message");
  const counter = document.querySelector("#message-count");
  const successBox = document.querySelector("#contact-success");

  const MIN_MESSAGE = 20;
  const MAX_MESSAGE = 500;

  const checks = [
    { input: nameInput, rule: function (value) {
        if (isEmpty(value)) { return "Please enter your name."; }
        if (value.trim().length < 2) { return "Name must be at least 2 characters."; }
        return "";
    } },
    { input: emailInput, rule: function (value) {
        if (isEmpty(value)) { return "Please enter your e-mail."; }
        return isValidEmail(value) ? "" : "Please enter a valid e-mail, e.g. name@example.com.";
    } },
    { input: topicSelect, rule: function (value) {
        return value === "" ? "Please choose a topic." : "";
    } },
    { input: messageInput, rule: function (value) {
        const length = value.trim().length;
        if (length === 0) { return "Please write a message."; }
        if (length < MIN_MESSAGE) { return "Message is too short: " + length + "/" + MIN_MESSAGE + " characters."; }
        if (length > MAX_MESSAGE) { return "Message is too long (max " + MAX_MESSAGE + " characters)."; }
        return "";
    } }
  ];

  function updateCounter() {
    const length = messageInput.value.trim().length;
    counter.textContent = length + " / " + MAX_MESSAGE + " characters";
    counter.style.color = length < MIN_MESSAGE || length > MAX_MESSAGE ? "#b02a37" : "#35695b";
  }

  messageInput.addEventListener("input", updateCounter);

  checks.forEach(function (check) {
    const eventType = check.input.tagName === "SELECT" ? "change" : "input";
    check.input.addEventListener(eventType, function () {
      if (check.input.classList.contains("is-invalid")) {
        validateField(check.input, check.rule);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;

    checks.forEach(function (check) {
      if (!validateField(check.input, check.rule)) { valid = false; }
    });

    if (!valid) {
      $(successBox).hide();
      form.querySelector(".is-invalid").focus();
      return;
    }

    successBox.textContent = "Thank you, " + nameInput.value.trim() +
      "! Your message about “" + topicSelect.value + "” was checked and is ready to send.";
    $(successBox).hide().fadeIn(400);
    form.reset();
    checks.forEach(function (check) { check.input.classList.remove("is-valid"); });
    updateCounter();
  });

  updateCounter();
});

$(function () {
  $("#faq .faq-question").on("click", function () {
    const $item = $(this).closest(".faq-item");
    const $answer = $item.find(".faq-answer");
    const isOpen = $item.hasClass("open");

    $item.siblings(".faq-item").removeClass("open")
      .find(".faq-answer").slideUp(200);
    $item.siblings(".faq-item").find(".faq-question").attr("aria-expanded", "false");

    $item.toggleClass("open", !isOpen);
    $(this).attr("aria-expanded", !isOpen);
    if (isOpen) {
      $answer.slideUp(200);
    } else {
      $answer.slideDown(200);
    }
  });
});

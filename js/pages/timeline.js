$(document).ready(function () {
  const $days = $("#timeline-list .timeline");
  const totalDays = $days.length;

  function updateProgress() {
    const doneDays = $("#timeline-list input[type='checkbox']:checked").length;
    const percent = Math.round((doneDays / totalDays) * 100);
    $("#done-count").text(doneDays + " of " + totalDays + " days ready");
    $("#progress-bar").animate({ width: percent + "%" }, 300).attr("aria-valuenow", percent);
  }

  $(".day-toggle").on("click", function () {
    const $details = $(this).next(".day-details");
    const isOpen = $(this).attr("aria-expanded") === "true";
    $details.slideToggle(250);
    $(this).attr("aria-expanded", !isOpen);
    $(this).closest(".timeline").toggleClass("is-open");
  });

  $("#expand-all").on("click", function () {
    $(".day-details").slideDown(250);
    $(".day-toggle").attr("aria-expanded", "true");
    $days.addClass("is-open");
  });

  $("#collapse-all").on("click", function () {
    $(".day-details").slideUp(250);
    $(".day-toggle").attr("aria-expanded", "false");
    $days.removeClass("is-open");
  });

  $("#timeline-list").on("change", "input[type='checkbox']", function () {
    const $day = $(this).closest(".timeline");
    $day.toggleClass("done", this.checked);
    $day.children("time").text(this.checked ? "✓ " + $day.data("day") : $day.data("day"));
    updateProgress();
  });

  $("#activity-form").on("submit", function (event) {
    event.preventDefault();
    const text = $("#activity-text").val().trim();
    const dayNumber = $("#activity-day").val();
    const $error = $("#activity-text-error");

    if (text.length < 3) {
      $("#activity-text").addClass("is-invalid");
      $error.text("Write at least 3 characters for the activity.");
      return;
    }
    $("#activity-text").removeClass("is-invalid");
    $error.text("");

    const $day = $days.filter("[data-day='Day " + dayNumber + "']");
    const $list = $day.find(".extra-list");

    const $item = $("<li>").addClass("extra-item").text(text);
    $item.append(" ").append($("<button>", { type: "button", class: "btn btn-sm btn-link text-danger p-0 remove-activity", text: "remove" }));
    $item.hide();
    $list.append($item);
    $item.fadeIn(300);

    $day.find(".day-details").slideDown(250);
    $day.find(".day-toggle").attr("aria-expanded", "true");

    $("#activity-text").val("").focus();
    showToast("Activity added to " + $day.data("day"));
  });

  $("#timeline-list").on("click", ".remove-activity", function () {
    $(this).parent().fadeOut(250, function () {
      $(this).remove();
    });
  });

  $(".day-toggle").on("mouseover", function () {
    $(this).attr("title", "Click to show or hide details");
  });

  updateProgress();
});

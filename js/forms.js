"use strict";

$(function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function markField($field, message) {
        $field.toggleClass("is-invalid", Boolean(message));
        $field.toggleClass("is-valid", !message);
        $field.attr("aria-invalid", String(Boolean(message)));
        const $feedback = $field.closest("div[class*='col-']").find(".invalid-feedback").last();
        if (message) $feedback.text(message);
        return !message;
    }

    function contactValid() {
        const $name = $("#contact-name");
        const $email = $("#contact-email");
        const $message = $("#contact-message");
        const name = String($name.val() || "").trim();
        const email = String($email.val() || "").trim();
        const message = String($message.val() || "").trim();
        const checks = [
            markField($name, name.length >= 2 ? "" : "Please enter at least 2 characters."),
            markField($email, emailPattern.test(email) ? "" : "Please enter a valid email address."),
            markField($message, message.length >= 10 && message.length <= 500 ? "" : "Please enter a message between 10 and 500 characters.")
        ];
        return checks.every(Boolean);
    }

    function registrationValid() {
        const $first = $("#first-name");
        const $last = $("#last-name");
        const $email = $("#registration-email");
        const $password = $("#password");
        const $confirmation = $("#confirm-password");
        const $country = $("#country");
        const first = String($first.val() || "").trim();
        const last = String($last.val() || "").trim();
        const email = String($email.val() || "").trim();
        const password = String($password.val() || "");
        const confirmation = String($confirmation.val() || "");
        const checks = [
            markField($first, first.length >= 2 ? "" : "Enter your first name (at least 2 characters)."),
            markField($last, last.length >= 2 ? "" : "Enter your last name (at least 2 characters)."),
            markField($email, emailPattern.test(email) ? "" : "Please enter a valid email address."),
            markField($password, password.length >= 8 ? "" : "Password must be at least 8 characters."),
            markField($confirmation, confirmation.length >= 8 && password === confirmation ? "" : "Passwords must match and contain at least 8 characters."),
            markField($country, $country.val() ? "" : "Please choose a country.")
        ];
        return checks.every(Boolean);
    }

    $(".needs-validation").each(function () {
        const $form = $(this);
        const isContact = $form.is("#contactForm");
        const $success = $("#" + $form.attr("data-success-target"));
        const validate = isContact ? contactValid : registrationValid;
        let attempted = false;

        $form.on("submit", function (event) {
            event.preventDefault();
            attempted = true;
            $success.stop(true, true).hide().attr("hidden", "hidden");
            if (!validate()) {
                $form.find(".is-invalid").first().trigger("focus");
                return;
            }
            $success.removeAttr("hidden").hide().fadeIn(230);
            $success.trigger("focus");
        });

        $form.on("input change", "input, select, textarea", function () {
            if (attempted) {
                $success.stop(true, true).hide().attr("hidden", "hidden");
                validate();
            }
        });

        $form.on("reset", function () {
            attempted = false;
            $success.stop(true, true).hide().attr("hidden", "hidden");
            $form.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid").removeAttr("aria-invalid");
        });
    });
});

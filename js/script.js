"use strict";

$(function () {
    const $menu = $("#menuToggle");
    $menu.on("click", function () {
        const open = !$("#primaryNav").hasClass("is-open");
        $("#primaryNav").toggleClass("is-open", open);
        $menu.attr("aria-expanded", String(open));
    });
    $(window).on("resize", function () {
        if (window.innerWidth >= 768) {
            $("#primaryNav").removeClass("is-open");
            $menu.attr("aria-expanded", "false");
        }
    });

    const $body = $("body");
    const $themeButton = $("#themeBtn");

    function readStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            return;
        }
    }

    function setTheme(isDark) {
        $body.toggleClass("dark-theme", isDark);
        $themeButton.text(isDark ? "Light mode" : "Dark mode");
        $themeButton.attr("aria-pressed", String(isDark));
    }

    if ($themeButton.length) {
        setTheme(readStorage("auroraTheme", "light") === "dark");
        $themeButton.on("click", function () {
            const isDark = !$body.hasClass("dark-theme");
            setTheme(isDark);
            writeStorage("auroraTheme", isDark ? "dark" : "light");
        });
    }

    const $guestName = $("#guestName");
    const $welcomeMessage = $("#welcomeMessage");

    if ($guestName.length && $welcomeMessage.length) {
        function greet() {
            const name = String($guestName.val() || "").trim();
            const message = name ? `Welcome to Aurora Hotel, ${name}!` : "Please enter your name.";
            $welcomeMessage.stop(true, true).fadeOut(100, function () {
                $(this).text(message).fadeIn(160);
            });
            $guestName.toggleClass("input-error", !name);
        }

        $("#welcomeBtn").on("click", greet);
        $guestName.on("input", function () {
            $(this).removeClass("input-error");
        }).on("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                greet();
            }
        });
    }

    $(".faq-question").on("click", function () {
        const $question = $(this);
        const $answer = $("#" + $question.attr("aria-controls"));
        if (!$answer.length) return;
        const willOpen = $question.attr("aria-expanded") !== "true";
        $question.attr("aria-expanded", String(willOpen));
        $question.find(".faq-chevron").text(willOpen ? "−" : "+");
        if (willOpen) {
            $answer.removeAttr("hidden").stop(true, true).hide().slideDown(200);
        } else {
            $answer.stop(true, true).slideUp(200, function () {
                $(this).attr("hidden", "hidden");
            });
        }
    });

    const $roomCards = $(".rooms-grid .room-card");
    const $roomSearch = $("#roomSearch");
    let activeCategory = "all";

    function filterRooms() {
        const query = String($roomSearch.val() || "").trim().toLocaleLowerCase();
        let matches = 0;
        $roomCards.each(function () {
            const $card = $(this);
            const content = $card.text().toLocaleLowerCase();
            const categoryMatches = activeCategory === "all" || $card.attr("data-category") === activeCategory;
            const visible = categoryMatches && content.includes(query);
            $card.prop("hidden", !visible);
            if (visible) matches++;
        });
        $("#roomCount").text(`${matches} ${matches === 1 ? "room" : "rooms"} found`);
        $("#noResults").prop("hidden", matches !== 0);
    }

    if ($roomSearch.length) {
        $roomSearch.on("input", filterRooms);
        $(".filter-btn").on("click", function () {
            activeCategory = $(this).attr("data-category") || "all";
            $(".filter-btn").removeClass("is-active").attr("aria-pressed", "false");
            $(this).addClass("is-active").attr("aria-pressed", "true");
            filterRooms();
        });
        $roomCards.each(function () {
            const title = $(this).find(".room-title").text().trim();
            $(this).find(".choose-room").attr("href", "booking.html?room=" + encodeURIComponent(title));
            $(this).find(".save-room").attr("aria-label", "Save " + title + " to wishlist");
        });
        filterRooms();
    }

    const $favouritesForm = $("#favouritesForm");
    const $favouritesList = $("#favouritesList");
    let favourites = [];

    function storeFavourites() {
        writeStorage("auroraFavourites", JSON.stringify(favourites));
    }

    function updateFavourites() {
        const count = favourites.length;
        $("#favouritesCount").text(`${count} ${count === 1 ? "item" : "items"}`);
        $("#favouritesEmpty").prop("hidden", count !== 0);
        $roomCards.each(function () {
            const name = $(this).find(".room-title").text().trim();
            const saved = favourites.some(item => item.toLocaleLowerCase() === name.toLocaleLowerCase());
            $(this).find(".save-room").text(saved ? "Saved ✓" : "Save room")
                .toggleClass("is-saved", saved)
                .attr("aria-pressed", String(saved));
        });
    }

    function renderFavourites() {
        $favouritesList.empty();
        favourites.forEach(function (name) {
            const $item = $("<li>");
            const $label = $("<span>").text(name);
            const $remove = $("<button>", { type: "button", class: "remove-btn", text: "Remove" })
                .attr("aria-label", "Remove " + name);
            $item.append($label, $remove);
            $favouritesList.append($item);
        });
        updateFavourites();
    }

    function notifyWishlist(message) {
        const $notice = $("#wishlistNotice");
        $notice.removeAttr("hidden").stop(true, true).hide().text(message)
            .fadeIn(180).delay(2200).fadeOut(250);
    }

    function addFavourite(name) {
        const cleanName = String(name || "").trim();
        if (!cleanName) {
            $("#favouritesError").text("Enter a room name.").prop("hidden", false);
            $("#favouriteInput").addClass("input-error").trigger("focus");
            return;
        }
        $("#favouritesError").prop("hidden", true);
        $("#favouriteInput").removeClass("input-error");
        if (favourites.some(item => item.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
            notifyWishlist("Already in your wishlist.");
            return;
        }
        favourites.push(cleanName);
        storeFavourites();
        renderFavourites();
        notifyWishlist("Added to your wishlist.");
    }

    if ($favouritesForm.length) {
        try {
            const saved = JSON.parse(readStorage("auroraFavourites", "[]"));
            favourites = Array.isArray(saved) ? saved.filter(item => typeof item === "string" && item.trim()).slice(0, 100) : [];
        } catch (error) {
            favourites = [];
        }
        renderFavourites();
        $favouritesForm.on("submit", function (event) {
            event.preventDefault();
            const $input = $("#favouriteInput");
            const before = favourites.length;
            addFavourite($input.val());
            if (favourites.length > before) $input.val("");
        });
        $("#favouriteInput").on("input", function () {
            $(this).removeClass("input-error");
            $("#favouritesError").prop("hidden", true);
        });
        $favouritesList.on("click", ".remove-btn", function () {
            const name = $(this).closest("li").find("span").first().text();
            favourites = favourites.filter(item => item !== name);
            storeFavourites();
            renderFavourites();
            notifyWishlist("Removed from your wishlist.");
        });
        $(".rooms-grid").on("click", ".save-room", function () {
            const title = $(this).closest(".room-card").find(".room-title").text().trim();
            addFavourite(title);
        });
    }

    const $bookingForm = $("#bookingForm");
    const $checkIn = $("#check-in");
    const $checkOut = $("#check-out");

    function dateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function nextDate(value) {
        const date = new Date(value + "T12:00:00");
        date.setDate(date.getDate() + 1);
        return dateString(date);
    }

    function showFieldError($input, message) {
        const $group = $input.closest(".form-group");
        let $error = $group.find(".field-error");
        if (!$error.length) {
            $error = $("<span>", { class: "field-error", role: "alert" });
            $group.append($error);
        }
        $input.toggleClass("input-error", Boolean(message));
        $input.attr("aria-invalid", String(Boolean(message)));
        $error.text(message).toggle(Boolean(message));
    }

    if ($bookingForm.length) {
        const today = dateString(new Date());
        $checkIn.attr("min", today);
        $checkOut.attr("min", nextDate(today));
        const requested = new URLSearchParams(window.location.search).get("room");
        if (requested) {
            $("#room-type option").each(function () {
                if ($(this).text() === requested) $("#room-type").val($(this).val());
            });
        }
        let attempted = false;
        const roomLimits = {
            "Standard Room": 2,
            "Twin Room": 2,
            "Deluxe Room": 2,
            "Family Room": 4,
            "Junior Suite": 3,
            "Presidential Suite": 4
        };

        function validateBooking() {
            const name = String($("#full-name").val() || "").trim();
            const email = String($("#email").val() || "").trim();
            const room = String($("#room-type").val() || "");
            const checkIn = String($checkIn.val() || "");
            const checkOut = String($checkOut.val() || "");
            const guests = Number($("#guests").val());
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const errors = [
                ["#full-name", name.length >= 2 ? "" : "Enter your full name."],
                ["#email", emailValid ? "" : "Enter a valid email address."],
                ["#room-type", roomLimits[room] ? "" : "Choose a room."],
                ["#check-in", checkIn && checkIn >= today ? "" : "Choose a check-in date from today onward."],
                ["#check-out", checkIn && checkOut && checkOut > checkIn ? "" : "Check-out must be after check-in."],
                ["#guests", Number.isInteger(guests) && guests >= 1 && guests <= 4 && guests <= (roomLimits[room] || 4) ? "" : `Choose 1 to ${roomLimits[room] || 4} guests for this room.`]
            ];
            errors.forEach(([selector, message]) => showFieldError($(selector), message));
            const firstError = errors.find(([, message]) => Boolean(message));
            $("#bookingFeedback").text(firstError ? "Please correct the highlighted fields." : "")
                .prop("hidden", !firstError);
            return !firstError;
        }

        $checkIn.on("change", function () {
            $checkOut.attr("min", $(this).val() ? nextDate($(this).val()) : nextDate(today));
        });
        $bookingForm.on("input change", "input, select, textarea", function () {
            if (attempted) validateBooking();
        });
        $bookingForm.on("submit", function (event) {
            event.preventDefault();
            attempted = true;
            if (!validateBooking()) {
                $bookingForm.find(".input-error").first().trigger("focus");
                return;
            }
            const stay = {
                name: String($("#full-name").val()).trim(),
                email: String($("#email").val()).trim(),
                phone: String($("#phone").val() || "").trim(),
                room: $("#room-type").val(),
                checkIn: $checkIn.val(),
                checkOut: $checkOut.val(),
                guests: $("#guests").val(),
                purpose: $("#travel-purpose").val(),
                request: String($("#special-request").val() || "").trim()
            };
            try {
                sessionStorage.setItem("auroraStay", JSON.stringify(stay));
            } catch (error) {
                $("#bookingFeedback").text("Unable to prepare the stay summary in this browser.").prop("hidden", false);
                return;
            }
            window.location.href = "stay-review.html";
        });
        $bookingForm.on("reset", function () {
            attempted = false;
            $("#bookingFeedback").prop("hidden", true);
            $bookingForm.find(".input-error").removeClass("input-error").attr("aria-invalid", "false");
            $bookingForm.find(".field-error").hide().text("");
            $checkOut.attr("min", nextDate(today));
        });
    }

    const $staySummary = $("#staySummary");
    if ($staySummary.length) {
        let stay = null;
        try {
            stay = JSON.parse(sessionStorage.getItem("auroraStay") || "null");
        } catch (error) {
            stay = null;
        }
        if (stay && stay.name && stay.room) {
            const fields = [
                ["Guest", stay.name],
                ["Room", stay.room],
                ["Check-in", stay.checkIn],
                ["Check-out", stay.checkOut],
                ["Guests", stay.guests],
                ["Email", stay.email],
                ["Phone", stay.phone],
                ["Travel purpose", stay.purpose],
                ["Special request", stay.request]
            ];
            fields.forEach(function ([label, value]) {
                if (!value) return;
                const $row = $("<div>", { class: "stay-summary-row" });
                $row.append($("<dt>").text(label), $("<dd>").text(value));
                $staySummary.append($row);
            });
            $staySummary.prop("hidden", false);
            $("#stayIntro").text("Here is a summary of your stay preferences. Contact reception to confirm availability.");
        }
    }
});

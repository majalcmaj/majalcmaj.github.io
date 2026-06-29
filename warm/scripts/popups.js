var LOCALSTORAGE_POPUP_KEY = "implants-popup-seen";
var LOGO_SPLASH_SESSION_KEY = "logo-splash-seen";
var IMPLANTS_POPUP_CONTENT = "popups/implants.html";

function makeGalleryPopup(containerElementQuery) {
    $(containerElementQuery).magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {enabled: true},
        image: {titleSrc: 'title'}
    });
}

function savePopupWasOpen() {
    localStorage.setItem(LOCALSTORAGE_POPUP_KEY, "true");
    return true;
}

function wasPopupOpen() {
    return localStorage.getItem(LOCALSTORAGE_POPUP_KEY) === "true";
}

function openImplantsPopup() {
    if (!wasPopupOpen()) {
        $.magnificPopup.open({
            type: 'ajax',
            items: {src: IMPLANTS_POPUP_CONTENT},
            callbacks: {
                ajaxContentAdded: function () {
                    var dialog = this.content.attr('tabindex', '-1').get(0);
                    // Magnific Popup re-focuses .mfp-wrap itself 16ms after open;
                    // wait it out so our focus call is the one that sticks.
                    setTimeout(function () {
                        dialog.focus();
                    }, 32);
                },
                close: savePopupWasOpen
            }
        });
    }
}

function openImplantsPopupOnWindowLoad() {
    window.onload = openImplantsPopup;
}

function createLogoSplash() {
    if (sessionStorage.getItem(LOGO_SPLASH_SESSION_KEY) === "true") return;

    var splash = document.createElement("div");
    splash.id = "logo-splash";
    splash.setAttribute("role", "dialog");
    splash.setAttribute("aria-modal", "true");
    splash.setAttribute("aria-label", "Witamy");
    splash.innerHTML =
        '<div id="logo-splash-inner">' +
        '<img src="images/Logo.webp" alt="Logo gabinetu Stomatologia Ciesielscy">' +
        '<p class="logo-splash-name">Stomatologia Ciesielscy</p>' +
        '<button id="logo-splash-close">Wejdź na stronę</button>' +
        '</div>';
    document.body.prepend(splash);

    var closeBtn = document.getElementById("logo-splash-close");
    closeBtn.focus();

    var dismissed = false;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function dismissSplash() {
        if (dismissed) return;
        dismissed = true;
        clearTimeout(autoTimer);
        sessionStorage.setItem(LOGO_SPLASH_SESSION_KEY, "true");
        if (reducedMotion) {
            splash.remove();
        } else {
            splash.classList.add("dismissing");
            splash.addEventListener("animationend", function () { splash.remove(); }, {once: true});
        }
    }

    var autoTimer = setTimeout(dismissSplash, 2500);

    closeBtn.addEventListener("click", dismissSplash);
    splash.addEventListener("click", function (e) {
        if (e.target === splash) dismissSplash();
    });
    document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
            document.removeEventListener("keydown", escHandler);
            dismissSplash();
        }
    });
    // Simple focus trap — only one focusable element in the splash
    splash.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            closeBtn.focus();
        }
    });
}

function initHamburgerMenu() {
    var header = document.getElementById("head-container");
    if (!header) return;

    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menu nawigacyjne");
    toggle.innerHTML =
        '<span class="nav-toggle-bar"></span>' +
        '<span class="nav-toggle-bar"></span>' +
        '<span class="nav-toggle-bar"></span>';

    var nav = header.querySelector("nav");
    header.insertBefore(toggle, nav);

    toggle.addEventListener("click", function () {
        var isOpen = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
        if (!header.contains(e.target) && header.classList.contains("nav-open")) {
            header.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initHamburgerMenu();
    createLogoSplash();
});

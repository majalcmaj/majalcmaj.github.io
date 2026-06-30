var LOCALSTORAGE_POPUP_KEY = "implants-popup-seen";
var LOGO_SPLASH_SESSION_KEY = "logo-splash-seen";
var IMPLANTS_POPUP_CONTENT = "popups/implants.html";

function savePopupWasOpen() {
    localStorage.setItem(LOCALSTORAGE_POPUP_KEY, "true");
}

function wasPopupOpen() {
    return localStorage.getItem(LOCALSTORAGE_POPUP_KEY) === "true";
}

function openImplantsPopup() {
    if (wasPopupOpen()) return;

    fetch(IMPLANTS_POPUP_CONTENT)
        .then(function (r) { return r.text(); })
        .then(function (html) {
            var dlg = document.createElement("dialog");
            dlg.className = "implants-dialog";
            dlg.innerHTML = html +
                '<button class="implants-close" aria-label="Zamknij">&#x2715;</button>';
            document.body.appendChild(dlg);

            dlg.querySelector(".implants-close").addEventListener("click", function () {
                dlg.close();
            });
            dlg.addEventListener("close", function () {
                savePopupWasOpen();
                dlg.remove();
            });
            dlg.addEventListener("click", function (e) {
                if (e.target === dlg) dlg.close();
            });

            dlg.showModal();
        });
}

function createLogoSplash(onDismissed) {
    if (sessionStorage.getItem(LOGO_SPLASH_SESSION_KEY) === "true") {
        if (onDismissed) onDismissed();
        return;
    }

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
            if (onDismissed) onDismissed();
        } else {
            splash.classList.add("dismissing");
            splash.addEventListener("animationend", function () {
                splash.remove();
                if (onDismissed) onDismissed();
            }, {once: true});
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
    toggle.textContent = "Menu ▾";

    var nav = header.querySelector("nav");
    header.insertBefore(toggle, nav);

    toggle.addEventListener("click", function () {
        var isOpen = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.textContent = isOpen ? "Menu ▴" : "Menu ▾";
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
    createLogoSplash(openImplantsPopup);
});

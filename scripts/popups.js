var LOCALSTORAGE_POPUP_KEY = "implants-popup-seen";
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
                close: savePopupWasOpen
            }
        });
    }
}

function openImplantsPopupOnWindowLoad() {
    window.onload = openImplantsPopup;
}

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

// Site-wide handlers loaded on every page.
// Sourced from source/assets/js/index.js (the bits not specific to EQ or ERSK).

document.addEventListener("DOMContentLoaded", () => {
    // Reload when the page is restored from the browser's back-forward cache.
    // Without this, Metro dialog state can desync after navigating back.
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // Show a loading overlay when the user clicks a link marked `slow-loading`
    // (typically external proxied docs sites that take a few seconds to respond).
    if (typeof $ !== "undefined") {
        $("body").on("click", "a[slow-loading]", function () {
            showLoadIndicator();
        });
    }

    function showLoadIndicator() {
        if (typeof Metro !== "undefined" && Metro.activity) {
            Metro.activity.open({
                type: "cycle",
                overlayColor: "#fff",
                overlayAlpha: 0.6,
                text: '<div class="mt-2 text-small">Loading...</div>',
            });
        }
    }
});

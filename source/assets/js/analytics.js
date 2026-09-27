/*
 * Reports what happens on the site to our own collector at account.korzh.com,
 * which /t/* proxies to (see source/_redirects), so the call stays on this domain.
 *
 * Page views are counted without any identifier: the server builds a daily hash of the
 * address and the browser. A visitor id is created only when someone opens the trial or
 * the ERSK dialog, and it lives in sessionStorage, so nothing is stored for people who
 * just read the site and nothing survives the browser session.
 */
(function () {
    "use strict";

    var COLLECTOR = "/t";
    var ID_KEY = "kz_aid";
    var UTM_KEY = "kz_utm";

    var utm = null;

    function storage() {
        try {
            return window.sessionStorage;
        } catch (e) {
            return null; // private mode, or storage blocked
        }
    }

    function read(key) {
        var store = storage();
        try {
            return store ? store.getItem(key) : null;
        } catch (e) {
            return null;
        }
    }

    function write(key, value) {
        var store = storage();
        try {
            if (store) store.setItem(key, value);
        } catch (e) {
            /* out of space or blocked: the id just won't survive the next page */
        }
    }

    function newId() {
        var bytes = new Uint8Array(16);

        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(bytes);
        } else {
            for (var i = 0; i < bytes.length; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
            }
        }

        var hex = "";
        for (var j = 0; j < bytes.length; j++) {
            hex += ("0" + bytes[j].toString(16)).slice(-2);
        }
        return "w_" + hex;
    }

    /** The visitor id, created on the first interaction and kept for this browser session. */
    function visitorId() {
        var id = read(ID_KEY);
        if (!id) {
            id = newId();
            write(ID_KEY, id);
            if (utm) write(UTM_KEY, JSON.stringify(utm));
        }
        return id;
    }

    /** The campaign the visitor arrived with. The first one wins: it is what brought them here. */
    function captureUtm() {
        var stored = read(UTM_KEY);
        if (stored) {
            try {
                utm = JSON.parse(stored);
                return;
            } catch (e) {
                /* ignore a broken value and read the address instead */
            }
        }

        var params = new URLSearchParams(window.location.search);
        var source = params.get("utm_source");
        var medium = params.get("utm_medium");
        var campaign = params.get("utm_campaign");

        if (source || medium || campaign) {
            utm = { source: source, medium: medium, campaign: campaign };
            write(UTM_KEY, JSON.stringify(utm));
        }
    }

    function send(path, payload) {
        var url = COLLECTOR + path;
        var body = JSON.stringify(payload);

        try {
            // text/plain: what sendBeacon sends, and it keeps the request simple for CORS
            if (navigator.sendBeacon) {
                navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
                return;
            }

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: body,
                keepalive: true,
            }).catch(function () {
                /* analytics must never break the page */
            });
        } catch (e) {
            /* the same */
        }
    }

    function trackHit() {
        send("/hit", {
            site: window.location.hostname,
            path: window.location.pathname,
            referrer: document.referrer,
            utm: utm,
        });
    }

    /**
     * Reports one of the events the collector accepts: trial.dialog.opened or perk.dialog.opened.
     */
    function trackEvent(type, extra) {
        var event = {
            type: type,
            aid: visitorId(),
            at: new Date().toISOString(),
            page: window.location.pathname,
        };

        if (extra) {
            for (var key in extra) {
                if (Object.prototype.hasOwnProperty.call(extra, key)) {
                    event[key] = extra[key];
                }
            }
        }

        send("/events", { events: [event] });
    }

    /** What the register API takes as its "data" field, so a sign-up joins the visitor's earlier steps. */
    function requestData(extra) {
        var data = extra || {};

        data.aid = read(ID_KEY) || visitorId();
        data.page = window.location.pathname;
        data.referrer = document.referrer;

        if (utm) data.utm = utm;

        return data;
    }

    /**
     * The link that records a download before sending the visitor to the file itself.
     * Falls back to the file when the item is unknown, so a download can never be lost.
     */
    function downloadUrl(uri, fileUrl) {
        if (!uri) return fileUrl;

        return "https://account.korzh.com/d/" + uri + "?aid=" + encodeURIComponent(visitorId());
    }

    window.KorzhAnalytics = {
        trackEvent: trackEvent,
        requestData: requestData,
        visitorId: visitorId,
        downloadUrl: downloadUrl,
    };

    captureUtm();
    trackHit();
})();

document.addEventListener("DOMContentLoaded", () => {

    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    // ==========================================
    // EasyQuery Logic (from easyquery.html)
    // ==========================================

    const eqAction = window.location.href.split("#")[1];

    const mobileDialogStyle = document.createElement("style");
    mobileDialogStyle.innerHTML = `
        @media screen and (max-width: 768px) {
            .eq-mobile-fullscreen {
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                margin: 0 !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                border-radius: 0 !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                border: none !important;
            }
        }
    `;
    document.head.appendChild(mobileDialogStyle);

    // The EasyQuery samples, one github.com/easyquery/eq-samples-<name> repository per platform, by
    // app type and SPA frontend (see tools/split-samples/samples.json in EasyQuery.All). Clicks on
    // them are counted by the trial.dialog.redirected event. Edition: the tab on the licensing section.
    const EQ_SAMPLES = {
        'asp-net-core-razor': { name: 'aspnetcore-razor-mvc', solution: 'Samples.AspNetCore.sln', hint: '6 samples, Razor Pages and MVC' },
        'angular': { name: 'aspnetcore-angular', solution: 'Samples.Angular.sln', hint: '2 samples: Advanced search, Ad-hoc reporting' },
        'react': { name: 'aspnetcore-react', solution: 'Samples.React.sln', hint: '1 sample: Advanced search' },
        'vue': { name: 'aspnetcore-vue', solution: 'Samples.Vue.sln', hint: '2 samples, Vue 3 and Vue 2' },
        'asp-net-core-blazor': { name: 'aspnetcore-blazor', solution: 'Samples.Blazor.sln', hint: '2 samples, Server and WebAssembly' },
        'asp-net-4-mvc': { name: 'aspnet4-mvc', solution: 'Samples.AspNet4x.MVC.sln', hint: '5 samples' },
        'asp-net-4-webforms': { name: 'aspnet4-webforms', solution: 'Samples.WebForms.sln', hint: '2 samples, C# and VB.NET' },
        'net-winforms': { name: 'winforms', solution: 'Samples.WinForms.sln', hint: '3 samples', edition: 'winforms-edition' },
        'net-wpf': { name: 'wpf', solution: 'Samples.Wpf.sln', hint: '2 samples', edition: 'wpf-edition' }
    };

    const sampleRepoUrl = sample => `https://github.com/easyquery/eq-samples-${sample.name}`;

    const licenseEditions = ['asp-core-edition', 'asp-net-edition', 'winforms-edition', 'silverlight-edition', 'wpf-edition', 'delphi-edition'];

    if (eqAction === 'get-trial') {
        getTrial();
    } else if (licenseEditions.includes(eqAction)) {
        showLicensing(eqAction);
    }

    function showLicensing(edition) {
        const licensingEl = document.getElementById("licensing");
        if (licensingEl) {
            licensingEl.scrollIntoView();
        }
        if (edition && typeof $ !== 'undefined' && typeof Metro !== 'undefined') {
            Metro.getPlugin("#license-price", 'tabs').open(licenseEditions.indexOf(edition) + 1);
        }
    }

    // Attach click handler to "Get Trial" button
    const getTrialBtn = document.getElementById("btn-get-trial");
    if (getTrialBtn) {
        getTrialBtn.addEventListener("click", (e) => {
            e.preventDefault();
            getTrial();
        });
    }

    if (typeof $ !== 'undefined') {
        $("body").on("click", "a[slow-loading]", function () {
            showLoadIndicator();
        });
    }

    function trialChangeOptions(val, keepOthers) {
        if (typeof $ !== 'undefined') {
            if (!keepOthers) $(".trial-sub-options > form").hide();
            $("#trial-option-" + val).show();
        }
    }

    // What the visitor picked in the trial dialog. No sample: the app type has no repository to open.
    function trialSelection() {
        const app = document.getElementById("select-apptype").value;
        const spaForm = document.forms["trial-option-asp-net-core-spa"];
        const frontend = spaForm.elements.frontend.value;

        return { app, frontend, sample: EQ_SAMPLES[app === "asp-net-core-spa" ? frontend : app] };
    }

    function updateTrialDialog() {
        const { app, frontend, sample } = trialSelection();
        const link = document.getElementById("trial-open-sample");
        const sendBtn = document.querySelector(".js-get-trial-action-btn");
        const hint = document.getElementById("trial-sample-hint");

        trialChangeOptions(app);
        if (app === "asp-net-core-spa" && frontend === "other") {
            trialChangeOptions("spa-other", true);
        }

        document.getElementById("trial-email-block").style.display = sample ? "none" : "";
        hint.style.display = sample ? "" : "none";
        link.style.display = sample ? "" : "none";
        sendBtn.style.display = sample ? "none" : "";

        if (sample) {
            link.href = sampleRepoUrl(sample);
            hint.innerHTML = `<span class="mif-github pr-1"></span> Opens <b>eq-samples-${sample.name}</b> on GitHub in a new tab — ${sample.hint}.`;
        }
    }

    function getTrial() {
        if (typeof Metro === 'undefined') return;

        if (window.KorzhAnalytics) {
            // the family tag: which EasyQuery product it is follows from the app type the visitor picks
            window.KorzhAnalytics.trackEvent('trial.dialog.opened', { ptag: 'EQN' });
        }

        Metro.dialog.create({
            title: "<span class='mif-magic-wand fg-primary pr-2'></span> Try EasyQuery",
            content: `
            <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                Pick the platform closest to your project. We'll open a ready-to-run sample for it on GitHub.
            </div>
            <select id="select-apptype" class="mt-4 mb-4" data-role="select" data-filter="false">
                <option value="asp-net-core-razor">ASP.NET Core + MVC or Razor pages</option>
                <option value="asp-net-core-spa">ASP.NET Core + SPA Frontend (Angular, React, Vue, etc)</option>
                <option value="asp-net-core-blazor">ASP.NET Core + Blazor (Server or WebAssembly)</option>
                <option value="asp-net-4-mvc">ASP.NET 4 MVC</option>
                <option value="asp-net-4-webforms">ASP.NET 4 WebForms</option>
                <option value="net-winforms">.NET (Core) Windows Forms</option>
                <option value="net-wpf">.NET (Core) WPF</option>
                <option value="webapp-other">Web application on other platform (Java, Node.js, PHP, Python, etc) </option>
                <option value="other">Any other type of application</option>
            </select>
            <div class="trial-sub-options">
                <form id="trial-option-asp-net-core-spa" name="trial-option-asp-net-core-spa" class="trial-option p-4 border bd-default mb-4">
                    <input type="radio" data-role="radio" name="frontend" data-caption="Angular" value="angular" checked/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="React" value="react"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Vue" value="vue"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Other" value="other"/>
                </form>
                <form id="trial-option-spa-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="platform" data-label="Please, specify:"/>
                </form>
                <form id="trial-option-webapp-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="platform" data-label="Please, specify:"/>
                </form>
                <form id="trial-option-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="platform" data-label="Please, specify:"/>
                </form>
            </div>
            <div id="trial-sample-hint" class="mb-4" style="line-height: 1.5;"></div>

            <div id="trial-email-block">
                <h4 class="text-bold mt-4">Enter your email <span class="text-muted text-normal">(optional)</span></h4>
                <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                    We'll let you know when a sample for your platform is ready.
                </div>
                <input id="trial-email" type="email" placeholder="name@example.com" data-role="input" data-prepend="<span class='mif-envelop'></span>" name="email"/>
            </div>
        `,
            clsDialog: "eq-mobile-fullscreen",
            closeButton: true,
            defaultActions: false,
            overlay: true,
            overlayClickClose: false,
            customButtons: [
                {
                    text: "Send",
                    cls: "info rounded px-6 js-get-trial-action-btn",
                    onclick: function (button) {
                        const { app, frontend } = trialSelection();
                        const optionId = app === "asp-net-core-spa" ? "spa-other" : app;
                        const platform = document.getElementById("trial-option-" + optionId).elements.platform.value.trim();
                        const email = document.getElementById("trial-email").value.trim();

                        button.disabled = true;

                        if (typeof grecaptcha !== 'undefined') {
                            grecaptcha.ready(function () {
                                grecaptcha
                                    .execute(reCaptchaSiteKey, { action: "eq_trial" })
                                    .then(function (token) {
                                        return processTrialRequest(app, platform, email, token);
                                    })
                                    .catch(function (error) {
                                        console.error("reCAPTCHA error:", error);
                                        closeDialogs();
                                    });
                            });
                        } else {
                            console.warn("grecaptcha is not defined");
                            processTrialRequest(app, platform, email, "dummy_token");
                        }
                    }
                },
                {
                    text: "Cancel",
                    cls: "js-dialog-close flat fg-gray",
                    onclick: function () {
                    }
                }
            ],
            onOpen: function () {
                const selectApptype = document.getElementById("select-apptype");
                if (selectApptype) {
                    // A real link rather than one of the dialog's buttons: the click itself opens
                    // the tab, so no popup blocker interferes, and it works with analytics blocked.
                    const link = document.createElement("a");
                    link.id = "trial-open-sample";
                    link.className = "button info rounded px-6";
                    link.target = "_blank";
                    link.rel = "noopener";
                    link.textContent = "Open the sample on GitHub ↗";
                    document.querySelector(".js-get-trial-action-btn").before(link);

                    link.addEventListener("click", function () {
                        const { app, sample } = trialSelection();
                        if (window.KorzhAnalytics) {
                            window.KorzhAnalytics.trackEvent('trial.dialog.redirected', { ptag: 'EQN', sample: sample.name, apptype: app });
                        }
                        // after the click: the link must still be there when the browser follows it
                        setTimeout(() => showTrialNextSteps(sample), 0);
                    });

                    selectApptype.addEventListener("change", updateTrialDialog);
                    document.forms["trial-option-asp-net-core-spa"].addEventListener("change", updateTrialDialog);
                    updateTrialDialog();
                }
            }
        });
    }

    // Switches the open trial dialog to its result. Does nothing if the visitor has closed it.
    function setTrialResult(title, content) {
        const selectApptype = document.getElementById("select-apptype");
        if (!selectApptype) return false;

        const dialog = selectApptype.closest(".dialog");
        dialog.querySelector(".dialog-title").innerHTML = `<span class='mif-checkmark fg-green pr-2'></span> ${title}`;
        dialog.querySelector(".dialog-content").innerHTML = content;
        dialog.querySelector(".dialog-actions").innerHTML = `<button class="button rounded px-6 js-dialog-close">Close</button>`;
        return true;
    }

    function showTrialNextSteps(sample) {
        const keyStep = sample.edition
            ? `<b>License key:</b> you don't need one to try it. Without a key the sample shows a short reminder that EasyQuery is in trial mode; a purchased license key removes it.`
            : `<b>License key:</b> you don't need one to start. On the first run the sample shows a <i>No license</i> dialog: enter your email and the code we send to it, and you get a free 30-day trial key.`;

        const licensingHash = "#" + (sample.edition || "licensing");
        const licensingOnThisPage = !!document.getElementById("license-price");

        const shown = setTrialResult("The sample is open in a new tab", `
            <div style="font-size: 1.05rem; line-height: 1.6;">
                <b>eq-samples-${sample.name}</b> on GitHub. If the tab didn't open, <a href="${sampleRepoUrl(sample)}" target="_blank" rel="noopener" class="fg-primary">open it here ↗</a>.
            </div>
            <ol class="mt-4 mb-4 ml-5" style="font-size: 1.05rem; line-height: 1.6;">
                <li class="mb-2"><b>Get the code:</b> <i>Code → Download ZIP</i> on GitHub, or <code>git clone</code> the repository.</li>
                <li class="mb-2"><b>Run it:</b> open <code>${sample.solution}</code> in Visual Studio and start the sample you want.</li>
                <li class="mb-2">${keyStep}</li>
            </ol>
            <div class="mt-2 text-left">
                <b>Ready to buy?</b>
                <a id="trial-licensing-link" href="${licensingOnThisPage ? "" : "/easyquery"}${licensingHash}" class="fg-primary">
                    <span class="mif-cart-product pr-2"></span> See licensing options
                </a>
            </div>
            <div class="mt-2 text-left">
                <a href="https://korzh.com/easyquery/docs/getting-started/from-sample-to-your-own-project" target="_blank" class="fg-primary">
                    <span class="mif-books pr-2"></span> Getting started with the sample
                </a>
            </div>
            <div class="mt-2 text-left">
                <a href="https://korzh.com/easyquery/docs/getting-started" target="_blank" class="fg-primary">
                    <span class="mif-books pr-2"></span> EasyQuery documentation
                </a>
            </div>
        `);

        if (shown && licensingOnThisPage) {
            document.getElementById("trial-licensing-link").addEventListener("click", function (e) {
                e.preventDefault();
                closeDialogs();
                showLicensing(sample.edition);
            });
        }
    }

    function showTrialThanks(email) {
        const shown = setTrialResult("Thanks — we've noted your platform", `
            <div class="mb-4" style="font-size: 1.05rem; line-height: 1.6;">
                There's no ready-made sample for it yet, but EasyQuery's browser UI works with any backend that implements its REST API.
                <span id="trial-thanks-notify" style="display: none;">We'll let you know at <b id="trial-thanks-email"></b> when there is one.</span>
            </div>
            <div class="mt-2 text-left">
                <a href="https://korzh.com/easyquery/docs/getting-started" target="_blank" class="fg-primary">
                    <span class="mif-books pr-2"></span> EasyQuery documentation
                </a>
            </div>
            <div class="mt-2 text-left">
                <a href="https://korzh.com/easyquery/javascript/docs" target="_blank" class="fg-primary">
                    <span class="mif-books pr-2"></span> EasyQuery.JS documentation
                </a>
            </div>
            <div class="mt-2 text-left">
                <a href="https://github.com/easyquery" target="_blank" rel="noopener" class="fg-primary">
                    <span class="mif-github pr-2"></span> All samples on GitHub ↗
                </a>
            </div>
        `);

        if (shown && email) {
            document.getElementById("trial-thanks-email").textContent = email;
            document.getElementById("trial-thanks-notify").style.display = "";
        }
    }

    function closeDialogs() {
        if (typeof document !== 'undefined') {
            const existingDialogs = document.querySelectorAll('.dialog');
            existingDialogs.forEach(d => {
                if (typeof Metro !== 'undefined') {
                    const instance = Metro.getPlugin(d, 'dialog');
                    if (instance && typeof instance.close === 'function') {
                        instance.close();
                        return;
                    }
                }
                d.remove();
                const overlay = document.querySelector('.overlay');
                if (overlay) overlay.remove();
            });
        }
    }

    // The downloads, by the Uri of their item on account.korzh.com and the file behind it.
    // The site links through /d/{uri}, which records who downloads it and then redirects to the
    // file stored with that item on account.korzh.com; the file here is only used when the
    // analytics script is not there. Keep both in step, and create the item there before adding
    // one here: /d/ answers an unknown item with 404.
    const SAMPLES = {
        'ersk-community': 'https://cdn.korzh.com/download/ersk_community.zip'
    };

    function sampleUrl(name) {
        const fileUrl = SAMPLES[name];
        if (!fileUrl) return null;

        return window.KorzhAnalytics
            ? window.KorzhAnalytics.downloadUrl('samples/' + name, fileUrl)
            : fileUrl;
    }

    async function processTrialRequest(apptype, platform, email, token) {
        const url = `https://account.korzh.com/api/account/register`;

        const data = { intent: "get-trial", apptype, platform };
        const trialData = {
            email,
            captchaToken: token,
            data: window.KorzhAnalytics ? window.KorzhAnalytics.requestData(data) : data
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trialData)
            });

            if (!response.ok) {
                console.error("[EQ] Server error: " + response.status);
                closeDialogs();
                if (typeof Metro !== 'undefined' && Metro.toast && typeof Metro.toast.create === 'function') {
                    Metro.toast.create("Verification failed. Please try again.", {
                        clsToast: "alert",
                        position: "top"
                    });
                } else {
                    alert("Verification failed. Please try again.");
                }
                return;
            }
        } catch (error) {
            console.error("[EQ] API error:", error);
        }

        showTrialThanks(email);
    }

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    function showLoadIndicator() {
        if (typeof Metro !== 'undefined' && Metro.activity) {
            Metro.activity.open({
                type: "cycle",
                overlayColor: "#fff",
                overlayAlpha: .6,
                text: '<div class="mt-2 text-small">Loading...</div>'
            });
        }
    }


    // ==========================================
    // ERSK Logic (from easy-report-starter-kit.html)
    // ==========================================

    let getCommunityDialog = null;

    const btnGetErskCommunity = document.getElementsByClassName("get-ersk-community-btn");
    if (btnGetErskCommunity.length > 0) {
        Array.from(btnGetErskCommunity).forEach(btn => {
            btn.addEventListener("click", getERSKCommunity);
        });
    }

    function getERSKCommunity() {
        if (typeof Metro === 'undefined') return;

        if (window.KorzhAnalytics) {
            window.KorzhAnalytics.trackEvent('perk.dialog.opened', { ptag: 'ERSK' });
        }

        getCommunityDialog = Metro.dialog.create({
            title: "Get ERSK Community",
            content: `
              <div>
                  <p>When you download ERSK Community Edition, you'll get access to:</p>
                  <ul class="unstyled-list">
                      <li><span class="mif-checkmark fg-green mr-1"></span> Report Management</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> User Management</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> Report Sharing</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> Data visualization with tables</li>
                  </ul>
                  <p class="mt-4">You can optionally provide your email to receive setup instructions and updates.</p>
              </div>
              <form id="ersk-community-edition-form">
                  <div class="ersk-community-edition box">
                      <label>Email (optional):</label>
                      <input
                          type="email"
                          name="email"
                          id="ersk-email-input"
                          data-role="input"
                          data-validate="email"
                          placeholder="Enter your email..."
                      >
                  </div>
                  <div class="form-actions mt-4 d-flex flex-justify-right gap-2">
                      <button type="button" class="button js-dialog-close">Cancel</button>
                      <button
                          type="button"
                          id="ersk-download-btn"
                          class="button info"
                      >Download ERSK Community</button>
                  </div>
              </form>
          `,
            clsDialog: "get-community-dialog shadow-large",
            closeButton: true,
            defaultActions: false,
            customButtons: [],
            onOpen: function () {
                const downloadBtn = document.getElementById("ersk-download-btn");
                if (downloadBtn) {
                    downloadBtn.addEventListener("click", handleERSKDownload);
                }
            }
        });
    }

    function setErskButtonState(state) {
        const button = document.getElementById("ersk-download-btn");
        if (!button) return;
        if (state === "loading") {
            button.disabled = true;
            button.textContent = "Processing...";
        } else {
            button.disabled = false;
            button.textContent = "Download ERSK Community";
        }
    }

    function handleERSKDownload() {
        const emailInput = document.getElementById("ersk-email-input");
        const email = emailInput?.value.trim() || "";
        const downloadUrl = sampleUrl('ersk-community');

        // Перевірка валідності email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            if (typeof Metro !== 'undefined' && Metro.toast) {
                Metro.toast.create("Please enter a valid email address", null, 3000, "alert");
            }
            return;
        }

        const btn = document.getElementById("ersk-download-btn");
        const originalText = btn ? btn.textContent : "Download ERSK Community";

        // Блокуємо кнопку під час обробки
        setErskButtonState("loading");

        // Викликаємо reCAPTCHA v3
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(reCaptchaSiteKey, { action: "download_ersk" })
                    .then(function (token) {
                        console.log("OK");
                        return submitERSKData(email, token, downloadUrl);
                    })
                    .catch(function (error) {
                        console.error("reCAPTCHA error:", error);
                        if (btn) {
                            btn.disabled = false;
                            btn.textContent = originalText;
                        }
                    });
            });
        } else {
            console.warn("grecaptcha is not defined");
            submitERSKData(email, "dummy_token", downloadUrl);
        }
    }

    async function submitERSKData(email, recaptchaToken, downloadUrl) {
        const nextUrl = "https://korzh.com/easy-report-starter-kit/docs/setup-first-launch";
        const apiAuthoring = "https://account.korzh.com/api/account/register";

        const erskData = {
            intent: "get-perk", //register | get-trial | get-perk
            ptag: "ERSK", //The unique identifier of the product the user interested in.
            apptype: "ersk-community", //The type of the application the user going to use.
        };

        const data = {
            email,
            captchaToken: recaptchaToken, //The token of the Google CAPTCHA
            data: window.KorzhAnalytics ? window.KorzhAnalytics.requestData(erskData) : erskData,
        };

        try {
            const response = await fetch(apiAuthoring, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("[ERSK] Server error: " + response.status);
                return;
            }

            const result = await response.json();

            if (result?.status === 21) {
                // user already registered
            } else {
                if (typeof Metro !== 'undefined' && Metro.toast) {
                    Metro.toast.create("Your account has ben created! Thank you for using our products!", {
                        clsToast: "success",
                        position: "top",
                    });
                }
            }

            if (getCommunityDialog && typeof Metro !== 'undefined') {
                Metro.dialog.close(getCommunityDialog);
            }
        } catch (error) {
            console.error("[ERSK] API error:", error);
        }

        // Відкриваємо завантаження в новому вікні
        window.open(downloadUrl, "_blank");
        setTimeout(() => {
            window.location.href = nextUrl;
        }, 100);

        return null;
    }

});
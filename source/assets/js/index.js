document.addEventListener("DOMContentLoaded", () => {

    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    // ==========================================
    // EasyQuery Logic (from easyquery.html)
    // ==========================================

    const eqAction = window.location.href.split("#")[1];

    if (eqAction === 'get-trial') {
        getTrial();
    } else {
        const editions = ['asp-core-edition', 'asp-net-edition', 'winforms-edition', 'silverlight-edition', 'wpf-edition', 'delphi-edition'];
        if (editions.includes(eqAction)) {
            const licensingEl = document.getElementById("licensing");
            if (licensingEl) {
                licensingEl.scrollIntoView();
            }
            if (typeof $ !== 'undefined' && typeof Metro !== 'undefined') {
                Metro.getPlugin("#license-price", 'tabs').open(editions.indexOf(eqAction) + 1);
            }
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

    function trialChangeOptions(val) {
        if (typeof $ !== 'undefined') {
            $(".trial-sub-options > form").hide();
            $("#trial-option-" + val).show();
        }
    }

    function getTrial() {
        if (typeof Metro === 'undefined') return;

        Metro.dialog.create({
            title: "<span class='mif-magic-wand fg-primary pr-2'></span> Get EasyQuery Trial",
            content: `
            <h4 class="text-bold">Select your application type</h4>
            <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                EasyQuery framework can be used on different platforms and with different types of applications. So, to give you the most relevant installation instructions we need to know more about your project first.
            </div>
            <select id="select-apptype" class="mt-4 mb-4" data-role="select" data-filter="false">
                <option value="asp-net-core-razor">ASP.NET Core + MVC or Razor pages</option>
                <option value="asp-net-core-spa">ASP.NET Core + SPA Frontend (Angular, Razor, Vue, etc)</option>
                <option value="asp-net-4-mvc">ASP.NET 4 MVC</option>
                <option value="asp-net-4-webforms">ASP.NET 4 WebForms</option>
                <option value="net-winforms">.NET (Core) Windows Forms</option>
                <option value="net-wpf">.NET (Core) WPF</option>
                <option value="webapp-other">Web application on other platform (Java, Node.js, PHP, Python, etc) </option>
                <option value="other">Any other type of application</option>
            </select>
            <div class="trial-sub-options">
                <form id="trial-option-asp-net-core-razor" class="trial-option p-4 border bd-default mb-4">
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="MVC" value="mvc" checked/>
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="Razor Pages" value="razor-pages"/>
                </form>
                <form id="trial-option-asp-net-core-spa" name="trial-option-asp-net-core-spa" class="trial-option p-4 border bd-default mb-4">
                    <input type="radio" data-role="radio" name="frontend" data-caption="Angular" value="angular"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="React" value="react"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Vue" value="vue"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Other" value="other" checked/>
                </form>
                <form id="trial-option-asp-net-4-mvc" class="trial-option"></form>
                <form id="trial-option-asp-net-4-webforms" class="trial-option"></form>
                <form id="trial-option-net-winforms" class="trial-option"></form>
                <form id="trial-option-net-wpf" class="trial-option"></form>
                <form id="trial-option-webapp-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="backend" data-label="Please, specify:"/>
                </form>
                <form id="trial-option-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="apptype" data-label="Please, specify:"/>
                </form>
            </div>

            <h4 class="text-bold mt-4">Enter your email <span class="text-muted text-normal">(optional)</span></h4>
            <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                We will provide the detailed instructions on how to get the things worked.
            </div>
            <input id="trial-email" type="email" placeholder="name@example.com" data-role="input" data-prepend="<span class='mif-envelop'></span>" name="email"/>
        `,
            closeButton: true,
            defaultActions: false,
            overlay: true,
            overlayClickClose: false,
            customButtons: [
                {
                    id: "get-trial-btn-in-dialog",
                    text: "Get Trial",
                    cls: "info rounded px-6 js-get-trial-action-btn",
                    onclick: async function () {
                        const app = document.getElementById("select-apptype").value;
                        const email = document.getElementById("trial-email").value;

                        setEqButtonState("loading");

                        if (typeof grecaptcha !== 'undefined') {
                            grecaptcha.ready(function () {
                                grecaptcha
                                    .execute(reCaptchaSiteKey, { action: "eq_trial" })
                                    .then(function (token) {
                                        return processTrialRequest(app, email, token);
                                    })
                                    .catch(function (error) {
                                        console.error("reCAPTCHA error:", error);
                                        setEqButtonState("default");
                                        closeDialogs();
                                    });
                            });
                        } else {
                            console.warn("grecaptcha is not defined");
                            processTrialRequest(app, email, "dummy_token");
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
                    selectApptype.addEventListener("change", function () {
                        trialChangeOptions(this.value);
                    });
                    trialChangeOptions(selectApptype.value);
                }
            }
        });
    }

    function setEqButtonState(state) {
        let button = document.getElementById("get-trial-btn-in-dialog");
        if (!button) {
            button = document.querySelector(".js-get-trial-action-btn");
        }
        if (!button) {
            console.warn("Could not find Get Trial button to change state.");
            return;
        }

        const caption = button.querySelector(".caption") || button;
        if (state === "loading") {
            button.disabled = true;
            caption.innerHTML = "Processing...";
        } else {
            button.disabled = false;
            caption.innerHTML = "Get Trial";
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

    async function processTrialRequest(apptype, email, token) {
        const url = `https://account.korzh.com/api/account/register`;

        let nextHref = 'https://korzh.com/easyquery/docs/getting-started';
        let downloadUrl = null;
        switch (apptype) {
            case 'asp-net-core-razor':
                downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNetCore-Razor-Mvc.zip';
                break;
            case 'asp-net-core-spa':
                const form = document.forms["trial-option-asp-net-core-spa"];
                if (form && form.elements.frontend) {
                    const spaType = form.elements.frontend.value;
                    switch (spaType) {
                        case 'angular':
                            downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNetCore-Angular.zip';
                            break;
                        case 'react':
                            downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNetCore-React.zip';
                            break;
                        case 'vue':
                            downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNetCore-Vue3.zip';
                            break;
                        case 'other':
                            break;
                    }
                }
                break;
            case 'asp-net-4-mvc':
                downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNet4-Mvc.zip';
                break;
            case 'asp-net-4-webforms':
                downloadUrl = 'https://cdn.korzh.com/dot-net-samples/AspNet4-WebForms.zip';
                break;
            case 'net-winforms':
                downloadUrl = 'https://cdn.korzh.com/dot-net-samples/WinForms.zip';
                break;
            case 'net-wpf':
                downloadUrl = 'https://cdn.korzh.com/dot-net-samples/Wpf.zip';
                break;
            case 'webapp-other':
            case 'other':
                break;
        }

        const trialData = {
            email,
            captchaToken: token,
            data: {
                intent: "get-trial",
                apptype
            }
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

        let dialogContent = `
            <div class="text-center pt-8 pb-4">
                <div class="mb-4">
                    <span class="mif-checkmark fg-green" style="font-size: 64px; line-height: 1; text-shadow: 0 4px 12px rgba(0, 128, 0, 0.2);"></span>
                </div>
                <h3 class="text-light mb-6">Thank You!</h3>
        `;

        if (downloadUrl) {
            dialogContent += `
                <div class="mx-auto" style="max-width: 400px;">
                    <div class="p-4 border bd-default mb-6">
                        <div id="download-countdown-text" class="text-medium text-bold">
                            Your download will start shortly in <span id="download-countdown" class="fg-red text-leader">5</span> seconds...
                        </div>
                        <div class="mt-2 text-muted">
                            If your download does not start automatically, <a href="${downloadUrl}" target="_blank" id="manual-download-link" class="fg-primary">click here</a>.
                        </div>
                    </div>
                </div>
            `;
        }

        dialogContent += `
                <div class="mb-6 mx-auto" style="max-width: 400px;">
                    <a href="${nextHref}" target="_blank" class="button primary outline rounded w-100 flex-justify-center">
                        <span>Open the documentation to learn more</span>
                        <span class="mif-arrow-right ml-2"></span>
                    </a>
                </div>
            </div>
        `;

        closeDialogs();

        setTimeout(() => {
            let downloadInterval = null;
            if (typeof Metro === 'undefined') return;

            Metro.dialog.create({
                title: "",
                content: dialogContent,
                closeButton: true,
                defaultActions: false,
                actionsAlign: "center",
                customButtons: [
                    {
                        text: 'Close',
                        cls: "js-dialog-close flat fg-gray",
                        onclick: function () { }
                    }
                ],
                onOpen: function () {
                    if (downloadUrl) {
                        let count = 5;

                        const manualLink = document.getElementById('manual-download-link');
                        if (manualLink) {
                            manualLink.addEventListener('click', () => {
                                if (downloadInterval) {
                                    clearInterval(downloadInterval);
                                }
                                const countdownText = document.getElementById('download-countdown-text');
                                if (countdownText) {
                                    countdownText.style.display = 'none';
                                }
                            });
                        }

                        downloadInterval = setInterval(() => {
                            count--;
                            const counterEl = document.getElementById('download-countdown');
                            if (counterEl) {
                                counterEl.innerText = count;
                            }
                            if (count <= 0) {
                                clearInterval(downloadInterval);
                                const countdownText = document.getElementById('download-countdown-text');
                                if (countdownText) {
                                    countdownText.style.display = 'none';
                                }
                                window.open(downloadUrl, '_blank');
                            }
                        }, 1000);
                    }
                },
                onClose: function () {
                    if (downloadInterval) {
                        clearInterval(downloadInterval);
                    }
                }
            });
        }, 300);
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

    const btnGetErskCommunity = document.getElementById("btn-get-ersk-community");
    if (btnGetErskCommunity) {
        btnGetErskCommunity.addEventListener("click", getERSKCommunity);
    }

    function getERSKCommunity() {
        if (typeof Metro === 'undefined') return;

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
        const downloadUrl = "https://cdn.korzh.com/download/ersk_community.zip";

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

        const data = {
            email,
            captchaToken: recaptchaToken,
            data: {
                intent: "get-perk",
                ptag: "EQN-ANC",
            },
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
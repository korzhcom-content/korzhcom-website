// EasyQuery product-page logic: hash-action routing, Get Trial dialog,
// trial-request submission with reCAPTCHA. Loaded only on /easyquery
// via the `bundle: easyquery` front-matter key.

document.addEventListener("DOMContentLoaded", () => {
    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    // Inject EQ-specific mobile-fullscreen dialog CSS.
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

    // Hash-action routing: /easyquery#get-trial opens the trial dialog,
    // /easyquery#asp-core-edition (and siblings) scroll to the licensing
    // section and open the matching tab.
    const eqAction = window.location.href.split("#")[1];

    if (eqAction === "get-trial") {
        getTrial();
    } else {
        const editions = [
            "asp-core-edition",
            "asp-net-edition",
            "winforms-edition",
            "silverlight-edition",
            "wpf-edition",
            "delphi-edition",
        ];
        if (editions.includes(eqAction)) {
            const licensingEl = document.getElementById("licensing");
            if (licensingEl) {
                licensingEl.scrollIntoView();
            }
            if (typeof $ !== "undefined" && typeof Metro !== "undefined") {
                Metro.getPlugin("#license-price", "tabs").open(editions.indexOf(eqAction) + 1);
            }
        }
    }

    // "Get Trial" button.
    const getTrialBtn = document.getElementById("btn-get-trial");
    if (getTrialBtn) {
        getTrialBtn.addEventListener("click", (e) => {
            e.preventDefault();
            getTrial();
        });
    }

    function trialChangeOptions(val) {
        if (typeof $ !== "undefined") {
            $(".trial-sub-options > form").hide();
            $("#trial-option-" + val).show();
        }
    }

    function getTrial() {
        if (typeof Metro === "undefined") return;

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
            clsDialog: "eq-mobile-fullscreen",
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

                        closeDialogs();

                        setTimeout(() => {
                            if (typeof Metro !== "undefined") {
                                Metro.dialog.create({
                                    title: "",
                                    clsDialog: "eq-processing-dialog shadow-large eq-mobile-fullscreen",
                                    content: `
                                        <div style="position: relative;">
                                            <!-- Ghost container to pre-stretch the dialog to exact destination size -->
                                            <div style="visibility: hidden; pointer-events: none; opacity: 0; padding-top: 2rem; padding-bottom: 1rem;">
                                                <div class="mx-auto" style="max-width: 400px; padding: 1rem; margin-bottom: 1.5rem; border: none;">
                                                    <h3 class="text-bold">Your download will start shortly in <span class="fg-green text-leader">5</span> seconds...</h3>
                                                    <h3 class="mt-2 text-muted">If your download does not start automatically, click here.</h3>
                                                </div>
                                            </div>

                                            <div id="eq-processing-state" class="text-center" style="position: absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index: 2;">
                                                <div class="mb-4">
                                                    <div data-role="activity" data-type="cycle" data-style="color" style="margin: 0 auto; transform: scale(1.5);"></div>
                                                </div>
                                                <h3 class="text-light mt-4 mb-0">Assembling a sample project for you...</h3>
                                            </div>

                                            <div id="eq-result-state" style="position: absolute; top:0; left:0; right:0; bottom:0; z-index: 3; display:flex; flex-direction:column; justify-content:center; opacity: 0; pointer-events: none; visibility: hidden;"></div>
                                        </div>
                                    `,
                                    closeButton: true,
                                    defaultActions: false,
                                    overlay: true,
                                    overlayClickClose: false,
                                    customButtons: [
                                        {
                                            text: "Close",
                                            cls: "js-dialog-close flat fg-gray",
                                            onclick: function () {},
                                        },
                                    ],
                                    onOpen: function () {
                                        if (typeof grecaptcha !== "undefined") {
                                            grecaptcha.ready(function () {
                                                grecaptcha
                                                    .execute(reCaptchaSiteKey, { action: "eq_trial" })
                                                    .then(function (token) {
                                                        return processTrialRequest(app, email, token);
                                                    })
                                                    .catch(function (error) {
                                                        console.error("reCAPTCHA error:", error);
                                                        closeDialogs();
                                                    });
                                            });
                                        } else {
                                            console.warn("grecaptcha is not defined");
                                            processTrialRequest(app, email, "dummy_token");
                                        }
                                    },
                                });
                            }
                        }, 50);
                    },
                },
                {
                    text: "Cancel",
                    cls: "js-dialog-close flat fg-gray",
                    onclick: function () {},
                },
            ],
            onOpen: function () {
                const selectApptype = document.getElementById("select-apptype");
                if (selectApptype) {
                    selectApptype.addEventListener("change", function () {
                        trialChangeOptions(this.value);
                    });
                    trialChangeOptions(selectApptype.value);
                }
            },
        });
    }

    function closeDialogs() {
        if (typeof document !== "undefined") {
            const existingDialogs = document.querySelectorAll(".dialog");
            existingDialogs.forEach((d) => {
                if (typeof Metro !== "undefined") {
                    const instance = Metro.getPlugin(d, "dialog");
                    if (instance && typeof instance.close === "function") {
                        instance.close();
                        return;
                    }
                }
                d.remove();
                const overlay = document.querySelector(".overlay");
                if (overlay) overlay.remove();
            });
        }
    }

    async function processTrialRequest(apptype, email, token) {
        const url = `https://account.korzh.com/api/account/register`;

        let nextHref = "https://korzh.com/easyquery/docs/getting-started";
        let downloadUrl = null;
        switch (apptype) {
            case "asp-net-core-razor":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Razor-Mvc.zip";
                break;
            case "asp-net-core-spa":
                const form = document.forms["trial-option-asp-net-core-spa"];
                if (form && form.elements.frontend) {
                    const spaType = form.elements.frontend.value;
                    switch (spaType) {
                        case "angular":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Angular.zip";
                            break;
                        case "react":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-React.zip";
                            break;
                        case "vue":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Vue3.zip";
                            break;
                        case "other":
                            break;
                    }
                }
                break;
            case "asp-net-4-mvc":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNet4-Mvc.zip";
                break;
            case "asp-net-4-webforms":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNet4-WebForms.zip";
                break;
            case "net-winforms":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/WinForms.zip";
                break;
            case "net-wpf":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/Wpf.zip";
                break;
            case "webapp-other":
            case "other":
                break;
        }

        const trialData = {
            email,
            captchaToken: token,
            data: {
                intent: "get-trial",
                apptype,
            },
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(trialData),
            });

            if (!response.ok) {
                console.error("[EQ] Server error: " + response.status);
                closeDialogs();
                if (typeof Metro !== "undefined" && Metro.toast && typeof Metro.toast.create === "function") {
                    Metro.toast.create("Verification failed. Please try again.", {
                        clsToast: "alert",
                        position: "top",
                    });
                } else {
                    alert("Verification failed. Please try again.");
                }
                return;
            }
        } catch (error) {
            console.error("[EQ] API error:", error);
        }

        let dialogContent = "";

        if (downloadUrl) {
            dialogContent += `
                <div class="mx-auto">
                    <div class="p-4 bd-default mb-6">
                        <h3 id="download-countdown-text" class="text-bold text-center">
                            The sample project download will start in <span id="download-countdown" class="fg-green text-leader">5</span> seconds...
                        </h3>
                        <h4  class="mt-2 text-muted text-center" style="line-height: 1.5;">
                            <span id="manual-download-text">If the download does not start automatically,</span> <a href="${downloadUrl}" id="manual-download-link" class="fg-primary">click here</a>.
                        </h4>
                    </div>
                </div>
            `;
        }

        dialogContent += `
                <div class="mt-2 text-left">
                    <a href="https://korzh.com/easyquery/docs/getting-started/from-sample-to-your-own-project" target="_blank" class="fg-primary">
                        <span class="mif-books pr-2"></span> Getting started with the sample
                    </a>
                </div>
                <div class="mt-2 text-left">
                    <a href="${nextHref}" target="_blank" class="fg-primary">
                        <span class="mif-books pr-2"></span> EasyQuery documentation
                    </a>
                </div>
        `;

        const processingState = document.getElementById("eq-processing-state");
        const resultState = document.getElementById("eq-result-state");
        let downloadInterval = null;

        if (processingState) processingState.style.display = "none";

        if (resultState) {
            resultState.innerHTML = dialogContent;
            resultState.style.opacity = "1";
            resultState.style.pointerEvents = "auto";
            resultState.style.visibility = "visible";

            if (downloadUrl) {
                let count = 5;

                const manualLink = document.getElementById("manual-download-link");
                if (manualLink) {
                    manualLink.addEventListener("click", () => {
                        if (downloadInterval) clearInterval(downloadInterval);
                        const countdownText = document.getElementById("download-countdown-text");
                        if (countdownText) countdownText.style.display = "none";
                    });
                }

                downloadInterval = setInterval(() => {
                    if (!document.getElementById("eq-result-state")) {
                        clearInterval(downloadInterval);
                        return;
                    }

                    count--;
                    const counterEl = document.getElementById("download-countdown");
                    if (counterEl) counterEl.innerText = count;
                    if (count <= 0) {
                        clearInterval(downloadInterval);
                        const countdownText = document.getElementById("download-countdown-text");
                        if (countdownText) countdownText.style.display = "none";
                        const manualDownloadText = document.getElementById("manual-download-text");
                        if (manualDownloadText)
                            manualDownloadText.innerText =
                                "The sample project download should have started automatically.\nIf not,";
                        window.location.href = downloadUrl;
                    }
                }, 1000);
            }
        }
    }
});

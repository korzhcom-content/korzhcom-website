// ERSK product-page logic: the Get ERSK Community dialog and download flow.
// Loaded only on /easy-report-starter-kit via the `bundle: ersk`
// front-matter key.

document.addEventListener("DOMContentLoaded", () => {
    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    let getCommunityDialog = null;

    const btnGetErskCommunity = document.getElementsByClassName("get-ersk-community-btn");
    if (btnGetErskCommunity.length > 0) {
        Array.from(btnGetErskCommunity).forEach((btn) => {
            btn.addEventListener("click", getERSKCommunity);
        });
    }

    function getERSKCommunity() {
        if (typeof Metro === "undefined") return;

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
            },
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            if (typeof Metro !== "undefined" && Metro.toast) {
                Metro.toast.create("Please enter a valid email address", {
                    clsToast: "alert",
                    position: "top",
                });
            }
            return;
        }

        const btn = document.getElementById("ersk-download-btn");
        const originalText = btn ? btn.textContent : "Download ERSK Community";

        setErskButtonState("loading");

        if (typeof grecaptcha !== "undefined") {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(reCaptchaSiteKey, { action: "download_ersk" })
                    .then(function (token) {
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
                ptag: "ERSK",
                apptype: "ersk-community",
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
                // user already registered — silent
            } else {
                if (typeof Metro !== "undefined" && Metro.toast) {
                    Metro.toast.create("Your account has ben created! Thank you for using our products!", {
                        clsToast: "success",
                        position: "top",
                    });
                }
            }

            if (getCommunityDialog && typeof Metro !== "undefined") {
                Metro.dialog.close(getCommunityDialog);
            }
        } catch (error) {
            console.error("[ERSK] API error:", error);
        }

        window.open(downloadUrl, "_blank");
        setTimeout(() => {
            window.location.href = nextUrl;
        }, 100);

        return null;
    }
});

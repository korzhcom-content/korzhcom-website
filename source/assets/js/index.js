function trialChangeOptions(val) {
    $(".trial-sub-options > form").hide()
    $("#trial-option-" + val).show()
}

function getTrial() {
    Metro.dialog.create({
        title: "Get EasyQuery Trial",
        content: `

            <h4>Select your application type:</h4>
            <div class="remark dark">
                EasyQuery framework can be used on different platforms and with different types of applications. So, to give you the most relevant installation instructions we need to know more about your project first.
            </div>
            <select id="select-apptype" class="mt-4 mb-4" data-role="select" data-filter="false" onchange="trialChangeOptions(this.value)">
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
                <form id="trial-option-asp-net-core-razor" class="trial-option border bd-default p-4">
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="MVC" value="mvc" checked/>
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="Razor Pages" value="razor-pages"/>
                </form>
                <form id="trial-option-asp-net-core-spa" name="trial-option-asp-net-core-spa" class="trial-option border bd-default p-4">
                    <input type="radio" data-role="radio" name="frontend" data-caption="Angular" value="angular"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="React" value="react"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Vue" value="vue"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Other" value="other" checked/>
                </form>
                <form id="trial-option-asp-net-4-mvc" class="trial-option"></form>
                <form id="trial-option-asp-net-4-webforms" class="trial-option"></form>
                <form id="trial-option-net-winforms" class="trial-option"></form>
                <form id="trial-option-net-wpf" class="trial-option"></form>
                <form id="trial-option-webapp-other" class="trial-option border bd-default p-4">
                    <input type="text" data-role="input" name="backend" data-label="Please, specify:"/>
                </form>
                <form id="trial-option-other" class="trial-option border bd-default p-4">
                    <input type="text" data-role="input" name="apptype" data-label="Please, specify:"/>
                </form>
            </div>

            <h4>Enter your email (optional):</h4>
            <div class="remark dark">
                We will provide the detailed instructions on how to get the things worked
            </div>
            <input id="trial-email" type="email" placeholder="name@example.com" data-role="input" name="email"/>

        `,
        closeButton: true,
        defaultActions: false,
        customButtons: [
            {
                text: "Get Trial",
                cls: "js-dialog-close success",
                onclick: async function () {

                    const url = 'https://localhost:26114/api/trial/register' // `https://account.korzh.com/api/trial/register`
                    const app = $("#select-apptype").val()
                    const email = $("#trial-email").val()

                    let nextHref = 'https://korzh.com/easyquery/docs/getting-started'
                    switch (app) {
                        case 'asp-net-core-razor':
                            window.open('https://cdn.korzh.com/dot-net-samples/AspNetCore-Razor-Mvc.zip');
                            break;
                        case 'asp-net-core-spa':
                            const form = document.forms["trial-option-asp-net-core-spa"]
                            const spaType = form.elements.frontend.value
                            switch (spaType) {
                                case 'angular':
                                    window.open('https://cdn.korzh.com/dot-net-samples/AspNetCore-Angular.zip');
                                    break;
                                case 'react':
                                    window.open('https://cdn.korzh.com/dot-net-samples/AspNetCore-React.zip');
                                    break;
                                case 'vue':
                                    window.open('https://cdn.korzh.com/dot-net-samples/AspNetCore-Vue3.zip');
                                    break;
                                case 'other':
                                    break;
                            }
                            break;
                        case 'asp-net-4-mvc':
                            window.open('https://cdn.korzh.com/dot-net-samples/AspNet4-Mvc.zip');
                            break;
                        case 'asp-net-4-webforms':
                            window.open('https://cdn.korzh.com/dot-net-samples/AspNet4-WebForms.zip');
                            break;
                        case 'net-winforms':
                            window.open('https://cdn.korzh.com/dot-net-samples/WinForms.zip');
                            break;
                        case 'net-wpf':
                            window.open('https://cdn.korzh.com/dot-net-samples/Wpf.zip');
                            break;
                        case 'webapp-other':
                            break;
                        case 'other':
                            break;
                    }

                    const trialData = {
                        apptype: `${app}`,
                        referrer: `${document.referrer}`,
                        query: `${document.location.search}`,
                        email: `${email}`
                    };

                    try {
                        await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(trialData)
                        });

                    } catch (error) {
                    }

                    window.location.href = nextHref
                }
            },
            {
                text: "Cancel",
                cls: "js-dialog-close",
                onclick: function () {
                }
            }
        ]
    })
}

window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload()
    }
};

function showLoadIndicator() {
    Metro.activity.open({
        type: "cycle",
        overlayColor: "#fff",
        overlayAlpha: .6,
        text: '<div class="mt-2 text-small">Loading...</div>'
    })
}

$(() => {
    $("body").on("click", "a[slow-loading]", function () {
        showLoadIndicator();
    })
})

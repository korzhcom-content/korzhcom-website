function trialChangeOptions(val){
    $(".trial-sub-options > form").hide()
    $("#trial-option-"+val).show()
}

function getTrial(){
    Metro.dialog.create({
        title: "Get EasyQuery Trial",
        content: `

            <h3>Select your application type:</h3>
            <div class="remark">
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
                <form id="trial-option-asp-net-core-spa" class="trial-option border bd-default p-4">
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

        `,
        closeButton: true,
        defaultActions: false,
        customButtons: [
            {
                text: "Get Trial",
                cls: "js-dialog-close success",
                onclick: function(){
                    const url = `https://account.korzh.com/get-trial`
                    const app = $("#select-apptype").val()
                    const form = $(`#trial-option-${app}`)
                    const email = ''

                    form.attr("method", "POST")
                    form.attr("action", url)
                    form.append($(`<input type='hidden' name='apptype' value='${app}'>`))
                    form.append($(`<input type='hidden' name='referrer' value='${document.referrer}'>`))
                    form.append($(`<input type='hidden' name='query' value='${document.location.search}'>`))
                    form.append($(`<input type='hidden' name='email' value='${email}'>`))

                    form[0].submit()
                    setTimeout(() => showLoadIndicator(), 100)
                }
            },
            {
                text: "Cancel",
                cls: "js-dialog-close",
                onclick: function(){
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

$(()=>{
    $("body").on("click", "a[slow-loading]", function() {
        showLoadIndicator();
    })
})

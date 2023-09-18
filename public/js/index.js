window.addEventListener("load", (event) => {
    document.getElementById('SigninBtn').onclick = (event) => {
        GAZDA_CLIENT.ui.showAuthDialog({
            signInFirst: true,
            registerForm: {
                //title: 'Download EasyReport Starter Kit',         
                //introHtml: 'Please provide your email address to get the download link and instructions on how to set up and run ERSK solution',
                //askPassword: true,
                askConsent: true,
                //submitButtonText: 'Get ERSK Community',
                consentLabelHtml: 'I agree with the <a href="/terms-of-use">Terms of Use</a> and the <a href="/privacy">Privacy Policy</a>.<br />' +
                                    'I also agree to receive email communications from Korzh.com. Consent may be withdrawn at any time.',
            },
            loginForm: {
                //submitButtonText: 'Sign in',
                //askPassword: true,
                askConsent: false,
            },
            afterRegisterTitle: 'Please check your Inbox',
            afterRegisterBody: `<div>We sent an email to <strong>{{email}}</strong>. You will find the download link there. </div>` +
                                '<div style="margin-top:20px;font-size:0.9em">NB: Don\'t forgot to check your SPAM folder ' +
                                'if the message does not arrive within the next 5 minutes and mark it as "Not Spam" if it\'s there.</div>',
            autoSignIn: false,
//            data: {
//                intent: 'get-perk',
//                ctag: 'ERSK-FREE',
//                diid: 774
//            }
        });
        return false;
    };
})

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
        actions: [
            {
                caption: "Get Trial",
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
                }
            },
            {
                caption: "Cancel",
                cls: "js-dialog-close",
                onclick: function(){
                }
            }
        ]
    })
}
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

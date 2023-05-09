import { utils } from '@easydata/core';
import { domel, DomElementBuilder, DefaultDialogService, dialogs, Dialog, DialogOptions, DialogSet } from '@easydata/ui';
import * as auth from './auth';

export namespace ui {  
    let dialogService = new DefaultDialogService();

    export interface AuthFormOptions {    
        title?: string;
        introHtml?: string;
        askPassword? : boolean;
        askContactName?: boolean;
        askConsent?: boolean
        consentLabelHtml?: string;
        submitButtonText? : string;
        altLinkHtml?: string;
        altLinkPage?: number;
    }
    export interface AuthDialogOptions {       
        registerForm : AuthFormOptions,
        loginForm : AuthFormOptions,
        afterRegisterTitle?: string;
        afterRegisterBody?: string;
        afterLoginTitle?: string;
        afterLoginBody?: string;
        recaptchaSiteKey?: string;
        signInFirst?: boolean;
        autoSignIn?: boolean;
        successUrl?: string;
        cancelUrl?: string;
        data? : any;
    }

    let dialogSet: DialogSet;
    let authDialogOptions: AuthDialogOptions = {
        registerForm: {},
        loginForm: {}
    };

    export function showAuthDialog(options : AuthDialogOptions) {
        authDialogOptions = options;
        let registerFormOptions : AuthFormOptions = options.registerForm;

        if (typeof(registerFormOptions.askContactName) == 'undefined') {           
            registerFormOptions.askContactName = true;
        }

        if (!registerFormOptions.title) {
            registerFormOptions.title = 'Sign up with email';
        }

        if (!registerFormOptions.submitButtonText) {           
            registerFormOptions.submitButtonText = 'Sign Up';
        }

        if (!options.autoSignIn && !registerFormOptions.altLinkHtml) {
            registerFormOptions.altLinkHtml = 'Already have an account? Please [[Sign In]].'
        }
        
        if (!registerFormOptions.altLinkPage) {
            registerFormOptions.altLinkPage = 2;
        }
        
        if (!registerFormOptions.askConsent && registerFormOptions.consentLabelHtml) {
            registerFormOptions.consentLabelHtml = 
                'I agree with the <a href="/terms" target="_blank">Terms of Use</a> and the <a href="/privacy" target="_blank">Privacy Policy</a>.'
        }

        if (!options.afterRegisterTitle) {
            options.afterRegisterTitle = 'Done! Please check your inbox';
        }

        if (!options.afterRegisterBody) {
            options.afterRegisterBody = `<div>Click the link we sent to <strong>{{email}}</strong> to complete your account set-up. </div>` +
                    '<div style="margin-top:20px;font-size:0.9em">NB: Don\'t forgot to check your SPAM folder ' +
                    'if the message does not arrive within the next 5 minutes and mark it as "Not Spam" if it\'s there.</div>';        
        }
        
        const regFormBody = buildAuthForm(registerFormOptions);

        const loginFormOptions : AuthFormOptions = options.loginForm; 
        loginFormOptions.askContactName = false;
        loginFormOptions.askConsent = false;

        if (!loginFormOptions.title) {
            loginFormOptions.title = 'Sign in with email';
        }
        if (!loginFormOptions.submitButtonText) {           
            loginFormOptions.submitButtonText = 'Sign In';
        }

        if (!loginFormOptions.introHtml) {
            loginFormOptions.introHtml = 'Enter the email address associated with your account, and we’ll send a link that will sign you in.'
        }
        if (!loginFormOptions.altLinkHtml) {
            loginFormOptions.altLinkHtml = "Don't have an account yet? Please [[Sign Up]].";
        }
        if (!loginFormOptions.altLinkPage) {
            loginFormOptions.altLinkPage = 0;
        }       

        let authDialogs: DialogOptions[] = [
            {
                title: registerFormOptions.title,
                body: regFormBody,
                submitButtonText: registerFormOptions.submitButtonText,
                onShow: validateForm,
                onInput: validateForm,
                onDestroy: checkIfAllClosed,
                onSubmit: (dlg: Dialog) => {   
                    const emailInput = document.getElementById('gazdaAuthEmail') as HTMLInputElement;
                    const contactNameInput = document.getElementById('gazdaAuthName') as HTMLInputElement;
                    const passwordInput = document.getElementById('gazdaAuthPassword') as HTMLInputElement;
                    const consentInput  = document.getElementById('gazdaAuthConsent') as HTMLInputElement;
    
                    const authEmail = emailInput.value;
                    const authRequest : auth.AuthRequest = {
                        email: authEmail,
                        name: contactNameInput.value,
                        referrer: document.referrer
                    }
    
                    if (passwordInput) {
                        authRequest.password = passwordInput.value;
                    }
    
                    fillAuthRequest(authRequest, options);

                    dlg.disableButtons();
                    auth.registerAccount(authRequest)
                        .then(result => {
                            dialogSet.openNext({ email: authEmail });
                        })
                        .catch(error => {
                            dlg.showAlert(error.message, "error", true);
                            dlg.enableButtons();
                        });
                    return false;                
                }
            },
            {
                title: options.afterRegisterTitle,               
                body: options.afterRegisterBody,
                submitable: false,
                onDestroy: checkIfAllClosed
            }
        ];

        if (!options.autoSignIn) {
            const loginFormBody = buildAuthForm(loginFormOptions);

            if (!options.afterLoginTitle) {
                options.afterLoginTitle = 'Please check your inbox';
            }
    
            if (!options.afterLoginBody) {
                options.afterLoginBody = `<div>Click the link we sent to <strong>{{email}}</strong> to sign-in. </div>` +
                        '<div style="margin-top:20px;font-size:0.9em">NB: Don\'t forgot to check your SPAM folder ' +
                        'if the message does not arrive within the next 5 minutes and mark it as "Not Spam" if it\'s there.</div>';
            }

            authDialogs.push(            {
                title: loginFormOptions.title,
                body: loginFormBody,
                submitButtonText: loginFormOptions.submitButtonText,
                onShow: validateForm,
                onInput: validateForm,
                onDestroy: checkIfAllClosed,
                onSubmit: (dlg) => {   
                    const emailInput = document.getElementById('gazdaAuthEmail') as HTMLInputElement;
                    const passwordInput = document.getElementById('gazdaAuthPassword') as HTMLInputElement;
    
                    const authEmail = emailInput.value;
                    const accountDescriptor : auth.AuthRequest = {
                        email: authEmail,
                        referrer: document.referrer
                    }
    
                    if (passwordInput) {
                        accountDescriptor.password = passwordInput.value;
                    }
    
                    fillAuthRequest(accountDescriptor, options);
                    
                    dlg.disableButtons();
                    auth.loginToAccount(accountDescriptor)
                        .then(result => {
                            dialogSet.openNext({ email: authEmail } );
                        })
                        .catch(error => {
                            dlg.showAlert(error.message, "error", true);
                            dlg.enableButtons();
                        });
                    return false;                
                }
            },
            {
                title: options.afterLoginTitle,               
                body: options.afterLoginBody,
                submitable: false,
                onDestroy: checkIfAllClosed
            });
        }

        dialogSet = dialogService.createSet(authDialogs);

        var startPage = options.signInFirst ? 2 : 0;
        const dialog1 = dialogSet.open(startPage);
    }

    function checkIfAllClosed(dialog: Dialog): void {
        setTimeout(() => {
            const allDialogs = dialogService.getAllDialogs();
            if (allDialogs.length == 0) {
                if (authDialogOptions.cancelUrl) {
                    window.location.href = authDialogOptions.cancelUrl;
                }    
            }    
        }, 100);
    }

    function validateForm(dialog : Dialog) : void {
        const submitButton = dialog.getSubmitButtonElement();
        submitButton.disabled = !isValidForm(dialog.getRootElement());
    }

    function fillAuthRequest(authRequest: auth.AuthRequest, options: AuthDialogOptions) {
        authRequest.successUrl = options.successUrl;
        authRequest.autoSignIn = options.autoSignIn;     
        authRequest.data = options.data;
    }

    function isValidForm(form : HTMLElement) {
        const emailInput = form.querySelector('[name="email"]') as HTMLInputElement;       
        if (emailInput && strIsEmpty(emailInput.value)) {
            return false;
        }

        const passwordInput = form.querySelector('[name="password"]') as HTMLInputElement;
        if (passwordInput && strIsEmpty(passwordInput.value)) {
            return false;
        }

        const consentCheckbox = form.querySelector('[name="consent"]') as HTMLInputElement;
        if (consentCheckbox && !consentCheckbox.checked) {
            return false;
        }

        return true;
    }

    function addInputField(parentBuilder:DomElementBuilder<HTMLDivElement>, inputOptions: any) : void {
        parentBuilder
            .addChild('label', b => b
                .attr('for', inputOptions.id)
                .addHtml(`${inputOptions.label} ${inputOptions.required ? '<sup style="color: red">*</sup>' : ''}: `)
            )
            .addChild('input', b => {
                b.id(inputOptions.id);
                b.name(inputOptions.name || inputOptions.id);
                b.type(inputOptions.type || 'text');
                if (typeof(inputOptions.value) !== 'undefined') {
                    b.value(inputOptions.value);    
                }
                if (inputOptions.onInput) {
                    b.on('input', inputOptions.onInput);
                }
            });
    }

    function addCheckboxField(parentBuilder:DomElementBuilder<HTMLDivElement>, checkboxOptions: any) : void {
        parentBuilder
            .addChild('label', lb => {
                lb.addClass('label-compact');
                if (checkboxOptions.onInput) {
                    lb.on('input', checkboxOptions.onInput);
                }
                    
                lb.addChild('input', chb => {
                    chb.id(checkboxOptions.id);
                    chb.name(checkboxOptions.name || checkboxOptions.id);
                    chb.type('checkbox');
                    chb.setStyle('position', 'relative');
                    chb.setStyle('margin-left', '0');
                    chb.setStyle('margin-right', '10px');
                        if (checkboxOptions.onInput) {
                        chb.on('input', checkboxOptions.onInput);
                    }
                })
                .addHtml(`${checkboxOptions.label} ${checkboxOptions.required ? '<sup style="color: red">*</sup>' : ''}`)
            });
    }

    function strIsEmpty(str: string) {
        if (str) {
            return str.trim() === '';
        }
        else 
            return true;
    }

    const altLinkRegExp = /(.+)\[\[(.+)\]\](.*)/;

    function buildAuthForm(options: AuthFormOptions) : HTMLDivElement {
        let form : HTMLDivElement;
        let controlsPanelBuilder: DomElementBuilder<HTMLDivElement>;
        const formBuilder = domel('div');

        if (options.introHtml) {
            formBuilder.addChild('div', b => b
                .html(options.introHtml)
            );
        }

        formBuilder
            .addClass('kfrm-form')
            .addChild('div', b => {
                controlsPanelBuilder = b;
                b.addClass('kfrm-fields label-above')
            });

        addInputField(controlsPanelBuilder, {
            id: 'gazdaAuthEmail',
            name: 'email',
            label: 'Email',
            required: true
        });

        if (options.askContactName) {
            addInputField(controlsPanelBuilder, {
                id: 'gazdaAuthName',
                name: 'contactName',
                label: 'Name (optional)',
                required: false
            });
        }

        if (options.askPassword) {
            addInputField(controlsPanelBuilder, {
                id: 'gazdaAuthPassword',
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true
            });    
        }

        if (options.askConsent) {
            addCheckboxField(controlsPanelBuilder, {
                id: 'gazdaAuthConsent',
                name: 'consent',
                label: options.consentLabelHtml,
                type: 'password',
                required: true
            });    
        }

        if (options.altLinkHtml) {
            const p1 = options.altLinkHtml.indexOf('[[');
            const p2 = options.altLinkHtml.lastIndexOf(']]');
            if (p1 < 0 || p2 < 0) {
                throw 'Wrong format of the alternative link (no [[...]])';
            }
    
            const text1 = options.altLinkHtml.substring(0, p1);
            const linkText = options.altLinkHtml.substring(p1 + 2, p2);
            const text2 = options.altLinkHtml.substring(p2 + 2);
    
            formBuilder.addChild('div', ndb => {
                ndb.addClass('kfrm-break-20', 'kfrm-callout')
                ndb.addText(text1); 
                ndb.addChild('a', nlb => {
                    nlb.attr('href', 'javascript:void(0)');
                    nlb.text(linkText);
                    nlb.on('click', () => {
                        dialogSet.open(options.altLinkPage);
                    });
                });
                ndb.addText(text2); 
            });    
        }

        form = formBuilder.toDOM();
        return form;
    }
}
import { HttpClient } from '@easydata/core';

export interface Account {
    id: string;
    email: string;
    name?: string;
}

export interface AuthRequest {
    email: string;
    name?: string;
    password?: string;
    autoSignIn?:boolean;
    successUrl?: string;
    data?: any;
    referrer?: string;
    query?: string;
}

export interface AuthResult {
    success: boolean;
    accountId?: number;
}

export let endpoint = 'https://korzh.com/api/account';

export function registerAccount(descriptor: AuthRequest) : Promise<AuthResult> {
    const http = new HttpClient();
    const url = endpoint + '/register';

    return new Promise<AuthResult>( (resolve, reject) => {
        http.post(url, descriptor, { dataType: 'json' })
            .then(result => {
                resolve({
                    success: true,
                    accountId: result.id
                })
            })
            .catch(error => {
                reject(error);
            });       
    }) 
}

export function loginToAccount(descriptor: AuthRequest) : Promise<AuthResult> {
    const http = new HttpClient();
    const url = endpoint + '/login';

    return new Promise<AuthResult>( (resolve, reject) => {
        http.post(url, descriptor, { dataType: 'json' })
            .then(result => {
                resolve({
                    success: true,
                    accountId: result.id
                })
            })
            .catch(error => {
                reject(error);
            });       
    }) 
}

export function extendTrialLicense(licUserId: number) : Promise<void> {
    const http = new HttpClient();
    const url = endpoint + `/extend-trial/${licUserId}`;

    return new Promise( (resolve, reject) => {
        http.post(url, null, { dataType: 'json' })
            .then(result => {
                resolve()
            })
            .catch(error => {
                reject(error);
            });       
    }) 
}
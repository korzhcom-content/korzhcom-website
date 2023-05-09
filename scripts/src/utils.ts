export function capitalizeStr(str: string) : string {
    return (str && str.length > 0) 
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;
}

export function getNameFromEmail(email: string) : string {
    var emailParts = email.split('@');
    var name = emailParts[0].replace('.', ' ');
    return name.split(' ').map(s => capitalizeStr(s)).join(' ');
}
import disposableDomains from "../config/disposableDomains.js";

export function isDisposableEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailDomain = email.toLowerCase().split('@')[1];
    if (!emailDomain) return false;
    return disposableDomains.includes(emailDomain);
}

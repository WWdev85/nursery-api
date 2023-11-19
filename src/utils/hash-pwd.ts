import * as crypto from "crypto";

export const hashPwd = (p: string): string => {
    const authKey = process.env.AUTH_KEY
    const hmac = crypto.createHmac('sha512', `${authKey}`);
    hmac.update(p);
    return hmac.digest('hex')
}
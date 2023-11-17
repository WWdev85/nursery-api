import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
require('dotenv').config()
console.log(process.env.EMAIL_HOST)
export = {
    transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    },
    defaults: {
        from: '"Nursery" <nursery@webcarver20.usermd.net>'
    },
    template: {
        dir: './templates/email',
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true,
        },
    }
}
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { SettingsEntity } from "../settings/settings.entity";


@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {
    }

    private registerPartials() {

        Handlebars.registerHelper('isEqual', function (value, expectedValue) {
            return value === expectedValue;
        });
        // Załaduj i zarejestruj partials, np. szablon 'body'
        const partialsDir = path.join(__dirname, '..', '..', '..', 'templates', 'email', 'partials');
        const filenames = fs.readdirSync(partialsDir);

        filenames.forEach((filename) => {
            const matches = /^([^.]+).hbs$/.exec(filename);
            if (!matches) {
                return;
            }
            const name = matches[1];
            const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8');
            Handlebars.registerPartial(name, template);
        });
    }

    private async compileTemplate(templateName: string, context: any): Promise<string> {
        const templatePath = path.join(__dirname, '..', '..', '..', 'templates', 'email', `${templateName}.hbs`);
        const templateFile = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateFile);
        return template(context);
    }


    async sendMail(to: string, subject: string, templateName: string, context: any): Promise<any> {
        this.registerPartials()
        const html = await this.compileTemplate(templateName, context);
        const response = await SettingsEntity.find()
        const settings = response[0]
        await this.mailerService.sendMail({
            to,
            subject,
            html,
            attachments: [{
                filename: 'logo.png',
                path: `https://api.${settings.appUrl}/settings/get-logo`,
                cid: 'logo'
            }]
        })
    }
}
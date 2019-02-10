import mailer from './mailer';
import { SendMailOptions } from 'nodemailer';

export class BaseMailer {
    protected mail: SendMailOptions;

    constructor() {
        this.mail = {};
    }

    /**
     * Base send method to actually send the email using the transport
     * method defined inside mailer.
     */
    protected send() {
        return mailer.sendMail(this.mail);
    }
}

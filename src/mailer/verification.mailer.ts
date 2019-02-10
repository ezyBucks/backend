import { BaseMailer } from './base.mailer';
import { UserEntity } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import secret from '../config';
import HttpException from '../error/HttpException';
import { url } from '../helper';

/**
 * The class that handles building email for the verification
 * of user emails.
 */
class VerificationEmail extends BaseMailer {
    /**
     * The user object the email is for.
     */
    protected user: UserEntity;

    /**
     * [constructor Default constructor]
     * @param {UserEntity} userEntity [The user to send the email to]
     */
    constructor(userEntity: UserEntity) {
        super();
        this.user = userEntity;
    }

    /**
     * [sendMail Build and send the email]
     */
    public async sendMail() {
        this.buildEmail();

        const result = await this.send();
        if (result.err) {
            console.log('failed');
            throw new HttpException(500, result);
        }

        console.log(result);
        return;
    }

    /**
     * [buildEmail Full out the template for the verification email]
     */
    protected buildEmail() {
        this.mail.subject = 'Verification of ezyBucks account';
        this.mail.to = this.user.email;
        this.mail.html = `
		<b>Thanks for signing up to ezyBucks!</b>
		<p>Please click the link the link below to verify your email address</p>

		<a href="${url('/verify')}?token=${this.generateToken()}">Verify Email</a>`;
    }

    /**
     * [generateToken generate a temporary token for the user]
     */
    protected generateToken() {
        const user = this.user;

        return jwt.sign({ user }, secret, {
            expiresIn: '10m'
        });
    }
}

export function verificationEmail(user: UserEntity) {
    return new VerificationEmail(user);
}

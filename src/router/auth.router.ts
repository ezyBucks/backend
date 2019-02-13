import { NextFunction, Request, Response, Application } from 'express';
import passport from 'passport';
import Router from './base.router';
import secret from '../config';
import Service from './services';
import UserEntity from '../entities/user.entity';
import { verificationEmail } from '../mailer/verification.mailer';
import HttpException from '../error/HttpException';
import jwt from 'jsonwebtoken';
import { isDev } from '../helper';
import { default as User } from '../entities/user.entity';

/**
 * AuthRoutes
 *
 * Defines the authentication routes.
 *
 * @extends Router
 */
class AuthRoutes extends Router {
    /**
     * The HTTP methods supported by the routes and the functions
     * they will call.
     */
    get services() {
        return [
            new Service('post', '/signup', 'signUp', [
                passport.authenticate('signup', {
                    session: false
                })
            ]),
            new Service('post', '/signin', 'signIn').withNoMiddleware(),
            new Service('get', '/verify', 'verifyEmail').withNoMiddleware()
        ];
    }

    /**
     * Signs the user up with provided email and password.
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            verificationEmail(req.user).sendMail();
        } catch (e) {
            console.error({
                reson: e,
                message: 'Failed to send verification email'
            });
        }

        res.json({
            message: 'Should be signed up now!',
            success: true,
            user: req.user
        });
    }

    /**
     * Signs the user up with provided email and password.
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async signIn(req: Request, res: Response, next: NextFunction) {
        if (isDev) {
            const email = req.body.email;
            const user = await User.findOne({ email });

            if (!user) {
                // If the user isn't found in the database, return a message
                return next(
                    new HttpException(400, 'Incorrect Email or Password')
                );
            }
            return this.loginHandler(null, user, res, next);
        }

        passport.authenticate(
            'signin',
            async (err: Error, user: UserEntity, info) => {
                try {
                    if (err || !user) {
                        return next({ err, user, info });
                    }
                    req.login(
                        user,
                        {
                            session: false
                        },
                        error => {
                            this.loginHandler(error, user, res, next);
                        }
                    );
                } catch (error) {
                    return next(new HttpException(400, 'Bad data'));
                }
            }
        )(req, res, next);
    }

    /**
     * Separate function the handle the response after running
     * the sign-in authentication.
     *
     * @param error any
     * @param user UserEntity
     * @param res Response
     * @param next NextFunction
     */
    private loginHandler(
        error: any,
        user: UserEntity,
        res: Response,
        next: NextFunction
    ) {
        if (error) {
            return next(new HttpException(400, error));
        }

        // correct email and password but not verified email.
        if (!user.verified && !isDev) {
            return next(new HttpException(400, 'Email is not verified'));
        }

        const body = {
            id: user.id,
            email: user.email
        };

        // sign JWT! need to move this into dotenv!
        const token = jwt.sign(
            {
                user: body
            },
            secret,
            {
                expiresIn: '1h'
            }
        );

        // Add jwt token as a cookie should be http only
        res.cookie('jwt', token, {
            httpOnly: true
        });

        // Return success and the timeout for the token in seconds
        res.json({ success: true, expiresIn: 3600, user });
    }

    /**
     * Verify the users email.
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    private async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const result = (await jwt.verify(
                req.query.token,
                secret
            )) as UserEntity;

            const user = await UserEntity.findOne(result.id);
            user.verified = true;
            user.save();
        } catch {
            return next(new HttpException(400, 'Token expired.'));
        }

        return res.json({ message: 'Email verified' });
    }
}

export default AuthRoutes;

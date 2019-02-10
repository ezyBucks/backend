import { validate } from 'class-validator';
import _ from 'lodash';
import passport from 'passport';
import passportLocal from 'passport-local';
import secret from '../config';
import { default as User } from '../entities/user.entity';
import HttpException from '../error/HttpException';
import { Request } from 'express';

const localStrategy = passportLocal.Strategy;

// Create a passport middleware to handle user registration
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email: string, password: string, done: any) => {
            try {
                const user = new User();
                user.email = email;
                user.password = password;

                const errors = await validate(user, {
                    validationError: { target: false }
                });

                if (errors.length > 0) {
                    done(new HttpException(400, errors));
                } else {
                    // Unique Email Check
                    const foundUser = await User.findOne({ email });
                    if (foundUser) {
                        done(new HttpException(400, 'Email is already in use'));
                    } else {
                        await user.save().catch((err: any) => {
                            done(new HttpException(400, err));
                        });
                    }
                }

                // Send the user information to the next middleware
                return done(null, user);
            } catch (error) {
                done(new HttpException(400, error));
            }
        }
    )
);

// Create a passport middleware to handle User login
passport.use(
    'signin',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email: string, password: string, done: any) => {
            try {
                // Find the user associated with the email provided by the user
                const user = await User.findOne({
                    email
                });
                if (!user) {
                    // If the user isn't found in the database, return a message
                    return done(null, false, {
                        message: 'Incorrect Email or Password'
                    });
                }

                // Validate password and make sure it matches with the corresponding hash stored in the database
                // If the passwords match, it returns a value of true.
                const validate = await user.comparePassword(password);
                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
                // Send the user information to the next middleware
                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

const JWTstrategy = require('passport-jwt').Strategy;
// We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }

    // Still no token? try get one from the header.
    if (!token) {
        token = ExtractJWT.fromAuthHeaderAsBearerToken();
    }

    return token;
};

// This verifies that the token sent by the user is valid
passport.use(
    new JWTstrategy(
        {
            // move to dotenv!
            secretOrKey: secret,
            // pull token from header
            jwtFromRequest: cookieExtractor
        },
        async (token: any, done: any) => {
            try {
                // Pass the user details to the next middleware
                return done(null, token.user);
            } catch (error) {
                done({
                    error
                });
            }
        }
    )
);

export default passport;

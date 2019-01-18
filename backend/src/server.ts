import bodyParser from 'body-parser'; // used to parse the form data that you pass in the request
import cors from 'cors';
import express, { NextFunction } from 'express';
import HttpException from "./error/HttpException"
import passport from 'passport';
import { Connection, createConnection } from 'typeorm';
import expressValidator from 'express-validator';
import errorMiddleware from './error/error.middleware';
import cookieParser from 'cookie-parser';
import registerFunctions from "./router/router.register"

const PORT = process.env.PORT || 8081;

createConnection()
    .then((connection: Connection) => {
        // Hacks as well need to wait for the DB connection to be established.
        require('./auth/passport.middleware');

        const app = express();

        // Cookies!
        app.use(cookieParser());

        // support application/json type post data
        app.use(bodyParser.json());

        // support for express-validator
        app.use(expressValidator());

        // support application/x-www-form-urlencoded post data -- We can probs remove this if we only want JSON
        app.use(
            bodyParser.urlencoded({
                extended: false
            })
        );

        // Setup Auth JWT
        app.use(passport.initialize());

        // Supporting token via COOOKIE
        var whitelist = ['http://localhost:3000']
        var corsOptions: cors.CorsOptions = {
            origin: (origin: any, callback: any) => {
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(new HttpException(400, 'Not allowed by CORS'))
                }
            },
            credentials: true,
        };

        // enable All CORS Requests
        app.use(cors(corsOptions));

        // Register the routes
        registerFunctions(app);

        app.use(errorMiddleware);

        app.listen(PORT, () => {
            console.log('Listening on port ' + PORT);
        });
    })
    .catch((reason: any) => {
        console.log({
            reason,
            message: 'TypeORM Failed to get connection to DB'
        });
    });

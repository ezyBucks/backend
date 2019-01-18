import bodyParser from 'body-parser'; // used to parse the form data that you pass in the request
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { Connection, createConnection } from 'typeorm';

import expressValidator from 'express-validator';
import errorMiddleware from './error/error.middleware';

import UserRoutes from './router/user.router';
import AuthRoutes from './router/auth.router';

const PORT = process.env.PORT || 8081;

createConnection()
    .then((connection: Connection) => {
        // Hacks as well need to wait for the DB connection to be established.
        require('./auth/passport.middleware');

        const app = express();

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

        // enable All CORS Requests
        app.use(cors());

        // support cors for all origins should change later.
        const router = express.Router();
        const user = new UserRoutes('', app);
        const auth = new AuthRoutes('', app);
        // authRoutes(app, connection);

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

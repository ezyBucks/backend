import bodyParser from "body-parser"; // used to parse the form data that you pass in the request
import cors from "cors";
import express, { Request, Response } from "express";
import { createConnection } from "typeorm";
import { userRoutes } from "./route/user.route";

const PORT = process.env.PORT || 8080;

createConnection().then((connection) => {

    const app = express();

    // support application/json type post data
    app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // support cors for all origins should change later.
    const router = express.Router();

    // options for cors midddleware
    const options: cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "HEAD,OPTIONS,GET,POST,PATCH,DELETE",
      origin: '*',
      preflightContinue: false
    };
    // use cors middleware
    router.use(cors(options));
    // enable pre-flight

    router.options("*", cors(options));

    // Users
    userRoutes(app, connection);

    app.get("/", (req: Request, res: Response) => {
        res.send("Ello");
    });

    app.post("/login", (req: Request, res: Response) => {
        console.log('Login endpoint hit');
    });

    app.listen(PORT, () => {
        console.log("Listening on port " + PORT);
    });
});

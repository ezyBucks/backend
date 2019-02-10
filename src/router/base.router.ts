import { Application } from 'express';
import Service from './services';

// https://hackernoon.com/object-oriented-routing-in-nodejs-and-express-71cb1baed9f0
// Implemented the idea from the above post
/**
 * The default router register
 *
 * Classes that extend this will auto register routes
 */
class Router {
    /**
     * Express application to register our routes against.
     */
    private readonly app: Application;

    /**
     * The default path to be applied to all of the routes (services).
     */
    private routerPath: string;

    /**
     * Default constructor that builds all of the routing
     *
     * @param routerPath Base path for all of the routes
     * @param app Express
     */
    constructor(routerPath: string, app: Application) {
        if (app === null || app === undefined) {
            throw new Error('Missing required App');
        }

        this.app = app;
        this.routerPath = routerPath;

        this.registerServices();
    }

    /**
     * Return dictionary from inheriting class
     * specifying the route name and function
     */
    get services(): Service[] {
        return;
    }

    /**
     * Iterate over all of the services(routes) listed in services array
     * and register it to the express app
     */
    public registerServices() {
        for (const service of this.services) {
            (this.app as any)[service.method](
                this.routerPath + service.path,
                ...service.middleware,
                (this as any)[service.func].bind(this)
            );
        }
    }
}

export default Router;

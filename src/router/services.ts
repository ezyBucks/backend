import passport from 'passport';

export default class Service {
    public path: string;
    public method: string;
    public func: string;

    /**
     * Holds value if the service should auto add middleware
     */
    protected noMiddleware: boolean;

    /**
     * Hold our middleware to be returned in getter
     */
    protected readonly mid: any;

    /**
     * Getter for middleware. If middleware is empty it will return the
     * Authenticate middleware.
     */
    public get middleware(): any[] {
        if (!this.mid.length && !this.noMiddleware) {
            return [
                passport.authenticate('jwt', {
                    session: false
                })
            ];
        }
        return this.mid;
    }

    constructor(method: string, path: string, func: string, mid?: any[]) {
        this.method = method.toLowerCase();
        this.path = path;
        this.mid = mid || [];
        this.func = func;
        this.noMiddleware = false;
    }

    /**
     * Override the auto addition of the authentication middleware
     *  if you provide no middleware array
     */
    public withNoMiddleware() {
        this.noMiddleware = true;
        return this;
    }
}

import HttpException from './HttpException';

class NotAuthorized extends HttpException {
    constructor() {
        super(403, "You're not authorized");
    }
}

export default NotAuthorized;

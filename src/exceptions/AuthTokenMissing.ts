import HttpException from './HttpException';

class AuthTokenMissing extends HttpException {
    constructor() {
        super(401, 'Authentication token missing');
    }
}

export default AuthTokenMissing;

const DEV_API_ADDRESS = {
    URL: 'http://localhost',
    PORT: '8081'
};

const DEV_FRONT_END_ADDRESS = {
    URL: 'http://localhost',
    PORT: '3000'
};

const PROD_API_ADDRESS = {
    URL: 'http://localhost',
    PORT: '443'
};

const PROD_FRONT_END_ADDRESS = {
    URL: 'http://localhost',
    PORT: '80'
};

/**
 *
 * @param path what to be appended to the base URL
 * @param api is the URL for the front end or the back end
 */
export function url(path: string, api = true) {
    // Check the path is formatted correctly
    if (!path.startsWith('/', 0)) {
        path = '/' + path;
    }

    // Need to build the dotenv stuff
    if (api) {
        return `${DEV_API_ADDRESS.URL}:${DEV_API_ADDRESS.PORT}${path}`;
    } else {
        return `${DEV_FRONT_END_ADDRESS.URL}:${
            DEV_FRONT_END_ADDRESS.PORT
        }${path}`;
    }
}

export const isDev = () => process.env.NODE_ENV !== 'production';

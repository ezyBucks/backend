import { createConnection, ConnectionOptions } from 'typeorm';
import { isDev } from '../helper';

const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: isDev ? 'localhost' : 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'rootpassword',
    database: 'ezybucks',
    synchronize: true,
    logging: false,
    entities: ['dist/entities/**/*.js'],
    cli: {
        entitiesDir: 'backend/src/entity',
        migrationsDir: 'backend/src/migration',
        subscribersDir: 'backend/src/subscriber'
    }
};

const connect = async () => {
    try {
        return createConnection(connectionOptions);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to make connection to database');
    }
};

export default connect;

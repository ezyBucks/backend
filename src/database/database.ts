import { createConnection, ConnectionOptions } from 'typeorm';
import { isDev } from '../helper';

const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: isDev() ? 'localhost' : 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'rootpassword',
    database: 'ezybucks',
    logging: false,
    entities: ['dist/entities/*.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        entitiesDir: 'dist/entity',
        migrationsDir: 'dist/migration',
        subscribersDir: 'dist/subscriber'
    }
};

const connect = async () => {
    try {
        const connection = await createConnection(connectionOptions);

        if (isDev) {
            await connection.synchronize();
        }

        return connection;
    } catch (err) {
        console.log(err);
        throw new Error('Failed to make connection to database');
    }
};

export default connect;

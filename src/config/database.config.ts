import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
    return {
        'name': 'default',
        'type': process.env.DB_CONNECTION,
        'host': process.env.DB_HOST,
        'port': process.env.DB_PORT,
        'username': process.env.DB_USERNAME,
        'password': process.env.DB_PASSWORD,
        'database': process.env.DB_DATABASE,
        'entities': [
            'dist/**/*.entity{.ts,.js}'
        ],
        'synchronize': false,
        'migrationsTableName': 'migrations_histories',
        'migrationsRun': true,
        'logging': false
        // 'ssl': false,
        // 'extra': {
        //   'ssl': {
        //     'rejectUnauthorized': false
        //   }
        // }
    }
});
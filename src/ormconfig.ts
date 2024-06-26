import { omit, unset } from 'lodash';
import { DataSourceOptions } from 'typeorm';
import { pathFromSrc } from './helpers/general';
import processDatabaseConfig from './config/envs/database.config';

type TypeOrmDataSourceOptions = DataSourceOptions & {
  seeds: string[];
  factories: string[];
};

const databaseConfig = processDatabaseConfig();
if (databaseConfig.url) {
  unset(databaseConfig, 'host');
  unset(databaseConfig, 'port');
  unset(databaseConfig, 'username');
  unset(databaseConfig, 'password');
  unset(databaseConfig, 'database');
} else {
  unset(databaseConfig, 'url');
}

const defaultDataSourceOptions: TypeOrmDataSourceOptions = {
  applicationName: 'shop_at_ease',
  name: 'default',
  type: 'postgres',
  ...omit(databaseConfig, ['maxPoolConnCount']),
  synchronize: false,
  logging: ['error', 'warn', 'log'],
  logger: 'file',
  entities: ['./src/**/*.entity.{js,ts}'],
  migrations: [pathFromSrc('config/database/migrations/**/*.{js,ts}')],
  seeds: [pathFromSrc('config/database/seeds/**/*.{js,ts}')],
  factories: [pathFromSrc('config/database/factories/**/*.{js,ts}')],
  subscribers: [pathFromSrc('config/database/subscribers/**/*.{js,ts}')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  useUTC: true,
  connectTimeoutMS: 10000,
  dropSchema: false,
  migrationsTransactionMode: 'all',
  metadataTableName: 'typeorm_metadata',
  maxQueryExecutionTime: 10000,
  installExtensions: true,
  logNotifications: true,
  ssl: true,
  extra: {
    max: databaseConfig.maxPoolConnCount,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  cache: {
    type: 'database',
    tableName: 'typeorm_cache_table',
  },
};

export default defaultDataSourceOptions;

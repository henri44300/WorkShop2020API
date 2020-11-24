import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Pg',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'FSfHJbCwEJbQb4k',
  database: 'WorkShop2020'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PgDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Pg';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Pg', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

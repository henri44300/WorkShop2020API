import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Role, RoleRelations, User} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly users: HasManyRepositoryFactory<User, typeof Role.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}

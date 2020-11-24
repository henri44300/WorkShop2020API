import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {User, UserRelations, Role} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RoleRepository} from './role.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly role_user: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource);
    this.role_user = this.createBelongsToAccessorFor('role_user', roleRepositoryGetter,);
    this.registerInclusionResolver('role_user', this.role_user.inclusionResolver);
  }
}

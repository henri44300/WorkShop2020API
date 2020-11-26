import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Role, Document} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RoleRepository} from './role.repository';
import {DocumentRepository} from './document.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly role_user: BelongsToAccessor<Role, typeof User.prototype.id>;

  public readonly documents: HasManyRepositoryFactory<Document, typeof User.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(User, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', documentRepositoryGetter,);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
    this.role_user = this.createBelongsToAccessorFor('role_user', roleRepositoryGetter,);
    this.registerInclusionResolver('role_user', this.role_user.inclusionResolver);
  }
}

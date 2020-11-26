import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Document, DocumentRelations, TypeDocument, User} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TypeDocumentRepository} from './type-document.repository';
import {UserRepository} from './user.repository';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.id,
  DocumentRelations
> {

  public readonly typeDocument: BelongsToAccessor<TypeDocument, typeof Document.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Document.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('TypeDocumentRepository') protected typeDocumentRepositoryGetter: Getter<TypeDocumentRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Document, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.typeDocument = this.createBelongsToAccessorFor('typeDocument', typeDocumentRepositoryGetter,);
    this.registerInclusionResolver('typeDocument', this.typeDocument.inclusionResolver);
  }
}

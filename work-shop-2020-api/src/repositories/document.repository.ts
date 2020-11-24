import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Document, DocumentRelations, TypeDocument} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TypeDocumentRepository} from './type-document.repository';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.id,
  DocumentRelations
> {

  public readonly typeDocument: BelongsToAccessor<TypeDocument, typeof Document.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('TypeDocumentRepository') protected typeDocumentRepositoryGetter: Getter<TypeDocumentRepository>,
  ) {
    super(Document, dataSource);
    this.typeDocument = this.createBelongsToAccessorFor('typeDocument', typeDocumentRepositoryGetter,);
    this.registerInclusionResolver('typeDocument', this.typeDocument.inclusionResolver);
  }
}

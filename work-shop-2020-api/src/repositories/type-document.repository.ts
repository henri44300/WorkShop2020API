import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {TypeDocument, TypeDocumentRelations, Document} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DocumentRepository} from './document.repository';

export class TypeDocumentRepository extends DefaultCrudRepository<
  TypeDocument,
  typeof TypeDocument.prototype.id,
  TypeDocumentRelations
> {

  public readonly documents: HasManyRepositoryFactory<Document, typeof TypeDocument.prototype.id>;

  constructor(
    @inject('datasources.Pg') dataSource: PgDataSource, @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(TypeDocument, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', documentRepositoryGetter,);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
  }
}

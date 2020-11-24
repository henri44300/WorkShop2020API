import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Document,
  TypeDocument,
} from '../models';
import {DocumentRepository} from '../repositories';

export class DocumentTypeDocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
  ) { }

  @get('/documents/{id}/type-document', {
    responses: {
      '200': {
        description: 'TypeDocument belonging to Document',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TypeDocument)},
          },
        },
      },
    },
  })
  async getTypeDocument(
    @param.path.number('id') id: typeof Document.prototype.id,
  ): Promise<TypeDocument> {
    return this.documentRepository.typeDocument(id);
  }
}

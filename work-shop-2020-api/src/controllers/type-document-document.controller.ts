import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  TypeDocument,
  Document,
} from '../models';
import {TypeDocumentRepository} from '../repositories';

export class TypeDocumentDocumentController {
  constructor(
    @repository(TypeDocumentRepository) protected typeDocumentRepository: TypeDocumentRepository,
  ) { }

  @get('/type-documents/{id}/documents', {
    responses: {
      '200': {
        description: 'Array of TypeDocument has many Document',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Document)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Document>,
  ): Promise<Document[]> {
    return this.typeDocumentRepository.documents(id).find(filter);
  }

  @post('/type-documents/{id}/documents', {
    responses: {
      '200': {
        description: 'TypeDocument model instance',
        content: {'application/json': {schema: getModelSchemaRef(Document)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TypeDocument.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {
            title: 'NewDocumentInTypeDocument',
            exclude: ['id'],
            optional: ['typeDocumentId']
          }),
        },
      },
    }) document: Omit<Document, 'id'>,
  ): Promise<Document> {
    return this.typeDocumentRepository.documents(id).create(document);
  }

  @patch('/type-documents/{id}/documents', {
    responses: {
      '200': {
        description: 'TypeDocument.Document PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Partial<Document>,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {
    return this.typeDocumentRepository.documents(id).patch(document, where);
  }

  @del('/type-documents/{id}/documents', {
    responses: {
      '200': {
        description: 'TypeDocument.Document DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {
    return this.typeDocumentRepository.documents(id).delete(where);
  }
}

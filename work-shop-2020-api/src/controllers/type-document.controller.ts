import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {TypeDocument} from '../models';
import {TypeDocumentRepository} from '../repositories';

export class TypeDocumentController {
  constructor(
    @repository(TypeDocumentRepository)
    public typeDocumentRepository : TypeDocumentRepository,
  ) {}

  @post('/type-documents', {
    responses: {
      '200': {
        description: 'TypeDocument model instance',
        content: {'application/json': {schema: getModelSchemaRef(TypeDocument)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeDocument, {
            title: 'NewTypeDocument',
            exclude: ['id'],
          }),
        },
      },
    })
    typeDocument: Omit<TypeDocument, 'id'>,
  ): Promise<TypeDocument> {
    return this.typeDocumentRepository.create(typeDocument);
  }

  @get('/type-documents/count', {
    responses: {
      '200': {
        description: 'TypeDocument model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TypeDocument) where?: Where<TypeDocument>,
  ): Promise<Count> {
    return this.typeDocumentRepository.count(where);
  }

  @get('/type-documents', {
    responses: {
      '200': {
        description: 'Array of TypeDocument model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TypeDocument, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(TypeDocument) filter?: Filter<TypeDocument>,
  ): Promise<TypeDocument[]> {
    return this.typeDocumentRepository.find(filter);
  }

  @patch('/type-documents', {
    responses: {
      '200': {
        description: 'TypeDocument PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeDocument, {partial: true}),
        },
      },
    })
    typeDocument: TypeDocument,
    @param.where(TypeDocument) where?: Where<TypeDocument>,
  ): Promise<Count> {
    return this.typeDocumentRepository.updateAll(typeDocument, where);
  }

  @get('/type-documents/{id}', {
    responses: {
      '200': {
        description: 'TypeDocument model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TypeDocument, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TypeDocument, {exclude: 'where'}) filter?: FilterExcludingWhere<TypeDocument>
  ): Promise<TypeDocument> {
    return this.typeDocumentRepository.findById(id, filter);
  }

  @patch('/type-documents/{id}', {
    responses: {
      '204': {
        description: 'TypeDocument PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeDocument, {partial: true}),
        },
      },
    })
    typeDocument: TypeDocument,
  ): Promise<void> {
    await this.typeDocumentRepository.updateById(id, typeDocument);
  }

  @put('/type-documents/{id}', {
    responses: {
      '204': {
        description: 'TypeDocument PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() typeDocument: TypeDocument,
  ): Promise<void> {
    await this.typeDocumentRepository.replaceById(id, typeDocument);
  }

  @del('/type-documents/{id}', {
    responses: {
      '204': {
        description: 'TypeDocument DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.typeDocumentRepository.deleteById(id);
  }
}

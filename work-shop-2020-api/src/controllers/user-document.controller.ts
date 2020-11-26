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
  User,
  Document,
} from '../models';
import {UserRepository} from '../repositories';

export class UserDocumentController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/documents', {
    responses: {
      '200': {
        description: 'Array of User has many Document',
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
    return this.userRepository.documents(id).find(filter);
  }

  @post('/users/{id}/documents', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Document)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {
            title: 'NewDocumentInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) document: Omit<Document, 'id'>,
  ): Promise<Document> {
    return this.userRepository.documents(id).create(document);
  }

  @patch('/users/{id}/documents', {
    responses: {
      '200': {
        description: 'User.Document PATCH success count',
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
    return this.userRepository.documents(id).patch(document, where);
  }

  @del('/users/{id}/documents', {
    responses: {
      '200': {
        description: 'User.Document DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {
    return this.userRepository.documents(id).delete(where);
  }
}

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
  User,
} from '../models';
import {DocumentRepository} from '../repositories';

export class DocumentUserController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
  ) { }

  @get('/documents/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Document',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Document.prototype.id,
  ): Promise<User> {
    return this.documentRepository.user(id);
  }
}

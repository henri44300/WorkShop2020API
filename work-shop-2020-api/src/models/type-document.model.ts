import {Entity, model, property, hasMany} from '@loopback/repository';
import {Document} from './document.model';

@model()
export class TypeDocument extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
  })
  uuid: string;

  @hasMany(() => Document)
  documents: Document[];

  constructor(data?: Partial<TypeDocument>) {
    super(data);
  }
}

export interface TypeDocumentRelations {
  // describe navigational properties here
}

export type TypeDocumentWithRelations = TypeDocument & TypeDocumentRelations;

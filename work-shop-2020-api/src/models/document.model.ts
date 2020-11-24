import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TypeDocument} from './type-document.model';

@model()
export class Document extends Entity {
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
  url: string;

  @belongsTo(() => TypeDocument)
  typeDocumentId: number;

  constructor(data?: Partial<Document>) {
    super(data);
  }
}

export interface DocumentRelations {
  // describe navigational properties here
}

export type DocumentWithRelations = Document & DocumentRelations;

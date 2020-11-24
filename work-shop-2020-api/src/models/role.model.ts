import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Role extends Entity {
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
  libelle: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @hasMany(() => User, {keyTo: 'role_id'})
  users: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;

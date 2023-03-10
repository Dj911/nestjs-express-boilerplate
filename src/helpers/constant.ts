import path from 'path';

export const PASSPORT_STRATEGIES = {
  LOCAL: 'local',
  JWT: 'jwt',
};

export enum Role {
  PUBLIC = 'PUBLIC',
  USER = 'USER',
  ADMIN = 'ADMIN',
  ADD_USER = 'ADD_USER',
  VIEW_USER = 'VIEW_USER',
}

export const PUBLIC_ROUTE = 'isPublic';

export enum DB {
  USER = 'UserTest',
}

export const ROOT_PATH = path.join(__dirname, '../../');

export const FILE_STORAGE_FOLDER = '/files';

export const FILE_STORAGE_PATH = ROOT_PATH + FILE_STORAGE_FOLDER;

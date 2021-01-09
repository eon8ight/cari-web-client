import { ROLE_ADMIN } from './constants';

const entityHasPermission = (session, ...permittedRoles) => {
  const allPermittedRoles = [ROLE_ADMIN].concat(permittedRoles);
  return session.claims.roles.some(r => allPermittedRoles.includes(r));
};

const valueExists = (arr, key) => (typeof arr[key] !== 'undefined') && arr[key] !== null;

export {
  entityHasPermission,
  valueExists,
};
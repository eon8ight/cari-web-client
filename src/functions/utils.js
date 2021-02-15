import { ROLE_ADMIN } from './constants';

const entityHasPermission = (session, ...permittedRoles) => {
  if(!session.isValid) {
    return false;
  }

  const allPermittedRoles = [ROLE_ADMIN].concat(permittedRoles);
  let userRoles = session.claims.roles;

  if(typeof userRoles === 'string') {
    userRoles = userRoles.split(',').map(r => parseInt(r.trim()));
  }

  return userRoles.some(r => allPermittedRoles.includes(r));
};

const valueExists = (arr, key) => (typeof arr[key] !== 'undefined') && arr[key] !== null;

export {
  entityHasPermission,
  valueExists,
};
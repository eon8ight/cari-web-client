const API_URL = process.env.REACT_APP_API_URL;

const API_ROUTE_AESTHETIC_NAMES = `${API_URL}/aesthetic/names`;
const API_ROUTE_AESTHETIC_FIND_DRAFT = `${API_URL}/aesthetic/findDraft`;
const API_ROUTE_AESTHETIC_FIND_FOR_EDIT = `${API_URL}/aesthetic/findForEdit`;
const API_ROUTE_AESTHETIC_FIND_FOR_LIST = `${API_URL}/aesthetic/findForList`;
const API_ROUTE_AESTHETIC_FIND_FOR_PAGE = `${API_URL}/aesthetic/findForPage`;
const API_ROUTE_AESTHETIC_EDIT = `${API_URL}/aesthetic/edit`;

const API_ROUTE_AESTHETIC_MEDIA_EDIT = `${API_URL}/aestheticMedia/edit`;

const API_ROUTE_AUTH_CHECK_SESSION = `${API_URL}/auth/checkSession`;
const API_ROUTE_AUTH_CHECK_TOKEN = `${API_URL}/auth/checkToken`;
const API_ROUTE_AUTH_LOGIN = `${API_URL}/auth/login`;
const API_ROUTE_AUTH_LOGOUT = `${API_URL}/auth/logout`;

const API_ROUTE_ERAS = `${API_URL}/eras`;

const API_ROUTE_MAIL_FORGOT_PASSWORD = `${API_URL}/mail/forgotPassword`;

const API_ROUTE_MEDIA_CREATORS = `${API_URL}/mediaCreators`;

const API_ROUTE_UPDATES = `${API_URL}/updates`;

const API_ROUTE_USER_CONFIRM = `${API_URL}/user/confirm`;
const API_ROUTE_USER_FIND_FOR_EDIT = `${API_URL}/user/findForEdit`;
const API_ROUTE_USER_FIND_FOR_LIST = `${API_URL}/user/findForList`;
const API_ROUTE_USER_INVITE = `${API_URL}/user/invite`;
const API_ROUTE_USER_REGISTER = `${API_URL}/user/register`;
const API_ROUTE_USER_RESET_PASSWORD = `${API_URL}/user/resetPassword`;
const API_ROUTE_USER_UPDATE = `${API_URL}/user/edit`;

const API_ROUTE_WEBSITE_TYPES = `${API_URL}/websiteTypes`;

const ARENA_API_MAX = 15;
const ARENA_API_URL = 'https://api.are.na/v2/channels/';

const EVENT_TYPE_CREATED = 1;
const EVENT_TYPE_UPDATED = 2;

const ROLE_ADMIN = 1;
const ROLE_USER = 2;
const ROLE_LEAD_DIRECTOR = 3;
const ROLE_LEAD_CURATOR = 4;
const ROLE_CURATOR = 5;

const TOKEN_TYPE_CONFIRM = 'CONFIRM';
const TOKEN_TYPE_INVITE = 'INVITE';
const TOKEN_TYPE_RESET_PASSWORD = 'RESET_PASSWORD';
const TOKEN_TYPE_SESSION = 'SESSION';

const TOKEN_VALIDITY_INVALID = 'INVALID';
const TOKEN_VALIDITY_VALID = 'VALID';

const WEBSITE_TYPE_ARENA = 1;

export {
  API_ROUTE_AESTHETIC_NAMES,
  API_ROUTE_AESTHETIC_FIND_DRAFT,
  API_ROUTE_AESTHETIC_FIND_FOR_EDIT,
  API_ROUTE_AESTHETIC_FIND_FOR_LIST,
  API_ROUTE_AESTHETIC_FIND_FOR_PAGE,
  API_ROUTE_AESTHETIC_EDIT,
  API_ROUTE_AESTHETIC_MEDIA_EDIT,
  API_ROUTE_AUTH_CHECK_SESSION,
  API_ROUTE_AUTH_CHECK_TOKEN,
  API_ROUTE_AUTH_LOGIN,
  API_ROUTE_AUTH_LOGOUT,
  API_ROUTE_ERAS,
  API_ROUTE_MAIL_FORGOT_PASSWORD,
  API_ROUTE_MEDIA_CREATORS,
  API_ROUTE_UPDATES,
  API_ROUTE_USER_CONFIRM,
  API_ROUTE_USER_FIND_FOR_EDIT,
  API_ROUTE_USER_FIND_FOR_LIST,
  API_ROUTE_USER_INVITE,
  API_ROUTE_USER_REGISTER,
  API_ROUTE_USER_RESET_PASSWORD,
  API_ROUTE_USER_UPDATE,
  API_ROUTE_WEBSITE_TYPES,
  ARENA_API_MAX,
  ARENA_API_URL,
  EVENT_TYPE_CREATED,
  EVENT_TYPE_UPDATED,
  ROLE_ADMIN,
  ROLE_USER,
  ROLE_LEAD_DIRECTOR,
  ROLE_LEAD_CURATOR,
  ROLE_CURATOR,
  TOKEN_TYPE_CONFIRM,
  TOKEN_TYPE_INVITE,
  TOKEN_TYPE_RESET_PASSWORD,
  TOKEN_TYPE_SESSION,
  TOKEN_VALIDITY_INVALID,
  TOKEN_VALIDITY_VALID,
  WEBSITE_TYPE_ARENA,
};
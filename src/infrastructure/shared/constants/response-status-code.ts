export enum HTTPResponseStatusCode {
  NoResponse = 0,
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  PageNotFound = 404,
  RequestTimeout = 408,
  InternalServerError = 500,
}

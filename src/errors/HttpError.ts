export default class HttpError extends Error {
  status: number;
  constructor(status = 500, ...params: any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = 'HttpError';
    this.status = status;
  }
}

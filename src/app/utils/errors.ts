export interface ICustomError extends Error {
  statusCode?: number;
}

export class NotFoundError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;

    this.name = 'NotFoundError';
  }
}

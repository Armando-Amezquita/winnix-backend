import { HttpStatus } from '@nestjs/common';

export class SuccessResponseDto<T> {
  readonly statusCode: HttpStatus;
  readonly message: string;
  readonly data: T | null;

  constructor(
    data: T | null,
    message: string = 'Success',
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export interface ErrorResponseDto {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  message: string | string[];
}

import { HttpStatus } from '@nestjs/common';
import { IPaginatedResponse } from 'src/common/interfaces/pagination-response.interface';

type PaginationMeta = IPaginatedResponse<any>['meta'];

export class SuccessResponseDto<
  T = any,
  M = PaginationMeta | Record<string, any> | null,
> {
  readonly statusCode: HttpStatus;
  readonly message: string;
  readonly data: T | null;
  readonly meta?: M | null;

  constructor(
    data: T | null,
    message: string = 'Success',
    statusCode: HttpStatus = HttpStatus.OK,
    meta?: M | null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta !== undefined && meta !== null) {
      this.meta = meta;
    }
  }
}

export interface ErrorResponseDto {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  message: string | string[];
}

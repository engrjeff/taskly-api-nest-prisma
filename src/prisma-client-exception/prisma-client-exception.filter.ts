import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const message = exception.message.replace(/\n/g, '');

    console.dir(exception, { depth: Infinity });

    switch (exception.code) {
      case 'P2002':
        const status = HttpStatus.CONFLICT; // 409
        response.status(status).json({
          statusCode: status,
          message: exception.meta?.target[0] + ' must be unique',
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}

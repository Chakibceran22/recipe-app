import { ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import { Response } from 'express';
@Catch(HttpException) //this will bind which class to catch or intercept when there are errors involved
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionStatus = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    // this type of writing is weird but the issue is that when we send the response for an exception it might be an object full of data 
    //so to not do that we use this check and we use this ecrror const to send the reponse in a consistant manner because if it was a string 
    // this would give eird message ...error: {
    //"0": "m",
    //  "1": "e",
    //  "2": "s",
    //  "3": "s",} which is not hat we need because the pread opertaor does this 
    const error = typeof exceptionResponse === 'string' ? {message: exceptionResponse} : (exceptionResponse as object);
    response.status(exceptionStatus).json({
      ...error,
      testing: " an http exception is thrown in a custo m way "
    })
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const label = `Request to ${req.method} ${req.originalUrl} on ${new Date().toISOString()} with protocol ${req.protocol}`;
    console.time(label);
    res.on('finish', () => {
      console.timeEnd(label);
    });
    next();
  }
}

// import { Module } from '@nestjs/common';
// import { APP_GUARD, Reflector } from '@nestjs/core';
// import { ApiKeyGuard } from './guards/api-key/api-key.guard';
// import { ConfigModule} from '@nestjs/config';

// @Module({
//     imports: [ConfigModule],
//     providers: [{provide:APP_GUARD, useClass: ApiKeyGuard}]
// })
// export class CommonModule {}

// this is in case we created a guard that we want to use in the whole app and it injected some dependencies 
// we will define it as a module and import it in the Apps Imports array.
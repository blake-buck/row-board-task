import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {join} from 'path';
import { CognitoModule } from './cognito/cognito.module';
import { LoggerModule } from './logger/logger.module';
import { DataModule } from './data/data.module';

import * as rateLimit from 'express-rate-limit';
import { DataController } from './data/data.controller';
import { CognitoController } from './cognito/cognito.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '../../client/dist/row-board-task-client')
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRootAsync({
      imports:[],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri:`mongodb+srv://${configService.get('DB_USER_NAME')}:${configService.get('DB_USER_PASSWORD')}@cluster0.gbvkv.mongodb.net/${configService.get('DB_NAME')}?retryWrites=true&w=majority`
      })
    }),

    CognitoModule,
    LoggerModule,
    DataModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    // limit of 150 operations every 30 minutes for the DataController routes
    consumer
      .apply(rateLimit({windowMs: 1000 * 60 * 30, max:150}))
      .forRoutes(DataController)
    
    consumer
      .apply(rateLimit({windowMs: 1000 * 60 * 60, max: 10}))
      .forRoutes(CognitoController)
  }

}

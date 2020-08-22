import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {join} from 'path';
import { CognitoModule } from './cognito/cognito.module';
import { LoggerModule } from './logger/logger.module';

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
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {ConfigModule} from '@nestjs/config';
import {join} from 'path';
import { CognitoModule } from './cognito/cognito.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '../../client/dist/row-board-task-client')
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CognitoModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}

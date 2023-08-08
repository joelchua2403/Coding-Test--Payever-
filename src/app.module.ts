import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [UserModule, MongooseModule.forRoot('mongodb://localhost:27017'), HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './modules/files/files.module';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import rmqConfig from './config/rmq.config';
import docConfig from './config/doc.config';
import awsConfig from './config/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, rmqConfig, docConfig, awsConfig],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB is connected');
        });
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    CommonModule,
    FilesModule,
  ],
})
export class AppModule {} 
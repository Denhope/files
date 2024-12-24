import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/file.service';
import { CommonModule } from '../../common/common.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.uri')],
            queue: configService.get<string>('rmq.auth'),
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 3600000, // 1 hour
              },
            },
            socketOptions: {
              heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT, 10),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

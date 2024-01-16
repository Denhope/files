import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { File, FileDocument } from '../schema/file.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  public s3: S3;
  constructor(
    private configService: ConfigService,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {
    this.s3 = new S3({
      ...this.configService.get('aws'),
    });
  }

  async getPresginPutObject(
    params: { name: string; type: string },
    userId: number,
  ) {
    try {
      const key = `${userId}/${params.type}/${Date.now()}_${params.name}`;
      const url = await this.s3.getSignedUrlPromise('putObject', {
        Bucket: this.configService.get('bucket'),
        Key: key,
        Expires: Number(this.configService.get('presignExpire')),
      });
      const file = new this.fileModel({
        name: params.name,
        type: params.type,
        key,
        userId,
      });
      const savedFile = await file.save();
      return { url, fileId: savedFile.id };
    } catch (e) {
      throw e;
    }
  }

  async getPresignGetObject(fileId: string): Promise<{
    url: string;
    name: string;
    createdAt: Date;
    id: Types.ObjectId;
  }> {
    try {
      const file = await this.fileModel.findById(fileId);
      const params = {
        Bucket: this.configService.get('bucket'),
        Key: file.key,
      };
      const url = await this.s3.getSignedUrlPromise('getObject', params);
      return {
        url,
        name: file.name,
        createdAt: file.createdAt,
        id: file._id,
      };
    } catch (e) {
      throw e;
    }
  }
}
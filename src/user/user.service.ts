import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as amqp from 'amqplib';
import { UserDocument } from './user.schema';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import axios from 'axios';
import * as path from 'path';




@Injectable()
export class UserService {
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private sendEmail(email: string) {
        console.log(`Sending email to ${email}...`);
    }


    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly httpService: HttpService,
    ) { 
     }

        async onModuleInit() {
            this.connection = await amqp.connect('amqp://127.0.0.1'); // adjust the connection string as needed
            this.channel = await this.connection.createChannel();
            }
            
            async closeRabbitMQConnection() {
                await this.channel.close();
                await this.connection.close();
              }

     async createUser(user: any) {
        const createdUser = new this.userModel(user);
        await createdUser.save();

        this.sendEmail(user.email);

        await this.channel.assertQueue('user-created');
    this.channel.sendToQueue('user-created', Buffer.from(JSON.stringify(user)));
    return createdUser;

     }


     async getUser(userId: string) {
        const response = await this.httpService
          .get(`https://reqres.in/api/users/${userId}`)
          .toPromise();
    
        return response.data;
      }

     
      async getUserAvatar(userId: string): Promise<string> {
        // Find the user in the database
        const user = await this.userModel.findById(userId);
    
        // Define the file path
        const filePath = path.resolve(__dirname, `./avatars/${userId}.png`);
    
        if (user?.avatarFilePath) {
            // Read the file from local storage and return its base64-encoded representation
            const fileContent = await fs.readFile(filePath);
            return fileContent.toString('base64');
        } else {
            // Download the image from the avatar URL
            const response = await axios.get(user.avatar, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
    
            // Ensure the avatars directory exists
            await fs.mkdir(path.resolve(__dirname, './avatars'), { recursive: true });
    
            // Save the image to local storage
            await fs.writeFile(filePath, buffer);
    
            // Create a hash for the image
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
            // Update the user with the avatar details
            user.avatarHash = hash;
            user.avatarFilePath = filePath;
            await user.save();
    
            return buffer.toString('base64');
        }
    }
    
    async deleteUserAvatar(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user?.avatarFilePath) {
          throw new NotFoundException('Avatar not found');
        }
      
        // Delete the file from local storage
        await fs.unlink(user.avatarFilePath);
      
        // Remove the avatar details from the user document
        user.avatarHash = undefined;
        user.avatarFilePath = undefined;
        await user.save();
      
    }


    }
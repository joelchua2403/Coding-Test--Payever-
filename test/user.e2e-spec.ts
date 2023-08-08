import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserService } from './../src/user/user.service';
import { INestApplication } from '@nestjs/common';
import { User } from './../src/user/user.schema';
import { UserModule } from './../src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;

    const user: User = {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        avatar: 'avatar.png',
    };

    const mockUserService = {
        createUser: jest.fn().mockResolvedValue(user),
        // closeRabbitMQConnection: jest.fn(),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule, HttpModule, MongooseModule.forRoot('mongodb://localhost:27017')],
        })
        .overrideProvider(UserService)
        .useValue(mockUserService) // Override the original UserService with the mock
        .compile();

        userService = moduleFixture.get<UserService>(UserService);
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        // await userService.closeRabbitMQConnection();
        // await app.close();
    });

    it('should create a user', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/user')
            .send(user)
            .expect(201);

        // Check the response as needed
        expect(response.body.id).toEqual(user.id);
        expect(response.body.first_name).toEqual(user.first_name);
        expect(response.body.last_name).toEqual(user.last_name);
        expect(response.body.email).toEqual(user.email);
        expect(response.body.avatar).toEqual(user.avatar);
    });

    // ... additional tests ...
});

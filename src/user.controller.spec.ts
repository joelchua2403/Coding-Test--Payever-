import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';


describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser = {
    id: '12345',
    name: 'John Doe',
    avatar: 'http://example.com/avatar.png',
  };

  const mockAvatar = 'base64encodedavatar';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            getUser: jest.fn().mockResolvedValue(mockUser),
            getUserAvatar: jest.fn().mockResolvedValue(mockAvatar),
            deleteUserAvatar: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      expect(await userController.createUser(mockUser)).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      expect(await userController.getUser(mockUser.id)).toEqual(mockUser);
    });
  });

  describe('getAvatar', () => {
    it('should return an avatar for the user by ID', async () => {
      expect(await userController.getAvatar(mockUser.id)).toEqual(mockAvatar);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar for the user by ID', async () => {
      expect(await userController.deleteAvatar(mockUser.id)).toBeNull();
    });
  });
});

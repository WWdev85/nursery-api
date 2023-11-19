import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AdminEntity } from '../admin/admin.entity';
import { AdminRole } from '../../../types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
            check: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const req = { email: 'test@email.com', password: 'Qwerty8*' };
      const res = {} as Response;
      await controller.login(req, res);
      expect(authService.login).toHaveBeenCalledWith(req, res);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with correct parameters', async () => {
      const admin = new AdminEntity();
      const res = {} as Response;
      await controller.logout(admin, res);
      expect(authService.logout).toHaveBeenCalledWith(admin, res);
    });
  });

  describe('check', () => {
    it('should call authService.check with correct parameters', async () => {
      const admin = new AdminEntity();
      await controller.check(admin);
      expect(authService.check).toHaveBeenCalledWith(admin);
    });
  });
});
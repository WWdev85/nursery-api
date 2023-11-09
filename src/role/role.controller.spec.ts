import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';
import { RoleType } from '../../types';

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            create: jest.fn().mockResolvedValue('Role Created Successfully'),
          },
        },
      ],
    }).compile();

    roleController = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });
  it('should be defined', () => {
    expect(roleController).toBeDefined();
  });

  describe('addRole', () => {
    it('should create a new role and return "Role Created Successfully"', async () => {
      const role: CreateRoleDto = {
        roleName: 'sdasadasd',
        roleType: RoleType.Admin
      };

      expect(await roleController.addRole(role)).toBe(' sadas');
      //expect(roleService.addRole).toHaveBeenCalledWith(role);
    });
  });
});

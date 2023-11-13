import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleDto } from './dto/role.dto';
import { CreateRoleResponse, DeleteRoleResponse, Order, Role, UpdateRoleResponse } from '../../types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ListQueryDto } from '../dtos';

describe('RoleController', () => {
  let controller: RoleController;
  let roleService: RoleService;

  const firstRole: Role = {
    id: '1',
    name: 'Teacher',
  }

  const secondRole: Role = {
    id: '2',
    name: 'Assistant',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            addRole: jest.fn(),
            updateRole: jest.fn(),
            deleteRole: jest.fn(),
            getRolesList: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addRole', () => {
    it('should successfully create a role', async () => {
      const role: CreateRoleDto = {
        name: 'Teacher',
      };
      jest.spyOn(roleService, 'addRole').mockResolvedValue(CreateRoleResponse.Success);

      expect(await controller.addRole(role)).toEqual(CreateRoleResponse.Success);
    });

    it('should handle duplicate role name addition', async () => {
      const role: CreateRoleDto = {
        name: 'Teacher',
      };
      jest.spyOn(roleService, 'addRole').mockRejectedValue(new HttpException(CreateRoleResponse.Duplicated, HttpStatus.CONFLICT));

      await expect(controller.addRole(role)).rejects.toThrow(CreateRoleResponse.Duplicated);
    });
  });

  describe('updateRole', () => {
    it('should successfully update a role', async () => {
      const role: RoleDto = {
        id: '1',
        name: 'Teacher',
      };
      jest.spyOn(roleService, 'updateRole').mockResolvedValue(UpdateRoleResponse.Success);

      expect(await controller.updateRole(role)).toEqual(UpdateRoleResponse.Success);
    });

    it('should handle duplicate role name addition', async () => {
      const role: RoleDto = {
        id: '1',
        name: 'Teacher',
      };
      jest.spyOn(roleService, 'addRole').mockRejectedValue(new HttpException(UpdateRoleResponse.Duplicated, HttpStatus.CONFLICT));

      await expect(controller.addRole(role)).rejects.toThrow(UpdateRoleResponse.Duplicated);
    });

    it('should handle not existing role', async () => {
      const role: RoleDto = {
        id: '1',
        name: 'Teacher',
      };
      jest.spyOn(roleService, 'addRole').mockRejectedValue(new HttpException(UpdateRoleResponse.NotFound, HttpStatus.NOT_FOUND));

      await expect(controller.addRole(role)).rejects.toThrow(UpdateRoleResponse.NotFound);
    });
  });

  describe('deleteRole', () => {
    it('should successfully delete a role', async () => {
      const roleId = '1';
      jest.spyOn(roleService, 'deleteRole').mockResolvedValue(DeleteRoleResponse.Success);

      await controller.deleteRole(roleId);
      expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
    });

    it('should handle not existing role', async () => {
      const roleId = '1';
      jest.spyOn(roleService, 'deleteRole').mockRejectedValue(new HttpException(DeleteRoleResponse.NotFound, HttpStatus.NOT_FOUND));

      await expect(controller.deleteRole(roleId)).rejects.toThrow(DeleteRoleResponse.NotFound);
    });


  });

  describe('getRolesList', () => {
    it('should successfully retrieve the roles list', async () => {

      const query: ListQueryDto = {
        page: 1,
        limit: 2,
        search: '',
        orderBy: 'name',
        order: Order.Asc
      };
      jest.spyOn(roleService, 'getRolesList').mockResolvedValue({
        page: 1,
        totalPages: 1,
        totalItems: 2,
        items: [
          firstRole,
          secondRole,
        ]
      });

      expect(await controller.getRolesList(query)).toEqual({
        page: 1,
        totalPages: 1,
        totalItems: 2,
        items: [
          firstRole,
          secondRole,
        ]
      });
    });
  });
});

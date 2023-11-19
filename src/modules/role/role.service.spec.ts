import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { CreateRoleResponse, DeleteRoleResponse, Order, UpdateRoleResponse } from '../../../types';
import { CreateRoleDto, RoleDto } from './dto/role.dto';
import { ListQueryDto } from '../../dtos';

describe('RolesService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  describe('addRole', () => {
    it('should return success when a new role is added', async () => {
      jest.spyOn(service, 'findRoleName').mockResolvedValue(false);
      jest.spyOn(RoleEntity.prototype, 'save').mockImplementation(async () => undefined);

      const role: CreateRoleDto = {
        name: 'NewRole',
      };
      await expect(service.addRole(role)).resolves.toBe(CreateRoleResponse.Success);
    });

    it('should throw a conflict exception when the role name already exists', async () => {
      jest.spyOn(service, 'findRoleName').mockResolvedValue(true);

      const role: CreateRoleDto = {
        name: 'NewRole',
      };
      await expect(service.addRole(role)).rejects.toThrow(new HttpException(CreateRoleResponse.Duplicated, HttpStatus.CONFLICT));
    });

    it('should throw an exception when save fails', async () => {
      jest.spyOn(service, 'findRoleName').mockResolvedValue(false);
      jest.spyOn(RoleEntity.prototype, 'save').mockImplementation(async () => {
        throw new Error();
      });

      const role: CreateRoleDto = {
        name: 'NewRole',
      };
      await expect(service.addRole(role)).rejects.toThrow();
    });
  });

  describe('updateRole', () => {
    const role: RoleDto = {
      id: '1',
      name: 'UpdatedRole',
    }
    it('should return success when a role is successfully updated', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(new RoleEntity());
      jest.spyOn(service, 'findRoleName').mockResolvedValue(false);
      jest.spyOn(RoleEntity, 'update').mockResolvedValue(undefined);

      await expect(service.updateRole(role)).resolves.toBe(UpdateRoleResponse.Success);
    });

    it('should throw a not found exception when the role does not exist', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(undefined);

      await expect(service.updateRole(role)).rejects.toThrow(new HttpException(UpdateRoleResponse.NotFound, HttpStatus.NOT_FOUND));
    });

    it('should throw a conflict exception when the role name is duplicated', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(new RoleEntity());
      jest.spyOn(service, 'findRoleName').mockResolvedValue(true);

      await expect(service.updateRole(role)).rejects.toThrow(new HttpException(UpdateRoleResponse.Duplicated, HttpStatus.CONFLICT));
    });

    it('should throw an exception when update fails', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(new RoleEntity());
      jest.spyOn(service, 'findRoleName').mockResolvedValue(false);
      jest.spyOn(RoleEntity, 'update').mockImplementation(async () => {
        throw new Error();
      });

      await expect(service.updateRole(role)).rejects.toThrow();
    });
  });

  describe('deleteRole', () => {
    const id = '1';
    it('should return success when a role is successfully deleted', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(new RoleEntity());
      jest.spyOn(RoleEntity, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.deleteRole(id)).resolves.toBe(DeleteRoleResponse.Success);
    });

    it('should throw a not found exception when the role does not exist', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(undefined);

      await expect(service.deleteRole(id)).rejects.toThrow(new HttpException(DeleteRoleResponse.NotFound, HttpStatus.NOT_FOUND));
    });

    it('should throw an exception when delete operation fails', async () => {
      jest.spyOn(service, 'findRole').mockResolvedValue(new RoleEntity());
      jest.spyOn(RoleEntity, 'delete').mockRejectedValue(new Error('Delete operation failed'));

      await expect(service.deleteRole(id)).rejects.toThrow('Delete operation failed');
    });
  });

  describe('getRolesList', () => {
    it('should return a list of roles with pagination', async () => {

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[
          { id: '1', name: 'Admin' },
          { id: '2', name: 'User' }
        ], 100]),
      };
      jest.spyOn(RoleEntity, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const listQuery: ListQueryDto = {
        search: 'admin',
        page: 1,
        limit: 10,
        orderBy: 'name',
        order: Order.Asc,
      };

      const result = await service.getRolesList(listQuery);

      // Check if the response format matches the expected GetRolesListResponse
      expect(result).toEqual(expect.objectContaining({
        items: expect.any(Array),
        page: listQuery.page,
        totalPages: expect.any(Number),
        totalItems: expect.any(Number),
      }));

      // Ensure the queryBuilder is called with the correct search parameters
      expect(queryBuilder.where).toHaveBeenCalledWith(expect.stringContaining('role.name LIKE :search'), { search: `%${listQuery.search}%` });
      expect(queryBuilder.orWhere).toHaveBeenCalledWith(expect.stringContaining('role.type LIKE :search'), { search: `%${listQuery.search}%` });

      // Check if pagination is applied correctly
      expect(queryBuilder.skip).toHaveBeenCalledWith((listQuery.limit * (listQuery.page - 1)));
      expect(queryBuilder.take).toHaveBeenCalledWith(listQuery.limit);
    });

    // Test error handling
    it('should throw an error if the query fails', async () => {
      jest.spyOn(RoleEntity, 'createQueryBuilder').mockImplementation(() => {
        throw new Error('Query failed');
      });

      const listQuery: ListQueryDto = {
        search: 'admin',
        page: 1,
        limit: 10,
        orderBy: 'name',
        order: Order.Asc,
      };

      await expect(service.getRolesList(listQuery)).rejects.toThrow('Query failed');
    });
  });
});

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto, RoleDto } from './dto/role.dto';
import { RoleEntity } from './role.entity';
import { Role, CreateRoleResponse, UpdateRoleResponse, GetRolesListResponse, DeleteRoleResponse, Order } from '../../types';
import { ListQueryDto } from 'src/dtos';

/**
 * Role mamagment.
 */

@Injectable()
export class RoleService {

    /**
     * Create role.
     */

    async addRole(role: CreateRoleDto): Promise<CreateRoleResponse> {
        try {
            if (await this.findRoleName(role.name)) {
                throw new HttpException(CreateRoleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newRole = new RoleEntity(role as Role)
            await newRole.save()
            return CreateRoleResponse.Success
        } catch (error) {
            throw error
        }
    }

    /**
     * Update role
     */

    async updateRole(role: RoleDto): Promise<UpdateRoleResponse> {
        try {
            if (!await this.findRole(role.id)) {
                throw new HttpException(UpdateRoleResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            if (await this.findRoleName(role.name)) {
                throw new HttpException(UpdateRoleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            await RoleEntity.update(role.id, new RoleEntity(role as Role))
            return UpdateRoleResponse.Success
        } catch (error) {
            throw error
        }
    }

    /**
     * Delete role.
     */

    async deleteRole(id: string): Promise<DeleteRoleResponse> {
        try {
            if (!await this.findRole(id)) {
                throw new HttpException(DeleteRoleResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            await RoleEntity.delete(id)
            return DeleteRoleResponse.Success
        } catch (error) {
            throw error
        }
    }

    /**
     * Get roles list
     */

    async getRolesList(listQuery: ListQueryDto): Promise<GetRolesListResponse> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = RoleEntity.createQueryBuilder('role');
            if (search) {
                queryBuilder
                    .where('role.name LIKE :search', { search: `%${search}%` })
                    .orWhere('role.type LIKE :search', { search: `%${search}%` })
            }
            if (orderBy && order) {
                queryBuilder.addOrderBy(`role.${orderBy}`, order.toUpperCase() as Order);
            }

            queryBuilder.skip(limit * (page - 1)).take(limit);
            const [items, count] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(count / limit)
            return {
                items: items,
                page: page,
                totalPages: totalPages,
                totalItems: count,
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Find role
     */

    async findRole(id: string): Promise<RoleEntity> {
        try {
            const response = await RoleEntity.createQueryBuilder('role')
                .where('role.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * Check if role name exists
     */

    async findRoleName(name: string): Promise<boolean> {
        try {
            const response = await RoleEntity.createQueryBuilder('role')
                .where('role.name = :name', { name: name })
                .getOne();
            return response ? true : false
        } catch (error) {
            throw error
        }
    }

}

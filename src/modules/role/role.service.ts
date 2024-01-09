import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto, RoleDto } from './dto/role.dto';
import { RoleEntity } from './role.entity';
import { Role, CreateRoleResponse, UpdateRoleResponse, GetRolesListResponse, DeleteRoleResponse, Order } from '../../../types';
import { ListQueryDto } from 'src/dtos';

/**
 * Role mamagment.
 */

@Injectable()
export class RoleService {

    /**
     * Create role.
     */

    async addRole(role: CreateRoleDto): Promise<string> {
        try {
            if (await this.findRoleName(role.name)) {
                throw new HttpException(CreateRoleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newRole = new RoleEntity(role as Role)
            await newRole.save()
            return JSON.stringify(CreateRoleResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
     * Update role
     */

    async updateRole(role: RoleDto): Promise<string> {
        try {
            if (!await this.findRole(role.id)) {
                throw new HttpException(UpdateRoleResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            if (await this.findRoleName(role.name, role.id)) {
                throw new HttpException(UpdateRoleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            await RoleEntity.update(role.id, new RoleEntity(role as Role))
            return JSON.stringify(UpdateRoleResponse.Success)
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
            const queryBuilder = RoleEntity.createQueryBuilder('role')
                .loadRelationCountAndMap('role.staffCount', 'role.staff')

            if (search) {
                queryBuilder.andWhere('role.name LIKE :search', { search: `%${search}%` });
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

    async findRoleName(name: string, id?: string): Promise<boolean> {
        try {
            let query = RoleEntity.createQueryBuilder('role')
                .where('role.name = :name', { name: name });

            if (id) {
                query = query.andWhere('role.id <> :id', { id: id });
            }
            const response = await query.getOne();
            return response ? true : false


        } catch (error) {
            throw error
        }
    }

}

import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/role.dto';
import { RoleEntity } from './dto/role.entity';

/**
 * Role mamagment.
 */

@Injectable()
export class RoleService {
    [x: string]: any;

    /**
     * Create staff member.
     */

    async addRole(role: CreateRoleDto): Promise<string> {
        try {
            const newRole = role as RoleEntity
            const response = await newRole.save()
            return (response).id
        } catch (error) {
            throw error
        }
    }
}

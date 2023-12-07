import { Injectable } from '@nestjs/common';
import { Response } from "express";
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { AuthLogin } from './dto/auth.dto';
import { AdminEntity } from '../../modules/admin/admin.entity';
import { hashPwd } from '../..//utils';
import { LoginResponse, LogoutResponse } from '../../../types';
import { JwtPayload } from '../../utils/jwt-strategy';

@Injectable()
export class AuthService {
    /**
     * Login.
     */


    cookieOptions = {
        secure: process.env.COOKIE_OPTION_SECURE === 'true' ? true : false,
        domain: process.env.COOKIE_OPTION_DOMAIN,
        httpOnly: process.env.COOKIE_OPTION_HTTPONLY === 'true' ? true : false,

    }

    async login(req: AuthLogin, res: Response, host: any): Promise<any> {
        try {
            if (host.includes('localhost')) {
                this.cookieOptions.domain = 'localhost';
            }
            const admin = await AdminEntity.createQueryBuilder('admin')
                .where('admin.email = :email', { email: req.email })
                .andWhere('admin.passwordHash = :password', { password: hashPwd(req.password) })
                .getOne();

            if (!admin) {
                return res.json(LoginResponse.Failure);
            }
            const token = this.createToken(await this.generateToken(admin));

            return res
                .cookie('jwt', token.accessToken, this.cookieOptions)
                .json(LoginResponse.Success);
        } catch (error) {
            throw error
        }
    }

    /**
    * Logout.
    */

    async logout(user: AdminEntity, res: Response) {
        try {
            user.currentTokenId = "";
            await user.save();
            res.clearCookie(
                'jwt', this.cookieOptions
            );
            return res.json(LogoutResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
    * Returns admin properties
    */

    async check(user: AdminEntity): Promise<string> {
        console.log(this.cookieOptions)
        return JSON.stringify({ id: user.id, role: user.role })
    }


    /**
    * Create token.
    */

    private createToken(currentTokenId: string): { accessToken: string, expiresIn: number } {
        const authKey = process.env.AUTH_KEY;
        const payload: JwtPayload = { id: currentTokenId };
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, `${authKey}`, { expiresIn });
        return {
            accessToken,
            expiresIn
        }
    }


    /**
     * Generate token.
     */

    private async generateToken(admin: AdminEntity): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await AdminEntity.findOne({
                where: {
                    currentTokenId: token
                }
            })
        } while (!!userWithThisToken);
        admin.currentTokenId = token;
        await admin.save();
        return token
    }
}

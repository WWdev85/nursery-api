import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminEntity } from "../modules/admin/admin.entity";

export interface JwtPayload {
    id: string
}

function cookieExtractor(req: any): null | string {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const authKey = process.env.AUTH_KEY;
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: `${authKey}`
        });
    }


    async validate(payload: JwtPayload, done: (error: any, user: any) => void) {
        if (!payload || !payload.id) {
            return done(new UnauthorizedException(), false);
        }
        const user = await AdminEntity.findOne({
            where: {
                currentTokenId: payload.id
            }
        })

        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user)
    }
}
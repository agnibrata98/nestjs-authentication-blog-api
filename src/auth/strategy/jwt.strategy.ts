import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
                ExtractJwt.fromHeader('x-access-token'), // x-access-token: <token>
                ExtractJwt.fromHeader('authorization'), // authorization: <token>
                (req: Request) => {
                    return req?.cookies?.token; // 🔥 Extract from cookie
                },
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET')!
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, name: payload.name, email: payload.email, role: payload.role, };
    }
}
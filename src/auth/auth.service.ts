import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) { }

    async register(user: RegisterDto) {
        const hash = await bcrypt.hash(user.password, 10);
        const existingUser = await this.userModel.findOne({ email: user.email });
        if (existingUser) {
            return new UnauthorizedException('User already exists');
        }
        const newUser = new this.userModel({
            name: user.name,
            email: user.email,
            password: hash,
        });
        return newUser.save();
    }

    async login(user: LoginDto) {
        const existingUser = await this.userModel.findOne({ email: user.email });

        if (!existingUser) {
            return new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);

        if (!isPasswordValid) {
            return new UnauthorizedException('Invalid password');
        }

        const payload = { sub: existingUser._id, email: existingUser.email, name: existingUser.name };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
            },
        }
    }

    async getUserProfile(userPayload: any) {
        const user = await this.userModel.findById(userPayload.userId).select('name email');

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
        };
    }
}

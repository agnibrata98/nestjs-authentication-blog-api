import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Implement your routes here
    // for registering a new user
    @Post('signup')
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // for logging in an existing user
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    // for getting the current user's information
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getUserProfile(@Request() req) {
        // return req.user;     // for simpler version(without the service layer)
        return this.authService.getUserProfile(req.user);   // with the service layer
    }
}

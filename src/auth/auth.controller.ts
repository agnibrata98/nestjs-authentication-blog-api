import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Implement your routes here
    // for registering a new user
    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // for logging in an existing user
    @Post('login')
    @ApiOperation({ summary: 'Login user and get JWT token' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    // for getting the current user's information
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get logged-in user profile' })
    @ApiResponse({ status: 200, description: 'User profile returned' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getUserProfile(@Request() req) {
        // return req.user;     // for simpler version(without the service layer)
        return this.authService.getUserProfile(req.user);   // with the service layer
    }
}

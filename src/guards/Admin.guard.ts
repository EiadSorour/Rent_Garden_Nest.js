import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private readonly jwtService:JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        try{
			const payload = this.jwtService.verify(request.headers.authorization.split(" ")[1]);
            request.payload = payload;
            if(payload.role !== "admin"){
                throw new HttpException("User is not an admin" , HttpStatus.UNAUTHORIZED);
            }
        }catch(error){
            return false;
        }

        return true;
    }
}
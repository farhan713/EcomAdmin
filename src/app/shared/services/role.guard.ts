import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private service: AuthService){}
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    let role = localStorage.getItem('userType');
    if(role == "USER"){
      if(this.service.haveRoleAcess(next.url[0].path)){
        alert("You Dont have Admin Access");
        return false;
        
      }
    }
    else if(role == 'ADMIN'){
      return true;
    }
    else if(role == 'SUPER_ADMIN'){
      return true;
    }
    else if(role == 'CUSTOMER'){
      return true;
    }
  }
  
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLoggedIn(){
    console.log(localStorage.getItem('token'));
    
    return !!localStorage.getItem('token');
  }
  haveRoleAcess(menu: any){
    if(menu == "admin") {
      return true
    }else{
      return false;
    }
  }
}

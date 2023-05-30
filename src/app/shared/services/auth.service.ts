import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role = new BehaviorSubject<string>('');

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

  
  setValue(value: string) {
    this.role.next(value);
  }

  getValue() {
    return this.role.asObservable();
  }
}

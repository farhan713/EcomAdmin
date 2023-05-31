import { Injectable, EventEmitter, Output } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() aClickedEvent = new EventEmitter<string>();
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

  AClicked(msg: string) {
    this.aClickedEvent.emit(msg);
  }
  
 
}

import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() aClickedEvent = new EventEmitter<string>();
  constructor(private http: HttpClient,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }
  isLoggedIn(){
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

  
  sendPostCall(demoData) {
       this.http.post<any>('http://127.0.0.1:8000/console/user_settings', { response: demoData }).subscribe({
      next: data => {
      },
      error: error => {
        console.log(error);
      }
    })
  }
  
  sendHttpPost(reqUrl, reqData): Promise<any> {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.http.post<any>(reqUrl, { response: reqData })
        .subscribe(
          (res) => {
            this.spinner.hide();
            resolve(res.responseBody);
          },
          (error) => {
            this.spinner.hide();
            reject(error.error.responseHeader.message);
            this.snackBar.open(error.error.responseHeader.message,  '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
        );
    });
  }

  sendHttpGet(reqUrl): Promise<any> {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.http.get<any>(reqUrl)
        .subscribe(
          (res) => {
            this.spinner.hide();
            if(res) {
              resolve(res.responseBody);
            } else {
              resolve(null);
              this.snackBar.open("No Data Found...Please Try Again",  '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            } 
          },
          (error) => {
            this.spinner.hide();
            reject(error.error.responseHeader.message);
            this.snackBar.open(error.error.responseHeader.message,  '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
        );
    });
  }
 
}

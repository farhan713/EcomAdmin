import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-route-settings',
  templateUrl: './route-settings.component.html',
  styleUrls: ['./route-settings.component.scss']
})
export class RouteSettingsComponent implements OnInit {

  settingData = []
  constructor(private http: HttpClient, private auth:AuthService ) { }

  ngOnInit(): void {

    this.http.get<any>('http://127.0.0.1:8000/console/user_settings_info'  ).subscribe({
      next: data => {
 
      this.settingData = data.dataset;
      this.settingData.forEach((val)=>{
        if(val.admin == 'true' || val.admin ) {
          val.admin = true
        } else {
          val.admin = false;
        }
        if(val.customer == 'true' || val.customer) {
          val.customer = true
        } else {
          val.customer = false;
        }
        if(val.user == 'true' || val.user) {
          val.user = true
        } else {
          val.user = false;
        }
      }) 
      },
      error: error => {
        console.log(error);
  
      }
    })
  }

  changeStatus(data,key, e) {
    if(key == 'admin') {
      const updatedData =  this.settingData.map(item => {
        if (item.id === data.id) {
          return { ...item, admin: e.checked };
        }
        return item;
      });
      this.settingData = updatedData
    } else if(key == 'customer') {
      const updatedData = this.settingData.map(item => {
        if (item.id === data.id) {
          return { ...item, customer: e.checked };
        }
        return item;
      });
      this.settingData = updatedData
    } else if(key == 'user') {
      const updatedData = this.settingData.map(item => {
        if (item.id === data.id) {
          return { ...item, user: e.checked };
        }
        return item;
      });
      this.settingData = updatedData
    }

    setTimeout(() => {
      this.auth.sendPostCall(this.settingData)
    }, 1000);
  }


}

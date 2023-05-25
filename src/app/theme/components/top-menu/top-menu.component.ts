import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { Settings, AppSettings } from '../../../app.settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag:any;
  isModeOpen : boolean = false;

  userId;
  loginForm: FormGroup;
  isUserLoggedIn : boolean = false;
  public settings: Settings;
  constructor(public appSettings:AppSettings, 
    public formBuilder: FormBuilder,
    private clickService: ClickStreamService,
    public appService:AppService) { 
    this.settings = this.appSettings.settings; 
  } 

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'userId': ['', Validators.compose([])],
    });
    this.currency = this.currencies[0];
    this.flag = this.flags[0];   
    this.userId = this.clickService.getUser();     
  }

  public changeCurrency(currency){
    this.currency = currency;
  }

  public changeLang(flag){
    this.flag = flag;
  }

  openCloseDialoge() {
    this.isModeOpen = !this.isModeOpen;
    // console.log(this.isModeOpen);
    
  }
  logout() {
    this.userId = '-1';
    localStorage.removeItem("userid");
    this.clickService.userLogin("logout")
  }

  login() {
    // console.log(this.loginForm.value);
    this.userId = this.loginForm.value.userId;
   this.clickService.setUser(this.loginForm.value.userId);
   this.clickService.userLogin("login")
   this.isModeOpen = false;
  }
  

}

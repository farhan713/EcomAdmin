import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { ClickStreamService } from './shared/services/click-stream.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean = false;
  public settings: Settings;
  pageReloaded = window.performance
                  .getEntriesByType('navigation')
                 .map((nav) => (nav as any).type)
                  .includes('reload');
  orgnizationData: any;
  constructor(public appSettings:AppSettings,
    private auth: AuthService,
    private clickService: ClickStreamService, public router: Router , private http: HttpClient){
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    let tabCount = parseInt(localStorage.getItem("windowCount"));
    if (Number.isNaN(tabCount)) {
      this.clickService.setSessionId();
    }
    tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;
    localStorage.setItem('tabCount', tabCount.toString());
    this.getOrgdata()  
  }

  isBrowserClosed() {
    var localStorageTime = parseInt(localStorage.getItem('storageTime'));
    var currentTime = new Date().getTime();
    var timeDifference = currentTime - localStorageTime;
  
    if (timeDifference < 50) { }
  }

  beforeunloadHandler(event) {
    if(!this.pageReloaded) { // The pageReloaded boolean we set earlier
      let tabCount = parseInt(localStorage.getItem('tabCount'));
      --tabCount;
      localStorage.setItem('tabCount', tabCount.toString());
      localStorage.removeItem("sessionId")
    }
    localStorage.removeItem("sessionId")
  }


  getOrgdata() {
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/all_organization_data')
      .then((respData) => {
        let tempData =  respData.datalist;
        tempData.forEach((val)=>{
          if(val.status == "false"){
            val.status = false
          }else{
            val.status = true;
          }
        })
       this.orgnizationData = tempData;
       this.getOrgDetails('d')
      }).catch((error) => { console.log(error) });
  }
   
  getOrgDetails(id) {
    this.http.get<any>('http://127.0.0.1:8000/console/org_info/' + 'mastgeneralstore.com').subscribe({
      next: data => {
        // let dataNew = {
        //   org_id: data.dataset[0].org_id,
        //   store_id: -1
        // }
       
        // this.clickService.setOrganizationData(dataNew);
      },
      error: error => {
        // console.log(error);

      }
    })
  }
  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          window.scrollTo(0,0);
      }
    })  
  }
}

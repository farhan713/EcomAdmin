import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { ClickStreamService } from './shared/services/click-stream.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // @HostListener('window:beforeunload', ['$event'])
  loading: boolean = false;
  public settings: Settings;
  // pageReloaded1 = window.performance
  //                .getEntriesByType('navigation')
  //                .map((nav) => (nav as any).type)
  //                .includes('reload');
  pageReloaded = window.performance
                  .getEntriesByType('navigation')
                 .map((nav) => (nav as any).type)
                  .includes('reload');
  orgnizationData: any;
  constructor(public appSettings:AppSettings,
    private clickService: ClickStreamService, public router: Router , private http: HttpClient){
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    // We need to parse into integer since local storage can only
    // store strings.
    let tabCount = parseInt(localStorage.getItem("windowCount"));
    // console.log("first",tabCount);

    if (Number.isNaN(tabCount)) {
      this.clickService.setSessionId();
    }
    // Then we instantiate tabCount if it doesn't already exist
    // OR Increment by 1 if it already exists
    tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;

    // console.log("secon",tabCount);


    // Set the count on local storage
    localStorage.setItem('tabCount', tabCount.toString());
    this.getOrgdata()


    // let data = {
    //   org_id: 1,
    //   store_id: 1
    // }
    // this.clickService.setOrganizationData(data);
    // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh    
  }

  isBrowserClosed() {
    var localStorageTime = parseInt(localStorage.getItem('storageTime'));
    var currentTime = new Date().getTime();
    var timeDifference = currentTime - localStorageTime;
  
    if (timeDifference < 50) {
      //Browser is being closed
      // Do something before browser closes.
    }
  }

  beforeunloadHandler(event) {
    if(!this.pageReloaded) { // The pageReloaded boolean we set earlier
      let tabCount = parseInt(localStorage.getItem('tabCount'));
      // console.log("third",tabCount);
      
      --tabCount;
      localStorage.setItem('tabCount', tabCount.toString());
      localStorage.removeItem("sessionId")
    }
    // console.log(event);
    localStorage.removeItem("sessionId")
    // event.preventDefault();
    // event.returnValue = 'Your data will be lost!';
    // return false;
  }

  // beforeunloadHandler(event): void {
  //   if(!pageReloaded) { // The pageReloaded boolean we set earlier
  //     if (storageTime === null || storageTime === undefined
  //         || (storageTime - new Date().getTime()) > 1000) {
  //       // If storageTime is null, undefined or is older than 1 second
  //       // we update the storage time.
  //     }
  //   }
  // }
  getOrgdata() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_organization_data').subscribe({
      next: data => {


        let tempData =  data.dataset;
        tempData.forEach((val)=>{
            // console.log(val)
          if(val.status == "false"){
            val.status = false
          }else{
            val.status = true;
          }
        })
       this.orgnizationData = tempData;
       this.getOrgDetails('d')
      },
      error: error => {
        // console.log(error);

      }
    })
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

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings, Settings } from '../app.settings';
import { Router, NavigationEnd } from '@angular/router'; 
import { MenuService } from './components/menu/menu.service';
import { AuthService } from '../shared/services/auth.service';
import { Menu } from './components/menu/menu.model'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('sidenav') sidenav:any;  
  public userImage = 'assets/images/others/admin_img.png'; 
  public settings:Settings;
  public menuItems:Array<any>;
  public toggleSearchBar:boolean = false;
  constructor(public appSettings:AppSettings, 
              public router:Router,
              private service: AuthService,
              private menuService: MenuService){        
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {  
    console.log("admin module");
    
    this.service.aClickedEvent
    .subscribe((token:string) => {
    
      if(token) {
        console.log('Event message from Component A: ' + token);
        console.log(localStorage.getItem("userType"));
        
        if(localStorage.getItem("userType") == 'ADMIN') {
          this.menuItems = [ 
             new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
             new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
             new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
             new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
             new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
             new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
             new Menu (50, 'Keyword Breakdown', '/admin/keywords', null, 'translate', null, false, 0), 
             new Menu (60, 'Sorting Filter', '/admin/sorting', null, 'credit_card', null, false, 0), 
             new Menu (70, 'Custom Keywords', null, null, 'more_horiz', null, true, 0),
             new Menu (71, 'One-Way', '/admin/one-way', null, 'list_alt', null, false, 70), 
             new Menu (72, 'Grouped', '/admin/groupped', null, 'list_alt', null, false, 70),  
             new Menu (80, 'Manage recommendation', '/admin/profile/profile-list', null, 'settings_applications', null, false, 0), 
             new Menu (90, 'Recommendation Impact', '/admin/rec-results', null, 'restore', null, false, 0),  
             new Menu (91, 'Multi-tenant', null, null, 'Multi-tenant', null, true, 0),
             new Menu (82, 'Create Org', '/admin/sales/orders', null, 'Multi-tenant', null, false, 91),
             new Menu (93, 'Create Store', '/admin/sales/transactions', null, 'Multi-tenant', null, false, 91),
          
             new Menu (13, 'abcd', '/admin/add-user', null, 'local_atm', null, false, 0),
         ]
     } else if(localStorage.getItem("userType") == 'CUSTOMER') {
         this.menuItems = [
             new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
             new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
             new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
             new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
             new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
             new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
          ]
     } else if(localStorage.getItem("userType") == 'SUPER_ADMIN') {
         this.menuItems = [
             new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
             new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
             new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
             new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
             new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
             new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
             new Menu (50, 'Keyword Breakdown', '/admin/keywords', null, 'translate', null, false, 0), 
             new Menu (60, 'Sorting Filter', '/admin/sorting', null, 'credit_card', null, false, 0), 
             new Menu (70, 'Custom Keywords', null, null, 'more_horiz', null, true, 0),
             new Menu (71, 'One-Way', '/admin/one-way', null, 'list_alt', null, false, 70), 
             new Menu (72, 'Grouped', '/admin/groupped', null, 'list_alt', null, false, 70),  
             new Menu (80, 'Manage recommendation', '/admin/profile/profile-list', null, 'settings_applications', null, false, 0), 
             new Menu (90, 'Recommendation Impact', '/admin/rec-results', null, 'restore', null, false, 0),  
             new Menu (91, 'Multi-tenant', null, null, 'Multi-tenant', null, true, 0),
             new Menu (82, 'Create Org', '/admin/sales/orders', null, 'Multi-tenant', null, false, 91),
             new Menu (93, 'Create Store', '/admin/sales/transactions', null, 'Multi-tenant', null, false, 91),
          
             new Menu (13, 'abcd', '/admin/add-user', null, 'local_atm', null, false, 0),
          ]
     }
     console.log();
     
      }
      
    });
    if(window.innerWidth <= 960){ 
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    }; 
    setTimeout(() => {
      this.settings.theme = 'blue'; 
    });
    this.menuItems = this.menuService.getMenuItems();    
  }



  ngAfterViewInit(){  
    if(document.getElementById('preloader')){
      document.getElementById('preloader').classList.add('hide');
    } 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      } 
      if(window.innerWidth <= 960){
        this.sidenav.close(); 
      }                
    });  
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());  
  } 

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => {  
        window.scrollTo(0,0); 
      });
    }
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 960){
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false; 
    }
    else{ 
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }

}

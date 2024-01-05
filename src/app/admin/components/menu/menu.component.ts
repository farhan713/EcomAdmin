import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings, Settings } from '../../../app.settings';
import { MenuService } from './menu.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class MenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  parentMenu: Array<any>;
  public settings: Settings;
  constructor(public appSettings: AppSettings, private http: HttpClient, public menuService: MenuService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.http.get<any>('http://127.0.0.1:8000/console/user_settings_info').subscribe({
      next: data => {
        const userRole = localStorage.getItem("userType");
        if (userRole == 'ADMIN') {
          const filteredData = data.dataset.filter(item => item.admin === 'true' || item.admin);
          const filteredArray2 = this.menuItems.filter(item => filteredData.some(obj => obj.id == item.id || obj.id == item.parentId));
          this.menuItems = filteredArray2;
          this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
        } else if (userRole == 'CUSTOMER') {
          const filteredData = data.dataset.filter(item => item.customer === 'true' || item.customer);
          const filteredArray2 = this.menuItems.filter(item => filteredData.some(obj => obj.id == item.id || obj.id == item.parentId));
          this.menuItems = filteredArray2;
          this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
        } else if (userRole == 'USER') {
          const filteredData = data.dataset.filter(item => item.user === 'true' || item.user);
          const filteredArray2 = this.menuItems.filter(item => filteredData.some(obj => obj.id == item.id || obj.id == item.parentId));
          this.menuItems = filteredArray2;
          this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
        } else {
          this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
        }
      },
      error: error => {
        console.log(error);
        this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
      }
    })
  }

  onClick(menuId) {
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
  }

}

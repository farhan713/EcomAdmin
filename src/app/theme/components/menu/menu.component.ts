import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input} from '@angular/core';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  orgnizationData: any;
  
  constructor(private http: HttpClient , private clickService: ClickStreamService) { }

  ngOnInit() { this.getOrgdata()
  
  }

  openMegaMenu(){
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }        
    });
  }


  getOrgdata() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_organization_data').subscribe({
      next: data => {
       this.orgnizationData = data.dataset;
      //  this.getOrgDetails('d')
      },
      error: error => {
        console.log(error);
      }
    })
  }
   
  getOrgDetails(id) {
    console.log(id)
    this.http.get<any>('http://127.0.0.1:8000/console/org_info/' + id.value).subscribe({
      next: data => {
        let dataNew = {
          org_id: data.dataset[0].org_id,
          store_id: -1
        }
       
        this.clickService.setOrganizationData(dataNew);
        location.reload();
      },
      error: error => {
        console.log(error);

      }
    })
  }
}

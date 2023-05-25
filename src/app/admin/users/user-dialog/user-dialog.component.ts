import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserProfile, UserWork, UserContacts, UserSocial, UserSettings } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  public form: FormGroup;

  brandList: any = [];
  selectedBrands: any = [];
  deptList: any = [];
  selectedDepts: any = [];
  typeList: any = [];
  selectedTypes: any = [];
  subTypeList: any = [];
  selectedSubtypes: any = [];

  isBrandSelected: boolean = false;
  isDeptSelected: boolean = false;
  isTypeSelected: boolean = false;
  isSubtypeSelected: boolean = false;

  requestBody = {
    query: "",
    brand: [],
    dept: [],
    type: [],
    subtype: []
  }


  public passwordHide: boolean = true;
  constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private http: HttpClient,
    public fb: FormBuilder ,private clickService: ClickStreamService) {
    this.form = this.fb.group({
      id: null,
      username: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      profile: this.fb.group({
        name: null,
        surname: null,
        birthday: null,
        gender: null,
        image: null
      }),
      work: this.fb.group({
        company: null,
        position: null,
        salary: null
      }),
      contacts: this.fb.group({
        email: null,
        phone: null,
        address: null
      }),
      social: this.fb.group({
        facebook: null,
        twitter: null,
        google: null
      }),
      settings: this.fb.group({
        isActive: null,
        isDeleted: null,
        registrationDate: null,
        joinedDate: null
      })
    });


  }

  ngOnInit() {
    this.requestBody.query = '';
    this.requestBody.brand = this.selectedBrands;
    this.requestBody.type = this.selectedTypes;
    this.requestBody.dept = this.selectedDepts;
    this.requestBody.subtype = this.selectedSubtypes;
    console.log(this.requestBody);
    this.getAllAtributes();
    if (this.user) {
      this.form.setValue(this.user);
    }
    else {
      this.user = new User();
      this.user.profile = new UserProfile();
      this.user.work = new UserWork();
      this.user.contacts = new UserContacts();
      this.user.social = new UserSocial();
      this.user.settings = new UserSettings();
    }
  }


  getAllAtributes() {
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getAdminOrgId()+'/all_attributes').subscribe({
      next: data => {
        console.log(data)

        data.dataset[0].brand.forEach(element => {
          this.brandList.push({ isSelected: false, name: element })
        });
        data.dataset[1].dept.forEach(element => {
          this.deptList.push({ isSelected: false, name: element })
        });
        data.dataset[2].type.forEach(element => {
          this.typeList.push({ isSelected: false, name: element })
        });
        data.dataset[3].subtype.forEach(element => {
          this.subTypeList.push({ isSelected: false, name: element })
        });
      },
      error: error => {
        console.log(error);

      }
    })

  }

  filterBrand(e, item) {
    this.brandList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.brand.push(item.name)
    } else {
      var index = this.requestBody.brand.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.brand.splice(index, 1);
      }
    }

    console.log(this.requestBody);

  }
  filterDept(e, item) {
    this.deptList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.dept.push(item.name)
    } else {
      var index = this.requestBody.dept.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.dept.splice(index, 1);
      }
    }
    console.log(this.requestBody);
  }

  filterType(e, item) {
    this.typeList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.type.push(item.name)
    } else {
      var index = this.requestBody.type.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.type.splice(index, 1);
      }
    }
    console.log(this.requestBody);
  }
  filterSubType(e, item) {
    this.subTypeList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.subtype.push(item.name)
    } else {
      var index = this.requestBody.subtype.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.subtype.splice(index, 1);
      }
    }
    console.log(this.requestBody);
  }

  selectBrand() {
    this.isBrandSelected = true;
    this.isDeptSelected = false;
    this.isTypeSelected = false;
    this.isSubtypeSelected = false;
  }

  selectDept() {
    this.isBrandSelected = false;
    this.isDeptSelected = true;
    this.isTypeSelected = false;
    this.isSubtypeSelected = false;
  }

  selectType() {
    this.isBrandSelected = false;
    this.isDeptSelected = false;
    this.isTypeSelected = true;
    this.isSubtypeSelected = false;
  }

  selectSubType() {
    this.isBrandSelected = false;
    this.isDeptSelected = false;
    this.isTypeSelected = false;
    this.isSubtypeSelected = true;
  }

  removeFilter(name) {
    if (name == "brand") {
      this.requestBody.brand = [];
      this.brandList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "dept") {
      this.requestBody.dept = [];
      this.deptList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "type") {
      this.requestBody.type = [];
      this.typeList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "subtype") {
      this.requestBody.subtype = [];
      this.subTypeList.forEach(element => {
        element.isSelected = false;
      });
    }
    console.log(this.requestBody);
    
  }


  close(): void {
    this.dialogRef.close();
  }

}

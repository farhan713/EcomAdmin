import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  orgId;
  signin: boolean = true;
  signup: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  roleData;

  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      // 'orgnizationalId': ['', Validators.required],
    });

    // this.registerForm = this.formBuilder.group({
    //   'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    //   'email': ['', Validators.compose([Validators.required, emailValidator])],
    //   'password': ['', Validators.required],
    //   'confirmPassword': ['', Validators.required],
    //   'orgnizationalIdup': ['', Validators.required] ,
    //   'rolId': ['', Validators.required]
    // },{validator: matchingPasswords('password', 'confirmPassword')});
    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required],
      'orgnizationalIdup': ['', Validators.required],
      'rolId': ['', Validators.required]
    }, { validator: matchingPasswords('password', 'confirmPassword') });
    this.getLogOrgdata();
    this.getAllRoles();
  }

  public onLoginFormSubmit(values: Object): void {
    console.log("Form Click Working");

    // let org_id = this.loginForm.controls.orgnizationalId.value;
    let login = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;
    console.log(password, "forms values");

    let org_id1 = "adadad";
    let role = "admin";
    // this.loginForm.value.email=="a@gmail.com" ? localStorage.setItem('userType', 'admin') : localStorage.setItem('userType', 'superadmin');
    // if (this.loginForm.valid) {
    //   this.router.navigate(['/admin']).then(() => {
    //     // window.location.reload();
    //   });
    // }

    let data = {
      data_tables: [
        {
          "table_name": "tb_uservalidation",
          data: {
            login: login,
            password: password
          }

        }
      ]
    }
    this.http.post<any>('http://127.0.0.1:8000/console/customer_validation', { response: data }).subscribe({
      next: data => {
        console.log(data.dataset.token)
        let roleName = data.role_name;
        let token = data.dataset.token;
        let orgId = data.dataset.org_id;

        // // location.reload();
        localStorage.setItem('userType', roleName);
        localStorage.setItem('token', token);
        localStorage.setItem('adminOrg', orgId);
        this.router.navigate(['/admin']);
      },
      error: error => {
        console.log(error);

      }
    })
  }
  getAllRoles() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_customer_roles').subscribe({
      next: data => {
        // let rol = data;
        // console.log(rol, "aniket rol herea");
        this.roleData = data;
      },
      error: error => {
        console.log(error);

      }
    })
  }
  public onRegisterFormSubmit(values: Object): void {
    console.log("submit");
    let org_idup = this.registerForm.controls.orgnizationalIdup.value;
    let login = this.registerForm.controls.email.value;
    let password = this.registerForm.controls.password.value;
    let rolId = this.registerForm.controls.rolId.value;
    console.log(rolId, "igddgbgbh");
    let name = this.registerForm.controls.name.value;

    let data = {
      data_tables: [
        {
          "table_name": "tb_customer",
          data: {

            org_id: org_idup,
            store_id: 1,
            customer_id: -1,
            customer_name: name,
            login: login,
            password: password,
            role_id: rolId,
            status: true
          }

        }
      ]
    }
    this.http.post<any>('http://127.0.0.1:8000/console/customer_details', { response: data }).subscribe({
      next: data => {

        // location.reload();

      },
      error: error => {
        console.log(error);

      }
    })


  }
  getLogOrgdata() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_organization_data').subscribe({
      next: data => {


        let tempData = data.dataset;
        // tempData.forEach((val)=>{
        //     // console.log(val)
        //   if(val.status == "false"){
        //     val.status = false
        //   }else{
        //     val.status = true;
        //   }
        // })
        this.orgId = tempData;
        console.log("org id here", this.orgId);
      },
      error: error => {
        console.log(error);

      }
    })
  }
  getData(event) {
    console.log(event);
  }
  signUp() {
    this.signup = true;
    this.signin = false;
  }
  signIn() {
    this.signup = false;
    this.signin = true;
  }
}

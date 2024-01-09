import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/shared/services/auth.service';

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

  constructor(public formBuilder: FormBuilder,
    private auth: AuthService,
    public router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });

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

  public onLoginFormSubmit() {
    let login = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;
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

    this.auth.sendHttpPost('http://127.0.0.1:8000/console/customer_validation', data)
      .then((respData) => {
        localStorage.setItem('userType', respData.data.role_name);
        localStorage.setItem('token', respData.data.dataset.token);
        localStorage.setItem('adminOrg', respData.data.dataset.org_id);
        setTimeout(() => {
          // location.reload();
        }, 1000);
        this.router.navigate(['/admin']);
      }).catch((error) => { console.log(error) });
  }

  getAllRoles() {
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/all_customer_roles')
      .then((respData) => {
        this.roleData = respData.datalist;
      }).catch((error) => { console.log(error) });
  }

  public onRegisterFormSubmit(values: Object): void {
    let org_idup = this.registerForm.controls.orgnizationalIdup.value;
    let login = this.registerForm.controls.email.value;
    let password = this.registerForm.controls.password.value;
    let rolId = this.registerForm.controls.rolId.value;
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

    this.auth.sendHttpPost('http://127.0.0.1:8000/console/customer_details', data)
      .then((respData) => {
        this.signin = true;
        this.signup = false;
        this.snackBar.open('user sign up successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
      }).catch((error) => { console.log(error) });
  }

  getLogOrgdata() {
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/all_organization_data')
      .then((respData) => {
        let tempData = respData.datalist;
        this.orgId = tempData;
      }).catch((error) => { console.log(error) });
  }

  getData(event) {}

  signUp() {
    this.signup = true;
    this.signin = false;
  }

  signIn() {
    this.signup = false;
    this.signin = true;
  }
}

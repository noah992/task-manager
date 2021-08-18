import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from 'src/app/shared/state.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formUsername:any
  formPassword:any
  domBool = {
    isActiveButton:false,
    isValidUser:true
  }

  switchButton() {
    if (this.formUsername.value && this.formPassword.value) {
      this.domBool.isActiveButton = false
    } else {
      this.domBool.isActiveButton = true
    }
  }

  login() {
    this.http.post(this.state.apiUrl+'login', {username:this.formUsername.value, password:this.formPassword.value})
    .pipe(catchError((e) => {
      this.domBool.isValidUser = false
      return throwError(e)
    }))
    .subscribe((data:any) => {
      localStorage.setItem('BearerToken', data.bearerToken)
      this.state.updateUserProps.next(data)
      // if (data.validity) {
      //   
      //   this.state.login(this.username.value)
      //   this.state.userNav()
      //   this.state.checkPlan()
      //   this.router.navigate(['home'])
      // } else {
      //   this.isInvalidUser = true
      // }
      this.router.navigate(['home'])
    })
  }

  constructor(private state: StateService, private router: Router, private http: HttpClient) {
    this.formUsername = new FormControl()
    this.formPassword = new FormControl()
  }

  ngOnInit(): void {
  }

}

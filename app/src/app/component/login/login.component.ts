import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from 'src/app/shared/state.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

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

  // button will be acative when all forms are filled
  switchButton() {
    if (this.formUsername.value && this.formPassword.value) {
      this.domBool.isActiveButton = false
    } else {
      this.domBool.isActiveButton = true
    }
  }

  login() {
    this.http.post(this.state.apiUrl+'users/login', {username:this.formUsername.value, password:this.formPassword.value})
    .pipe(catchError((e) => {
      this.domBool.isValidUser = false
      return throwError(e)
    }))
    .subscribe((data:any) => {
      localStorage.setItem('BearerToken', data.bearerToken)
      const decode = jwt_decode(data.bearerToken!)
      this.state.updateUserProps.next(decode)
      this.router.navigate(['home'])
    })
  }

  constructor(private state: StateService, private router: Router, private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.formUsername = new FormControl()
    this.formPassword = new FormControl()
  }

}

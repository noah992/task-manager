import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:any
  password:any
  isActiveButton:any
  isInvalidUser:any
  isLoggedIn:any
  updateIsLoggedIn:any
  activeUser:any
  updateActiveUser:any

  switchButton() {
    if (this.username.value && this.password.value) {
      this.isActiveButton = false
    } else {
      this.isActiveButton = true
    }
  }

  login() {
    // if (this.state.isValidUser(this.username.value, this.password.value)) {
    //   localStorage.setItem('loggedInAs', this.username.value)
    //   this.router.navigate(['user', this.username.value])
    //   this.state.login()
    // } else {
    //   this.isInvalidUser = true
    // }
    this.http.post('http://localhost:3000/users/login', null, { headers: { 'Authorization': `Bearer ${this.username.value+":"+this.password.value}` } }).subscribe((data:any) => {
      if (data.validity) {
        localStorage.setItem('loggedInAs', data.token)
        localStorage.setItem('username', this.username.value)
        this.state.login(this.username.value)
        this.state.userNav()
        this.router.navigate(['user', this.username.value])
      } else {
        this.isInvalidUser = true
      }
    })
  }

  constructor(private state: StateService, private router: Router, private http: HttpClient) {
    this.username = new FormControl()
    this.password = new FormControl()
    this.isActiveButton = true
    this.isInvalidUser = false
    this.isLoggedIn = this.state.isLoggedIn
    this.updateIsLoggedIn = this.state.updateIsLoggedIn.subscribe((data:any) => {
      this.isLoggedIn = data
    })
    this.activeUser = this.state.activeUser
    this.updateActiveUser = this.state.updateActiveUser.subscribe((data:any) => {
      this.activeUser = data
    })
  }

  ngOnInit(): void {
  }

}

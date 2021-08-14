import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from './shared/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  nav:any
  updateNav:any
  isLoggedIn:any
  updateIsloggedIn:any
  activeUser:any
  updateActiveUser:any
  plan:any

  login() {
    this.router.navigate(['login'])
  }

  logout() {
    localStorage.removeItem('loggedInAs')
    this.state.logout()
    this.state.initNav()
    this.router.navigate(['home'])
  }

  constructor(private router: Router, private state: StateService) {
    this.isLoggedIn = this.state.isLoggedIn
    this.updateIsloggedIn = this.state.updateIsLoggedIn.subscribe((data:any) => {
      this.isLoggedIn = data
    })
    this.activeUser = this.state.activeUser
    this.updateActiveUser = this.state.updateActiveUser.subscribe((data:any) => {
      this.activeUser = data
    })
    this.nav = this.state.nav
    this.updateNav = this.state.updateNav.subscribe((data:any) => {
      this.nav = data
    })
  }

  ngOnInit() {
    this.state.checkPlan()
  }
  
}

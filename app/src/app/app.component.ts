import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from './shared/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  nav = [
    { page: 'Home', link: 'home' },
    { page: 'Task', link: 'user/default/task' },
    { page: 'Admin Console', link: 'user/admin/admin-console' },
    { page: 'Upgrade', link: 'user/default/upgrade' },
  ] // navigation links
  userProps:any // store user properties
  badge = '' // get badge if user joined a plan

  // navigate to logoin page
  login() {
    this.router.navigate(['login'])
  }

  // remove token from local storage, initialize app
  logout() {
    localStorage.removeItem('BearerToken')
    this.state.updateUserProps.next(false)
    this.router.navigate(['home'])
  }

  // get badge for the plan
  getBadge() {
    switch (this.userProps.plan) {
      case 'family':
        this.badge = '🥈'
        break
      case 'business':
        this.badge = '🥇'
        break
      default:
        this.badge = ''
    }
  }
  
  constructor(private router: Router, private state: StateService, private http: HttpClient) {
    
  }

  ngOnInit() {
    this.state.updateUserProps.subscribe((data:any) => {
      this.userProps = data
      this.nav = [
        { page: 'Home', link: 'home' },
        { page: 'Task', link: 'user/'+this.userProps.username+'/task' },
        { page: 'Admin Console', link: 'user/admin/admin-console' },
        { page: 'Upgrade', link: 'user/'+this.userProps.username+'/upgrade' },
      ]
      this.getBadge()
    })
    this.userProps = this.state.userProps
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from './shared/state.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  nav:any
  updateNav:any
  userProps:any
  activeUser:any
  updateActiveUser:any
  badge = ''

  login() {
    this.router.navigate(['login'])
  }

  logout() {
    localStorage.removeItem('BearerToken')
    this.state.updateUserProps.next(false)
    this.router.navigate(['home'])
    this.nav = [
      { page: 'Home', link: 'home' },
      { page: 'Task', link: ['user', this.userProps ? this.userProps.username : 'default', 'task'] },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
  }

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
    this.state.updateUserProps.subscribe(data => {
      this.userProps = data
      this.nav = [
        { page: 'Home', link: 'home' },
        { page: 'Task', link: 'user/' + this.userProps.username + '/task' },
        { page: 'Admin Console', link: 'user/admin/admin-console' },
        { page: 'Upgrade', link: 'user/' + this.userProps.username + '/upgrade' },
      ]
      this.getBadge()
    })
  }

  ngOnInit() {
    this.userProps = false
    this.nav = [
      { page: 'Home', link: 'home' },
      { page: 'Task', link: ['user', this.userProps ? this.userProps.username : 'default', 'task'] },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
    if (localStorage.getItem('BearerToken')) {
      this.http.get(this.state.apiUrl+'userInfo').pipe(
        catchError(e => {
          this.router.navigate(['login'])
          return throwError(e)
        })
      ).subscribe(data => {
        this.userProps = data
        this.state.updateUserProps.next(data)
        this.getBadge
      })
    }
  }
  
}

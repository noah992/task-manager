import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  nav:any
  updateNav = new Subject()
  user:any
  updateUser = new Subject()
  userProps:any
  userInfo: any
  updateUserProps = new Subject()
  apiUrl = 'http://localhost:3000/users/'

  // set display name with badge
  // checkPlan() {
  //   let plan;
  //   switch (localStorage.getItem('plan')) {
  //     case 'family':
  //       plan = '🥈'
  //       break
  //     case 'business':
  //       plan = '🥇'
  //       break
  //     default:
  //       plan = ''
  //   }
  //   this.updateActiveUser.next(this.activeUser+plan)
  // }

  getUser() {
    this.http.get('http://localhost:3000/users').subscribe(data => {
      this.user = data
      this.updateUser.next(this.user)
    })
  }

  isValidUser(username:string, password:string) {
    if (this.user.find((item:any) => item.username == username && item.password == password)) {
      return true
    } else {
      return false
    }
  }

  initNav() {
    this.nav = [
      { page: 'Home', link: 'home' },
      { page: 'Task', link: 'user/' + this.userProps + '/task' },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
    this.updateNav.next(this.nav)
  }

  userNav() {
    this.nav = [
      { page: 'Home', link: 'home' },
      { page: 'Task', link: 'user/' + this.userProps.username + '/task' },
      { page: 'Admin Console', link: 'user/admin/admin-console' }, 
      { page: 'Upgrade', link: ['user/' + this.userProps.username + '/upgrade'] },
    ]
    this.updateNav.next(this.nav)
  }

  // addUser(username:string, password:string) {
  //   this.http.post('http://localhost:3000/users/signup', null, { headers: { 'Authorization': `Bearer ${username+":"+password}`}}).subscribe((data:any) => {
  //     this.getUser()
  //   })
  // }

  deleteUser(id:number) {
    this.http.delete('http://localhost:3000/users/', { body: { id: id}}).subscribe(data => {
      this.getUser()
    })
  }

  editUser(id:number, username:string, email:string) {
    this.http.post('http://localhost:3000/users/edit', { id: id, username: username, email:email}).subscribe(data => {
      this.getUser()
    })
  }
  
  constructor(private http: HttpClient) {
    this.userProps = null
    this.updateUserProps.subscribe(data => {
      this.userProps = data
    })
    
  }
}
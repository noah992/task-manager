import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  nav:any
  updateNav:any
  user:any
  updateUser:any
  isLoggedIn:any
  updateIsLoggedIn:any
  activeUser:any
  updateActiveUser:any

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
  
  login(username:string) {
    this.isLoggedIn = true
    this.updateIsLoggedIn.next(this.isLoggedIn)
    this.activeUser = username
    this.updateActiveUser.next(this.activeUser)
  }

  logout() {
    this.isLoggedIn = false
    this.updateIsLoggedIn.next(this.isLoggedIn)
    this.activeUser = null
    this.updateActiveUser.next(this.activeUser)
  }

  initNav() {
    this.nav = [
      { page: 'Home', link: this.isLoggedIn ? 'user/' + this.activeUser : 'home' },
      { page: 'Task', link: 'user/' + this.activeUser + '/task' },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
    this.updateNav.next(this.nav)
  }

  userNav() {
    this.nav = [
      { page: 'Home', link: this.isLoggedIn ? 'user/' + this.activeUser : 'home' },
      { page: 'Task', link: 'user/' + this.activeUser + '/task' },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
    this.updateNav.next(this.nav)
  }

  addUser(username:string, password:string) {
    this.http.post('http://localhost:3000/users/signup', null, { headers: { 'Authorization': `Bearer ${username+":"+password}`}}).subscribe((data:any) => {
      this.getUser()
    })
  }

  deleteUser(id:number) {
    this.http.delete('http://localhost:3000/users/', { body: { id: id}}).subscribe(data => {
      this.getUser()
    })
  }

  editUser(id:number, username:string, password:string) {
    this.http.post('http://localhost:3000/users/edit', { id: id, username: username, password: password}).subscribe(data => {
      this.getUser()
    })
  }
  
  constructor(private http: HttpClient) {
    this.updateUser = new Subject()
    this.isLoggedIn = localStorage.getItem('loggedInAs') ? true : false
    this.updateIsLoggedIn = new Subject()
    this.activeUser = localStorage.getItem('username')
    this.updateActiveUser = new Subject()
    this.nav = [
      { page: 'Home', link: this.isLoggedIn ? 'user/' + this.activeUser : 'home' },
      { page: 'Task', link: 'user/' + this.activeUser + '/task' },
      { page: 'Admin Console', link: 'user/admin/admin-console' }
    ]
    this.updateNav = new Subject()
  }
}

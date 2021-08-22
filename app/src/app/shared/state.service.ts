import { Injectable, } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import UserProps from './userProps';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  user:any // default users list
  updateUser = new Subject() // streamer for defaut users list
  userProps:any // user properties
  updateUserProps = new Subject() // streamer for user properties
  apiUrl = 'http://localhost:3000/' // api url
  userInfo:any

  getUser() {
    this.http.get(this.apiUrl+'users').subscribe(data => {
      this.user = data
      this.updateUser.next(this.user)
    })
  }

  // delete a user for admin console
  deleteUser(id:number) {
    this.http.delete(this.apiUrl+'users', { body: { id: id}}).subscribe(data => {
      this.getUser()
    })
  }

  // edit a use for admin console
  editUser(id:number, username:string, email:string) {
    this.http.post(this.apiUrl+'users/edit', { id: id, username: username, email:email}).subscribe(data => {
      this.getUser()
    })
  }
  
  constructor(private http: HttpClient, private router: Router) {
    try {
      const token = localStorage.getItem('BearerToken')
      this.userProps = jwt_decode(token!)
    } catch(e) {
      this.userProps = null
    }
    
    this.updateUserProps.subscribe((data) => {
      this.userProps = data
    }) 
    if (localStorage.getItem('BearerToken')) {
      const token = localStorage.getItem('BearerToken')
      this.userProps = jwt_decode(token!)
    } else {
      this.userProps = new UserProps
    }
    this.updateUserProps.next(this.userProps)

    this.http.get(this.apiUrl+'users/user-info').subscribe(data => {
      this.userInfo = data
    })
  }
}
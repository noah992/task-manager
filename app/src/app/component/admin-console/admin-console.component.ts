import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  username:any
  password:any
  tab = 'add'
  user:any
  updateUser:any
  currentUserId:any
  currentIndex = 0
  oldUsername:any
  oldPassword:any
  isActiveButton = true
  isValidUsername = true

  switchActiveButton() {
    if (this.username.value && this.password.value) {
      this.isActiveButton = false
    } else {
      this.isActiveButton = true
    }
  }

  switchIsValidUsername() {
    const username = this.username.value
    this.http.get('http://localhost:3000/users').subscribe((data:any) => {
      if(data.find((item:any) => item.username == username)) {
        this.isValidUsername = false
      } else {
        this.isValidUsername = true
      }
    }) 
  }

  addUser() {
    this.state.addUser(this.username.value, this.password.value)
    this.username.setValue('')
    this.password.setValue('')
  }

  deleteUser(id:number) {
    this.state.deleteUser(id)
    this.username.setValue('')
    this.password.setValue('')
  }

  editUser() {
    this.state.editUser(this.currentUserId, this.username.value, this.password.value)
  }

  activateEdit(id:number, username:string, password:string) {
    this.currentUserId = id
    this.oldUsername = username
    this.oldPassword = password
    this.tab = 'edit'
    this.currentIndex = 1
    this.username.setValue(username)
    this.password.setValue(password)
  }

  switchTab(e:any) {
    if (e.index == 0) {
      this.tab = 'add'
      this.currentIndex = 0
      this.username.setValue('')
      this.password.setValue('')
    }
  }

  constructor(private state: StateService, private http: HttpClient) {
    this.username = new FormControl()
    this.password = new FormControl()
    this.user = this.state.user
    this.updateUser = this.state.updateUser.subscribe((data:any) => {
      this.user = data
    })
    this.state.getUser()
  }

  ngOnInit(): void {
  }

}

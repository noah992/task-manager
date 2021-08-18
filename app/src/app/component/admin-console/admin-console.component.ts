import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StateService } from 'src/app/shared/state.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  username:any // username form
  password:any // password form
  email:any // email form
  user:any // user list
  oldUsername:any // store previous username for update
  oldEmail:any // store previous email for update
  domBool = {
    isValidButton:false,
    isValidUsername:true,
    currentUserId: 0,
    currentIndex: 0,
    tab:'add',
    error:'',
  } // state for dom

  // button will be active when all forms are filled for add user tab
  switchActiveButton() {
    if (this.username.value && this.password.value) {
      this.domBool.isValidButton = true
    } else {
      this.domBool.isValidButton = false
    }
  }

  // button will be active when all forms are filled for edit user tab
  switchEditActiveButton() {
    if (this.username.value && this.email.value) {
      this.domBool.isValidButton = true
    } else {
      this.domBool.isValidButton = false
    }
  }

  // create new user
  addUser() {
    this.http.post(this.state.apiUrl+'users/signup', {username:this.username.value, password:this.password.value})
    .pipe(catchError(e => {
      this.domBool.isValidUsername = false
      this.domBool.error = e.error
      return throwError(e)
    }))
    .subscribe((data:any) => {
      this.username.setValue('')
      this.password.setValue('')
      this.state.updateUser.next(data)
    })
  }

  // delete a user
  deleteUser(id:number) {
    this.state.deleteUser(id)
    this.username.setValue('')
    this.email.setValue('')
  }

  // edit user information
  editUser() {
    this.state.editUser(this.domBool.currentUserId, this.username.value, this.email.value)
  }

  // activate edit page for user infomation
  activateEdit(id:number, username:string, email:string) {
    this.domBool.currentUserId = id
    this.oldUsername = username
    this.oldEmail = email
    this.domBool.tab = 'edit'
    this.domBool.currentIndex = 1
    this.username.setValue(username)
    this.email.setValue(email)
  }

  // disable edit tab byu default
  switchTab(e:any) {
    if (e.index == 0) {
      this.domBool.tab = 'add'
      this.domBool.currentIndex = 0
      this.username.setValue('')
      this.email.setValue('')
    }
  }

  constructor(private state: StateService, private http: HttpClient) {
    this.username = new FormControl()
    this.email = new FormControl()
    this.password = new FormControl()
    this.user = this.state.user
    this.state.updateUser.subscribe((data:any) => {
      this.user = data
    })
    this.state.getUser()
  }

  ngOnInit(): void {
  }

}

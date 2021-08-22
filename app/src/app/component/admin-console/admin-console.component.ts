import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { StateService } from 'src/app/shared/state.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

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
    passIncludeNum:false
  } // state for dom

  // button will be active when all forms are filled for add user tab
  switchActiveButton() {
    if (this.username.value && this.password.value) {
      this.domBool.isValidButton = true
    } else {
      this.domBool.isValidButton = false
    }
    if (this.password.value.split('').every((item:any) => isNaN(item))) {
      this.domBool.passIncludeNum = false
    } else {
      this.domBool.passIncludeNum = true
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
    if (!this.domBool.passIncludeNum) {
      this.domBool.isValidUsername = false
      this.domBool.error = 'Password must include number'
      return
    }
    if (this.username.value.length < 5) {
      this.domBool.isValidUsername = false
      this.domBool.error = 'Username must be longer than 4'
      return
    }
    if (this.password.value.length < 5) {
      this.domBool.isValidUsername = false
      this.domBool.error = 'Password must be longer than 4'
      return
    }

    this.http.post(this.state.apiUrl+'users/signup', {username:this.username.value, password:this.password.value})
    .pipe(catchError(e => {
      this.domBool.isValidUsername = false
      console.log(e)
      this.domBool.error = e.error
      return throwError(e)
    }))
    .subscribe((data:any) => {
      this.username.setValue('')
      this.password.setValue('')
      this.domBool.error = ''
      this.domBool.passIncludeNum = false
      this.username.status = 'VALID'
      this.password.status = 'VALID'
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

  constructor(private state: StateService, private http: HttpClient, private route: Router) {
    
  }

  ngOnInit(): void {
    this.username = new FormControl('', [Validators.required, Validators.minLength(5)])
    this.email = new FormControl('', [Validators.required, Validators.email])
    this.password = new FormControl('', [Validators.required, Validators.minLength(5)])
    this.user = this.state.user
    this.state.updateUser.subscribe((data:any) => {
      this.user = data
    },
    (e) => {
      this.route.navigate(['login'])
      console.log(e)
    })
    this.state.getUser()
  }

}

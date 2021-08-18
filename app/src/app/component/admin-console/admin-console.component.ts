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
  email:any
  user:any
  updateUser:any
  oldUsername:any
  oldEmail:any
  domBool = {
    isValidButton:false,
    isValidUsername:true,
    currentUserId: 0,
    currentIndex: 0,
    tab:'add',
  }

  switchActiveButton() {
    if (this.username.value && this.password.value) {
      this.domBool.isValidButton = true
    } else {
      this.domBool.isValidButton = false
    }
  }

  switchEditActiveButton() {
    if (this.username.value && this.email.value) {
      this.domBool.isValidButton = true
    } else {
      this.domBool.isValidButton = false
    }
  }

  switchIsValidUsername() {
    const username = this.username.value
    this.http.get('http://localhost:3000/users').subscribe((data:any) => {
      if(data.find((item:any) => item.username == username)) {
        this.domBool.isValidUsername = false
      } else {
        this.domBool.isValidUsername = true
      }
    }) 
  }

  addUser() {
    this.http.post('http://localhost:3000/users/signup', {username:this.username.value, password:this.password.value}).subscribe((data:any) => {
      this.username.setValue('')
      this.password.setValue('')
      this.state.updateUser.next(data)
      console.log(222, data)
      console.log(this.user)
      // this.user = this.user.map((item:any) => {
      //   if (this.oCredentil.find(i => i.username == item.username)) {
      //     const oP = this.oCredentil.find(oI => oI.username == item.username)
      //     return {...item, oPassword:oP!.password}
      //   } else {
      //     return item
      //   }
      // })
      // this.state.getUser()
    })
  }

  deleteUser(id:number) {
    this.state.deleteUser(id)
    this.username.setValue('')
    this.email.setValue('')
  }

  editUser() {
    this.state.editUser(this.domBool.currentUserId, this.username.value, this.email.value)
  }

  activateEdit(id:number, username:string, email:string) {
    this.domBool.currentUserId = id
    this.oldUsername = username
    this.oldEmail = email
    this.domBool.tab = 'edit'
    this.domBool.currentIndex = 1
    this.username.setValue(username)
    this.email.setValue(email)
  }

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
      // this.user = this.user.map((item:any) => {
      //   if (this.oCredentil.find(i => i.username == item.username)) {
      //     const oP = this.oCredentil.find(oI => oI.username == item.username)
      //     return {...item, oPassword:oP!.password}
      //   } else {
      //     return item
      //   }
      // })
    })
    this.state.getUser()
  }

  oCredentil = [
    {username:'admin',password:'helloworld'},
    {username:'whale', password:'mammal'},
    {username:'frog', password:'amphobian'},
    {username:'lizard', password:'reptile'}
  ]

  ngOnInit(): void {
  }

}

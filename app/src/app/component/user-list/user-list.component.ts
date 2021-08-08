import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  user:any
  updateUser:any

  constructor(private state: StateService) {
    this.user = this.state.user
    this.updateUser = this.state.updateUser.subscribe((data:any) => {
      this.user = data
    })
    this.state.getUser()
  }

  ngOnInit(): void {
  }

}

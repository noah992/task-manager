import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  // default user list
  users = [
    {id:1, username:'admin', password:'helloworld', email:'admin@taskmanager.com', fname:'juri', lname:'admin', plan:'free' },
    {id:2, username:'whale', password:'mammal', email:'whale@taskmanager.com', fname:'juri', lname:'whale', plan:'free' },
    {id:3, username:'frog', password:'amphobian', email:'amphobian@taskmanager.com', fname:'juri', lname:'frog', plan:'free' },
    {id:4, username:'lizard', password:'reptile', email:'reptile@taskmanager.com', fname:'juri', lname:'lizard', plan:'free' },
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}

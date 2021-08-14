import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lorem',
  templateUrl: './lorem.component.html',
  styleUrls: ['./lorem.component.css']
})
export class LoremComponent implements OnInit {

  content = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
  `.split(' ')

  constructor() { }

  ngOnInit(): void {
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task:any = []
  newTask:any
  taskId = 201
  taskNum:any

  getTask() {
    this.http.get('http://localhost:3000/task').subscribe((data:any) => {
      this.task = data
      this.taskNum = data.length
    })
  }

  addTask(e:any) {
    if (e.key == 'Enter') {
      // const newTask = {
      //   userId: localStorage.getItem('loggedInAs'),
      //   id: this.taskId++,
      //   title: this.newTask.value,
      //   completed: false,
      // }
      // this.task = [newTask, ...this.task]
      this.http.post('http://localhost:3000/task', { title: this.newTask.value}).subscribe((data: any) => {
        this.task = data
        this.taskNum = data.length
        this.newTask.setValue('')
      })
    }
  }

  deleteTask(id:number) {
    // this.task = this.task.filter((item:any) => item.id !== id)
    this.http.delete('http://localhost:3000/task', { body: { id: id } }).subscribe((data:any) => {
      this.task = data
      this.taskNum = data.length
    })
  }

  constructor(private http: HttpClient) {
    this.getTask()
    this.newTask = new FormControl()
  }

  ngOnInit(): void {
  }

}

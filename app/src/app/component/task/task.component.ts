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
  completedTask: any
  incompletedTask: any

  getTask() {
    this.http.get('http://localhost:3000/task').subscribe((data:any) => {
      this.task = data
      console.log(this.task)
      this.updateTask()
    })
  }

  addTask(e:any) {
    if (e.key == 'Enter') {
      this.http.post('http://localhost:3000/task', { title: this.newTask.value}).subscribe((data: any) => {
        this.task = data
        this.newTask.setValue('')
        this.updateTask()
      })
    }
  }

  completeTask(id:any) {
    console.log(this.task.find((item:any) => item.id == id))
    this.http.post('http://localhost:3000/task/completed', { id: id }).subscribe((data: any) => {
      this.task = data
      this.updateTask()
      console.log(this.task.find((item:any) => item.id == id))
    })
  }

  deleteTask(id:number) {
    this.http.delete('http://localhost:3000/task', { body: { id: id } }).subscribe((data:any) => {
      this.task = data
      this.updateTask()
    })
  }

  updateTask() {
    this.completedTask = this.task.filter((item:any) => item.completed == true)
    this.incompletedTask = this.task.filter((item:any) => item.completed == false)
  }

  constructor(private http: HttpClient) {
    this.getTask()
    this.newTask = new FormControl()
  }

  ngOnInit(): void {
  }

}

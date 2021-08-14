import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task:any = []
  newTask:any
  completedTask: any
  incompletedTask: any
  taskEdit:any
  editTitle:any
  editCreatedDate:any
  editDueDate:any
  editLocation:any
  editContact:any
  editDescription:any
  editId:any

  getTask() {
    this.http.get('http://localhost:3000/task').subscribe((data:any) => {
      this.task = data
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
    this.http.post('http://localhost:3000/task/completed', { id: id }).subscribe((data: any) => {
      this.task = data
      this.updateTask()
    })
  }

  editTask() {
    const body = {
      id: this.editId,
      title: this.taskEdit.controls.editTitle.value ? this.taskEdit.controls.editTitle.value : null,
      createdDate: this.taskEdit.controls.editCreatedDate.value ? this.taskEdit.controls.editCreatedDate.value : null,
      dueDate: this.taskEdit.controls.editDueDate.value ? this.taskEdit.controls.editDueDate.value : null,
      contact: this.taskEdit.controls.editContact.value ? this.taskEdit.controls.editContact.value : null,
      location: this.taskEdit.controls.editLocation.value ? this.taskEdit.controls.editLocation.value : null,
      description: this.taskEdit.controls.editDescription.value ? this.taskEdit.controls.editDescription.value : null,
    }
    this.http.post('http://localhost:3000/task/edit', body).subscribe((data: any) => {
      this.task = data
      if (data) {
        this._snackBar.open('Your task has been successfully updated', 'Close', { duration: 2000 })
      }
      this.updateTask()
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
    this.completedTask = this.completedTask.map((item:any) => {
      const date = this.convertMonthDate(item.date)
      return { ...item, date: date }
    })
    this.incompletedTask = this.task.filter((item:any) => item.completed == false)
    this.incompletedTask = this.incompletedTask.map((item:any) => {
      const date = this.convertMonthDate(item.date)
      return { ...item, date: date }
    })
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.getTask()
    this.newTask = new FormControl()
    this.taskEdit = this.fb.group({
      editTitle: [''],
      editCreatedDate: [''],
      editDueDate: [''],
      editContact: [''],
      editLocation: [''],
      editDescription: [''],
    })
  }

  generateEditTask(task:any) {
    const { id, title, contact, date, description, dueDate, location } = task
    this.taskEdit.controls.editTitle.setValue(title ? title : '')
    this.taskEdit.controls.editContact.setValue(contact ? contact : '')
    this.taskEdit.controls.editCreatedDate.setValue(date ? date : '')
    this.taskEdit.controls.editDescription.setValue(description ? description : '')
    this.taskEdit.controls.editDueDate.setValue(dueDate ? dueDate : '')
    this.taskEdit.controls.editLocation.setValue(location ? location : '')
    this.editId = id
    // this.updateTaskEdit()
  }

  convertMonthDate(time:any) {
    return ('0' + time.split("?")[0].split(':')[0]).slice(-2) + ':' + ('0' + time.split("?")[0].split(':')[1]).slice(-2) + ' ' + time.split("?")[1].split('/')[1] + '/' + time.split("?")[1].split('/')[0]+ '/' + time.split("?")[1].split('/')[2]
  }
  
  // updateTaskEdit() {
  //   this.taskEdit = [
  //     { label: 'Title', data: this.editTitle },
  //     { label: 'Created Date', data: this.editCreatedDate },
  //     { label: 'Due Date', data: this.editDueDate },
  //     { label: 'Locatoin', data: this.editLocation },
  //     { label: 'Contact', data: this.editContact },
  //     { label: 'Description', data: this.editDescription },
  //   ]
  // }
 
  ngOnInit(): void {
  }

}

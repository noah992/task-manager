import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task:any = {
    completed:false,
    incompleted:false,
  }
  updateTask = new Subject()
  userProps:any
  newTask:any
  completedTask: any
  incompletedTask: any
  taskEdit:any
  formTask:any
  idToEdit:any

  addTask(e:any) {
    if (e.key == 'Enter') {
      this.http.post('http://localhost:3000/tasks', { title: this.newTask.value, id:this.state.userProps.id}).subscribe((data: any) => {
        this.task.incompleted = [data, ...this.task.incompleted]
        this.newTask.setValue('')
        // this.task = this.task.sort((a:any, b:any) => b.id - a.id)
        // this.task = {
        //   completed:this.task.filter((item:any) => item.completed == true),
        //   incompleted:this.task.filter((item:any) => item.completed == false),
        // }
      })
    }
  }

  completeTask(id:any) {
    this.http.post('http://localhost:3000/tasks/completed', { id: id }).subscribe((data: any) => {
      this.task = {
        completed:[this.task.incompleted.find((item:any) => item.id == data.id), ...this.task.completed],
        incompleted:this.task.incompleted.filter((item:any) => item.id !== data.id),
      }
    })
  }

  editTask() {
    const content = {
      title: this.formTask.get('title').value,
      createdDate: this.formTask.get('createdDate').value,
      dueDate: this.formTask.get('dueDate').value,
      contact: this.formTask.get('contact').value,
      location: this.formTask.get('location').value,
      description: this.formTask.get('description').value,
    }
    this.http.post('http://localhost:3000/tasks/editTask', {id:this.idToEdit, content:content}).subscribe((data:any) => {
      this._snackBar.open('Your task has been successfully updated', 'Close', { duration: 2000 })
      this.task.incompleted = this.task.incompleted.map((item:any) => {
        if (item.id == data.id) {
          return data
        } else {
          return item
        }
      })
    })
  }

  deleteTask(id:number) {
    this.http.delete('http://localhost:3000/tasks', { body: { id: id } }).subscribe((data:any) => {
      this.task = data
      this.task = this.task.sort((a:any, b:any) => b.id - a.id)
      this.task = {
        completed:this.task.filter((item:any) => item.completed == true),
        incompleted:this.task.filter((item:any) => item.completed == false),
      }
    })
  }


  constructor(private http: HttpClient, private fb: FormBuilder, private _snackBar: MatSnackBar, private state: StateService) {
    this.http.get('http://localhost:3000/tasks').subscribe((data:any) => {
      this.task = data
      this.task = this.task.sort((a:any, b:any) => b.id - a.id)
      this.task = {
        completed:this.task.filter((item:any) => item.completed == true),
        incompleted:this.task.filter((item:any) => item.completed == false),
      }
    })
    this.formTask = this.fb.group({
      title: [''],
      createdDate: [''],
      dueDate: [''],
      contact: [''],
      location: [''],
      description: [''],
    })
    this.updateTask.subscribe(data => {
      this.task = data
    })
    this.state.updateUserProps.subscribe(data => {
      this.userProps = data
    })
  }

  generateEditTask(task:any) {
    const { id, title, contact, createdDate, description, dueDate, location } = task
    this.formTask.controls.title.setValue(title)
    this.formTask.controls.contact.setValue(contact)
    this.formTask.controls.createdDate.setValue(createdDate.replace('?', ' '))
    this.formTask.controls.description.setValue(description)
    this.formTask.controls.dueDate.setValue(dueDate)
    this.formTask.controls.location.setValue(location)
    this.idToEdit = id
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

}

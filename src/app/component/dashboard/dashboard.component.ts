import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseTSFirestore, OrderBy, Limit } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  data: TicketData [] = [];
  constructor(private router: Router, private dialog: MatDialog, private afAuth: AngularFireAuth){
  }
  ngOnInit(): void {
    this.getPosts();
    console.log(this.data)
  }
  onLogoutClick() {
    return this.afAuth.signOut().then(() => {
      window.alert('Logged out!');
      localStorage.removeItem('uid');
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
  onCreateTaskClick() {
    this.dialog.open(CreateTaskComponent);
  }
  getPosts(){

    this.firestore.getCollection(
      {
        path: ['TaskCollection'],
        where: [
          new OrderBy('timestamp','desc'),
          new Limit(20),
        ],
        onComplete:(result) => {
          result.docs.forEach(
            doc => {
              let ticket = <TicketData>doc.data();
              ticket.id = doc.id;
              this.data.push(ticket);
            }
          );
        },
        onFail: err => {

        }
      }
    );
  }
  drop(event: CdkDragDrop<TicketData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
export interface TicketData {
  id: string;
  taskName: string;
  taskStatus: string;
  timestamp: string;
}

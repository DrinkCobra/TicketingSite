import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseTSFirestore, OrderBy, Limit } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { CreateTaskComponent } from '../create-task/create-task.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  data: TicketData [] = [];
  constructor(private router: Router, private dialog: MatDialog){
  }
  ngOnInit(): void {
    this.getPosts();
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
          new Limit(20)
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
  name: string;
  status: string;
  time: string;
}

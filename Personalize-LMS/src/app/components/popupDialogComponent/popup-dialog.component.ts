// popup-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-dialog',
  template: `
    <h2>Feeling Bored?</h2>
    <p>Looks like you are having difficulty concentrating. Are you interested in exploring some interesting articles to get back in study mode?</p>
    <div style="text-align: right;">
    <button mat-button (click)="goToArticles()">Yes, show me!</button>
    <button mat-button (click)="close()">No thanks</button>
    </div>
  `
})
export class PopupDialogComponent {
  constructor(private dialogRef: MatDialogRef<PopupDialogComponent>, private router: Router) {}

  close() {
    this.dialogRef.close();
  }

  goToArticles() {
    this.dialogRef.close();
    this.router.navigate(['/articles']);
  }
}

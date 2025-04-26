import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popupDialogComponent/popup-dialog.component';

@Component({
  selector: 'app-webcam-monitor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule, PopupDialogComponent],
  template: `
    <video #video autoplay muted width="320" height="240"></video>
    <canvas #canvas hidden></canvas>
  `
})
export class WebcamMonitorComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  distractedCount = 0;
  consecutiveLimit = 3;
  intervalId: any;
  mediaStream!: MediaStream; // <-- store the stream

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.startWebcam();
    this.intervalId = setInterval(() => this.captureAndAnalyze(), 1000); // Every 5 seconds
  }

  startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.mediaStream = stream; // <-- store the stream
      this.videoRef.nativeElement.srcObject = stream;
    }).catch(err => {
      alert("⚠️ Unable to access webcam: " + err.message);
    });
  }

  captureAndAnalyze() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      this.http.post<any>('http://localhost:5033/analyze', formData).subscribe(response => {
        if (response.status === 'distracted') {
          this.distractedCount++;
          if (this.distractedCount >= this.consecutiveLimit) {
            this.notifyUser();
            this.distractedCount = 0;
          }
        } else {
          this.distractedCount = 0;
        }
      }, error => console.error("API error:", error));
    }, 'image/jpeg');
  }

  notifyUser() {
    const audio = new Audio('assets/notify-8-313753.mp3');
    audio.play();
    this.dialog.open(PopupDialogComponent, {
      width: '300px'
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);

    // Stop all webcam tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
  }
}

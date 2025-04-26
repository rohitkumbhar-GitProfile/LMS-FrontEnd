import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourceSelectionService } from './services/cource-selection.service';
import { marked, Marked } from 'marked'; 
import { RouterOutlet,Router,RouterModule } from '@angular/router';
import { WebcamMonitorComponent } from './components/webcam-monitor.component/webcam-monitor.component';
@Component({
  selector: 'app-course-platform',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule, WebcamMonitorComponent],
  templateUrl: './course-platform.component.html',
  styleUrls: ['./course-platform.component.css'],
})
export class CoursePlatformComponent {
  topic: any = {};
  userMessage: string = '';
  chatMessages: any[] = [];
  isVoiceMode: boolean = false;
  isListening: boolean = false;
  syllabus: string | Promise<string> = '';
  assistanceMode: 'text' | 'voice' = 'text'; // Added toggle mode

  constructor(private route: ActivatedRoute, private ser: CourceSelectionService, private router: Router) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadCourseDetails(courseId); 
  }

  loadCourseDetails(courseId: number) {
    const courses: any[] = JSON.parse(localStorage.getItem('courseList') || '[]');
    this.topic = courses.find(course => course.id === courseId) || {};
    const topicData = localStorage.getItem(this.topic.title);

    if (topicData != null) {
      this.syllabus = marked(JSON.parse(topicData));
    } else {
      this.GetSyllabusByCourse(this.topic.title + this.topic.description);
    }
  }

  GetSyllabusByCourse(CourseName: string) {
    this.ser.GetMoreInfoRelatedToTopic(CourseName).subscribe({
      next: (res) => {
        localStorage.setItem(this.topic.title, JSON.stringify(res.syllabus));
        this.syllabus = marked(res.syllabus);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatMessages.push({ sender: 'You', text: this.userMessage });
      this.getAssistantResponse();
    }
  }

  getAssistantResponse() {
    if(this.assistanceMode === 'text'){
      this.ser.GetMoreInfoRelatedToTopic(this.userMessage).subscribe({
        next: (res) => {
          if (this.assistanceMode === 'text') {
            this.chatMessages.push({ sender: 'Assistant', text: marked(res.syllabus) });
          } else {
            this.chatMessages.push({ sender: 'Assistant', text: this.userMessage }); // show input as text
            
          }
          this.userMessage = '';
        },
        error: (err) => {
          console.error('Error getting assistant response:', err);
        }
      });
    }
   if(this.assistanceMode === 'voice'){
    this.playTextToSpeech(this.userMessage);
    this.userMessage='';
   }
  }

  playTextToSpeech(text: string) {
    this.ser.getSpeechFromText(text).subscribe({
      next: (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      },
      error: (err) => {
        console.error('TTS error:', err);
      }
    });
  }

  toggleVoiceInput() {
    this.isVoiceMode = !this.isVoiceMode;
    this.isListening = false;
    if (this.isVoiceMode) {
      this.startVoiceRecognition();
    }
  }

  startVoiceRecognition() {
    const recognition = new (window as any).SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      this.isListening = true;
    };

    recognition.onresult = (event: any) => {
      const message = event.results[0][0].transcript;
      this.userMessage = message;
      this.sendMessage();
      this.isListening = false;
    };

    recognition.onerror = () => {
      this.isListening = false;
    };

    recognition.onend = () => {
      this.isListening = false;
    };

    recognition.start();
  }

  navigateToQuizPage() {
    this.router.navigate(['/quiz', this.topic.id]);
  }
}

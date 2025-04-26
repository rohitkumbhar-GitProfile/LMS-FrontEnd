import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourceSelectionService {

  private apiUrl = 'http://localhost:7058/api/Ai/';

  constructor(private http: HttpClient) { }

  selectCource(courseName: string): Observable<any> {
    
    return this.http.post(this.apiUrl+ "CourseList", JSON.stringify(courseName), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  GetMoreInfoRelatedToTopic(courseName: string): Observable<any> {
    return this.http.post(this.apiUrl +"MoreInfo", JSON.stringify(courseName), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  
  submitCourses(courses: any[]): Observable<any> {
    const requestBody = {
      cources: courses
    };
       
    return this.http.post('http://localhost:7058/api/User/AssignCourses', JSON.stringify(requestBody), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  getSpeechFromText(text: string): Observable<Blob> {
    return this.http.get('https://localhost:7058/api/TTS/TextToVoice', {
      params: { text },
      responseType: 'blob' // Important to get binary audio data
    });
  }
  
}

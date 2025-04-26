// quiz.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) { }

  getQuiz(topic: string): Observable<any> {
    //topic='C#';
    const prompt = `Generate a multiple-choice quiz on the topic "${topic}". Return ONLY valid JSON as an array of exactly 5 questions. 
    Each question must include a 'question' (string), 'options' (array of strings), and a correct 'answer' (string). 
    Do NOT include any extra text, explanation, markdown, or notes — only return pure JSON.`;
        return this.http.post(`http://localhost:7058/api/Ai/Quiz`, JSON.stringify(prompt), {
     // responseType: 'text',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateQuizScore(title: string, userId: number, quizScore:number): Observable<any> {
    
    const requestBody = {
      Title: title,
      UserId: userId,
      QuizScore:quizScore
    };

    return this.http.post('http://localhost:7058/api/User/UpdateScore', JSON.stringify(requestBody), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

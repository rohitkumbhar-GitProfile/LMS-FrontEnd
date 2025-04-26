import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:7058/api/User/Login'; // Replace with your actual API

  constructor(private http: HttpClient) {}
  login(username: string, password: string, email: string = '', phoneNumber: string = '', areaOfIntrest:string='',token:string=''): Observable<any> {
    const requestBody = {
      username,
      password,
      email,        // Can be empty or null
      phoneNumber,
      areaOfIntrest,  // Can be empty or null
      token
    };

    return this.http.post(`${this.apiUrl}`, requestBody);
  }

  register(username: string, password: string, email: string = '', phoneNumber: string = '', areaOfIntrest:string='',token:string=''): Observable<any> {
    const requestBody = {
      username,
      password,
      email,        // Can be empty or null
      phoneNumber,
      areaOfIntrest,  // Can be empty or null
      token
    };

    return this.http.post(`${this.apiUrl}`, requestBody);
  }
}

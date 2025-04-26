import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  imports : [CommonModule]
})
export class ArticlesComponent implements OnInit {
  articles: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('UserData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const username = parsedUser.username;

        this.http.get<any[]>(`http://localhost:7058/api/article/${username}`)
          .subscribe(
            data => {
              this.articles = data;
              localStorage.setItem('articles', JSON.stringify(data));
            },
            error => {
              console.error('Failed to fetch articles:', error);
            }
          );
      } else {
        console.warn('⚠️ No user data found in localStorage.');
      }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}

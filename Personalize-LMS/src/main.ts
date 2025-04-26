import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { CourseSelectionComponent } from './app/pages/course-selection.component';
import { CoursePlatformComponent } from './app/course-platform.component'; 
import { provideHttpClient } from '@angular/common/http';
import { QuizComponent } from './app/components/quiz/quiz.component';
import { AppComponent } from './app/app.component';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { UserProfileComponent } from './app/components/user-profile.component/user-profile.component';
import { ArticlesComponent } from './app/components/ArticlesComponent/articles.component';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'courses', component: CourseSelectionComponent },
      { path: 'course-platform', component: CoursePlatformComponent },
      { path: 'course-platform/:courseId', component: CoursePlatformComponent },
      { path: 'quiz/:courseId', component: QuizComponent },
      { path: 'user-profile', component: UserProfileComponent},
      { path: 'articles', component: ArticlesComponent }

    ])
  ]
});

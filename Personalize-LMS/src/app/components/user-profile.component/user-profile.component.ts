import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet,Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule]
})
export class UserProfileComponent {
  currentJob = '';
  educationLevel = '';
  fieldOfStudy = '';
  currentSkills = '';
  interestedSkills = '';
  passion = '';
  goal = '';
  isSubmitting = false;
  showToast = false;
  errorMessage = '';

  constructor(private http: HttpClient,private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const userProfile = {
      currentJob: this.currentJob,
      educationLevel: this.educationLevel,
      fieldOfStudy: this.fieldOfStudy,
      currentSkills: this.currentSkills,
      interestedSkills: this.interestedSkills,
      passion: this.passion,
      goal: this.goal
    };

    this.http.post('http://localhost:7058/api/UserProfile', userProfile).subscribe({
      next: (res) => {

        localStorage.setItem('UserProfile', JSON.stringify(res)); // Save profile if you want
      
      const userData = localStorage.getItem('UserData');

      if (userData) {
        // If UserData exists, go to courses
        this.router.navigate(['/courses']);
        alert('Profile Created Successfully!');
      } else {
        // If not logged in, go to login
        this.router.navigate(['/login']);
      }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create profile. Please try again.';
        this.showToast = true;
      }
    });
  }

  hideToast() {
    this.showToast = false;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormValidationService } from '../services/form-validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: any = '';
  password: string = '';
  email: any = '';
  mobile: any = '';
  interest: any = '';
  errorMessage = '';
  showToast = false;
  isRegister = false;
  isSubmitting = false; // For loading spinner

  constructor(
    private authser: AuthService,
    private router: Router,
    private formValidationService: FormValidationService
  ) {}

  // Switch between login and register forms
  switchToRegister() {
    this.isRegister = true;
  }

  switchToLogin() {
    this.isRegister = false;
  }

  // Handle login
  onLogin() {
    this.isSubmitting = true; // Show loading spinner
    this.authser.login(this.username, this.password).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.showToast = false;
        localStorage.setItem('UserData', JSON.stringify(res.result));
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          // If user profile exists, go to courses
          this.router.navigate(['/courses']);
        } else {
          // If no profile, send user to user-profile page
          this.router.navigate(['/user-profile']);
        }
        this.isSubmitting = false; // Hide loading spinner
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.showToast = true;
        this.isSubmitting = false; // Hide loading spinner
      },
    });
  }

  // Handle registration
  onRegister() {
    this.isSubmitting = true; // Show loading spinner

    if (
      !this.formValidationService.required(this.username) &&
      !this.formValidationService.required(this.email) &&
      !this.formValidationService.required(this.mobile) &&
      !this.formValidationService.required(this.interest)
    ) {
      this.errorMessage = 'All fields are required.';
      this.showToast = true;
      this.isSubmitting = false; // Hide loading spinner
      return;
    }

    // Call your registration API here
    this.authser.register(this.username, this.password, this.email, this.mobile, this.interest).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.showToast = false;
        localStorage.setItem('UserData', JSON.stringify(res.result));
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          // If user profile exists, go to courses
          this.router.navigate(['/courses']);
        } else {
          // If no profile, send user to user-profile page
          this.router.navigate(['/user-profile']);
        }
        this.isSubmitting = false; // Hide loading spinner
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.showToast = true;
        this.isSubmitting = false; // Hide loading spinner
      },
    });

    // On successful registration, switch to login
    this.router.navigate(['/user-profile']);
    this.isSubmitting = false; // Hide loading spinner
  }

  // Hide toast
  hideToast() {
    this.showToast = false;
  }
}

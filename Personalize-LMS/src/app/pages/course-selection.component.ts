import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourceSelectionService } from '../services/cource-selection.service';
import { parse } from 'marked';

@Component({
  selector: 'app-course-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-selection.component.html',
  styleUrls: ['./course-selection.component.css'],
})
export class CourseSelectionComponent implements OnInit {
  constructor(
    private courseSelection: CourceSelectionService,
    private router: Router
  ) {}

  courseList: any[] = [];
  user:any={};
  userProfile:any={};
  ngOnInit(): void {
    const storedCourseList = localStorage.getItem('courseList');
    const UserData = localStorage.getItem('UserData');
    const UserProfile = localStorage.getItem('UserProfile');
    if (storedCourseList != null || storedCourseList != undefined) {

      this.courseList = JSON.parse(storedCourseList);
      const user = UserData ? JSON.parse(UserData) : null;

      const formattedCourses = this.courseList.map((course: any) => ({
        userId: user.id,  
        title: course.title,
        courseName: course.title,
        description: course.description,
        imageUrl: course.image,
        quizScore: 0
      }));

      this.courseSelection.submitCourses(formattedCourses).subscribe({
        next: (response) => {
          console.log('Courses submitted successfully', response);
        },
        error: (error) => {
          console.error('Error submitting courses', error);
        }
      });
    } 
    else {
      if(UserData !=null || UserData != undefined){
        this.user=JSON.parse(UserData);  
      }

      if(UserProfile !=null || UserProfile != undefined){
        this.userProfile=JSON.parse(UserProfile);  
      }
      
      // If no data in localStorage, make the API call
      const prompt = `
Based on the following user profile, return a list of recommended courses. Strictly follow the exact JSON format provided below. Do not include any extra text, explanations, or variations. Any deviation from this format will cause the application to break. Ensure each "image" value is a valid image URL.

User Profile:
- Current Job: ${this.userProfile.currentJob}
- Education Level: ${this.userProfile.educationLevel}
- Field of Study: ${this.userProfile.fieldOfStudy}
- Current Skills: ${this.userProfile.currentSkills}
- Interested Skills: ${this.userProfile.interestedSkills}
- Passion: ${this.userProfile.passion}
- Goal: ${this.userProfile.goal}
- Area of Interest: ${this.userProfile.areaOfInterest}

Return in this JSON format:

[
  {
    "id": number,
    "title": "string",
    "description": "string",
    "image": "valid_image_url"
  }
]
`;
      
  
      this.courseSelection.selectCource(prompt).subscribe({
        next: (res) => {
          this.courseList = res.courseList;
          localStorage.setItem('courseList', JSON.stringify(this.courseList));
        },
        error: (err) => {
          console.error('Error fetching course data:', err);
        }
      });
    }
    
  }

  goToCoursePlatform(courseId: number) {
    this.router.navigate(['/course-platform', courseId]);
  }
}

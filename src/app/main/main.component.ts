import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Arr {
  [key: string]: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  courses: {day: ''}[] = [];
  days: string[] = [];
  displayedColumns: string[] = ['name', 'timeFrom', 'teacher', "room"];
  constructor(private dataService: DataService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dataService.loadCoursesFromAPI().subscribe(
      (data: any[]) => {
        this.courses = data;

        const uniqueDaysSet = new Set<string>();
        this.courses.forEach(course => {
          uniqueDaysSet.add(course.day);
        });
        this.days =  Array.from(uniqueDaysSet);
      },
      (error: any) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  openDialog(course: any): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '500px',
      data: { course: course, name: '', gender: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Hier kannst du die Ergebnisse aus dem Dialog verarbeiten
    });
  }

  getCoursesByDay(day: any) {
    return this.courses.filter((course) => course.day == day)
  }

  getDay(str: any): string | undefined {
    const dayArr: Arr = {
      "MON": "Montag",
      "TUE": "Dienstag",
      "WED": "Mittwoch",
      "THU": "Donnerstag",
      "FRI": "Freitag",
      "SAT": "Samstag",
      "SUN": "Sonntag"
    };
    return dayArr[str];
  }

}

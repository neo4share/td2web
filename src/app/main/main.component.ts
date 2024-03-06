import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface DayArr {
  [key: string]: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  courses: {}[] = [];
  displayedColumns: string[] = ['name', 'timeFrom', 'teacher', "room", "day"];
  constructor(private dataService: DataService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dataService.loadCoursesFromAPI().subscribe(
      (data: any[]) => {
        this.courses = data;
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


  getDay(str: string): string | undefined {
      const dayArr: DayArr = {
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

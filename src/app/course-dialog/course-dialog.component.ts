import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent {

  username: string | null = null;
  isLeader: boolean = false;
  isFollower: boolean = false;
  selectedUsername: String | null = null;
  isNameDuplicate: boolean = false;
  existingNames: {username:'', gender: '', id: ''}[] | null = null;
  courseParticipants: {username:'', gender: ''}[] | null = null;

  leader: {username:''}[] | null = null; 
  follower: {username:''}[] | null = null; 

  constructor(
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.loadExistingParticipants().subscribe(
      (data: any[]) => {
        this.existingNames = data;
      },
      (error: any) => {
        console.error('Error loading courses:', error);
      }
    );

    this.dataService.getParticipantsByCourseId(this.data.course.id).subscribe(
      (data: any[]) => {
        this.courseParticipants = data;
        this.getFollower();
        this.getLeader();
      },
      (error: any) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {

    if(!this.selectedUsername && !this.nameExists(this.username)) {
      let params = {username: this.username, gender: (this.isFollower ? "follower" : (this.isLeader ? "leader" : null))}
      this.dataService.saveParticipantToAPI(params).subscribe(
        (response: any) => {
          console.log('Data saved successfully:', response);
          let params = {courseId: this.data.course.id, participantId: response.id}
          this.dataService.saveDataToAPI(params).subscribe(
            (response: any) => {
              console.log('Data saved successfully:', response);
              this.dialogRef.close();
            },
            (error: any) => {
              console.error('Error saving data:', error);
              // Handle error
            }
          );
        },
        (error: any) => {
          console.error('Error saving data:', error);
          // Handle error
        }
      );
    } else {
      let participantId = this.existingNames?.find((el) => el.username == this.selectedUsername)?.id
      let params = {courseId: this.data.course.id, participantId: participantId}
      this.dataService.saveDataToAPI(params).subscribe(
        (response: any) => {
          console.log('Data saved successfully:', response);
          this.dialogRef.close();
        },
        (error: any) => {
          console.error('Error saving data:', error);
          // Handle error
        }
      );
    }
    this.dialogRef.close();
  }

  nameExists(name: String | null): boolean {
    let exists = false;
    this.existingNames?.forEach(entry => {
      if(entry.username == name) exists = true;
    })
    return exists;
  }

  getLeader() {
    if(this.courseParticipants)
      this.leader = this.courseParticipants?.filter((el) => el.gender && el.gender == 'leader')
  }

  getFollower() {
    if(this.courseParticipants)
       this.follower =  this.courseParticipants?.filter((el) => el.gender && el.gender == 'follower')
  }
}

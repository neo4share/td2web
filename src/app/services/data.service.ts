import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  // Methode zum Laden der Kurse von der API und Speichern im DataService
  loadCoursesFromAPI(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/courses/').pipe(
      tap((data: any[]) => {
        // Kurse im DataService speichern
        return data;
      }),
      catchError((error: any) => {
        console.error('Error loading courses from API:', error);
        throw error; // Fehler weitergeben
      })
    );
  }

  // Methode zum Laden der Teilnahmer von der API und Speichern im DataService
  loadExistingParticipants(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/participants/').pipe(
      tap((data: any[]) => {
        return data;
      }),
      catchError((error: any) => {
        console.error('Error loading courses from API:', error);
        throw error; // Fehler weitergeben
      })
    );
  }

  getParticipantsByCourseId(courseId:string): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/courses/' + courseId + '/participants').pipe(
      tap((data: any[]) => {
        return data;
      }),
      catchError((error: any) => {
        console.error('Error loading courses from API:', error);
        throw error; // Fehler weitergeben
      })
    );
  }

  // Methode zum Speichern der Informationen über die Schnittstelle
  saveDataToAPI(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/participants/course/' + data.courseId + '/participant/' + data.participantId, null).pipe(
      tap((response: any) => {
        console.log('Data saved successfully:', response);
      }),
      catchError((error: any) => {
        console.error('Error saving data:', error);
        throw error; // Fehler weitergeben
      })
    );
  }

  saveParticipantToAPI(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/participants/', data).pipe(
      tap((response: any) => {
        console.log('Data saved successfully:', response);
      }),
      catchError((error: any) => {
        console.error('Error saving data:', error);
        throw error; // Fehler weitergeben
      })
    );
  }
}

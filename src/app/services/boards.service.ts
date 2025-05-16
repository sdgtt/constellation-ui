import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, find, map, Observable, of } from 'rxjs';
import { Boards } from '../models/boards.model';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor(private httpClient: HttpClient) { }

  getDataAggregates(): Observable<any[]> {
    const httpUrl = `${environment.apiUrl}/api/boards`;

    return this.httpClient.get<any>(httpUrl, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: false // Set to true if using authentication cookies
  }).pipe(
      map((response: any) => response.aggregates_top || [])  // Ensuring the property exists or return an empty array
    );
  }
  getBoardDetails(boardName: string): Observable<any[]> {
    const httpUrl = `${environment.apiUrl}/api/board/${boardName}/`;

    return this.httpClient.get<any>(httpUrl, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: false // Set to true if using authentication cookies
    }).pipe(
      map((response: any) => response.hits || [])  // Ensuring the property exists or return an empty array
    );
  }
  getBoardSCDetails(): Observable<any[]> {
    const httpUrl = `${environment.apiUrl}/api/sc/`;

    return this.httpClient.get<any>(httpUrl).pipe(
      map((response: any) => response.hits || [])  // Ensuring the property exists or return an empty array
    );
  }

}

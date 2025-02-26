import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, find, map, Observable, of } from 'rxjs';
import { Boards } from '../models/boards.model';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor(private httpClient: HttpClient) { }

  getDataAggregates(): Observable<any[]> {
    const httpUrl = `${environment.apiUrl}/api/boards`;

    return this.httpClient.get<any>(httpUrl).pipe(
      map((response: any) => response.aggregates_top || [])  // Ensuring the property exists or return an empty array
    );
  }
  getBoardDetails(boardName: string): Observable<any[]> {
    const httpUrl = `${environment.apiUrl}/api/board/${boardName}`;

    return this.httpClient.get<any>(httpUrl).pipe(
      map((response: any) => response.hits || [])  // Ensuring the property exists or return an empty array
    );
  }

}

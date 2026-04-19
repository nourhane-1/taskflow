import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBoards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/boards`);
  }

  createBoard(data: { title: string; description?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/boards`, data);
  }

  getBoard(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/boards/${id}`);
  }

  updateBoard(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/boards/${id}`, data);
  }

  deleteBoard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boards/${id}`);
  }

  getLists(boardId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/boards/${boardId}/lists`);
  }

  createList(boardId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/boards/${boardId}/lists`, data);
  }

 deleteList(boardId: string, listId: string): Observable<any> {
 
  return this.http.delete(`${this.apiUrl}/boards/${boardId}/lists/${listId}`);
}
  addMember(boardId: string, email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/boards/${boardId}/members`, { email });
}

removeMember(boardId: string, userId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/boards/${boardId}/members/${userId}`);
}

getMembers(boardId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/boards/${boardId}/members`);
}
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(listId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lists/${listId}/tasks`);
  }

  createTask(listId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lists/${listId}/tasks`, data);
  }

  updateTask(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, data);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tasks/${id}/status`, { status });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }
  addComment(id: string, text: string): Observable<any> {
  
    return this.http.post(`${this.apiUrl}/tasks/${id}/comments`, { text });
}
assignTask(id: string, userId: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/tasks/${id}/assign`, { userId });
}
moveTask(id: string, listId: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/tasks/${id}/move`, { listId });
}
}

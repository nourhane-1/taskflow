import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskStateService {
  private openTaskId = new BehaviorSubject<string | null>(null);
  openTaskId$ = this.openTaskId.asObservable();

  requestOpenTask(taskId: string) {
    this.openTaskId.next(taskId);
  }

  clear() {
    this.openTaskId.next(null);
  }
}
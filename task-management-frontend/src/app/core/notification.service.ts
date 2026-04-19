import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this.notifications.asObservable();

  add(message: string, type: 'info' | 'success' | 'warning' = 'info') {
    const current = this.notifications.getValue();
    this.notifications.next([
      { message, type, time: new Date(), read: false, id: Date.now() },
      ...current
    ]);
  }

  markAllRead() {
    const updated = this.notifications.getValue().map(n => ({ ...n, read: true }));
    this.notifications.next(updated);
  }

  get unreadCount$() {
    return new BehaviorSubject(
      this.notifications.getValue().filter(n => !n.read).length
    ).asObservable();
  }

  clear() {
    this.notifications.next([]);
  }
}
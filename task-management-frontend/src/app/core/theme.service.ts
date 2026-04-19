import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.setDark(true);
    }
  }

  toggle() {
    this.setDark(!this.isDark.getValue());
  }

  setDark(dark: boolean) {
    this.isDark.next(dark);
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  get current(): boolean {
    return this.isDark.getValue();
  }
}
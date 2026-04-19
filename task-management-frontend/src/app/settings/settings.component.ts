import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  user: any = null;
  name = '';
  email = '';
  emailDigests = true;
  browserPush = false;
  mobileAlerts = true;
  theme = 'light';
  saved = false;
saving = false;
constructor(
  private authService: AuthService,
  public themeService: ThemeService
) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      this.name = u?.name || '';
      this.email = u?.email || '';
    });
  }

  getInitials(): string {
    if (!this.name) return '?';
    return this.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  saveSettings() {
  this.saving = true;
  this.authService.updateProfile({ name: this.name, email: this.email }).subscribe({
    next: () => {
      this.saved = true;
      this.saving = false;
      setTimeout(() => this.saved = false, 2500);
    },
    error: () => this.saving = false
  });
}

  logout() {
    this.authService.logout();
  }
}
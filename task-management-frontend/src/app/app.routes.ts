import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'boards',
        loadComponent: () => import('./boards/board-list/board-list.component').then(m => m.BoardListComponent)
      },
      {
        path: 'boards/:id',
        loadComponent: () => import('./kanban/board-detail/board-detail.component').then(m => m.BoardDetailComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
      },
      
      {
  path: 'boards/:id/team',
  loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent)
},
{
  path: 'reports',
  loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
}
    ]
  }
];
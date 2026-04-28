import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BoardService } from '../../boards/board.service';
import { TaskService } from '../../tasks/task.service';
import { NotificationService } from '../../core/notification.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  @Output() menuToggled = new EventEmitter<void>();

  user: any = null;
  searchQuery = '';
  searchResults: any[] = [];
  showResults = false;
  boards: any[] = [];
  allTasks: any[] = [];
  allLists: any[] = [];
  currentBoardId: string | null = null;
  notifications: any[] = [];
  showNotifications = false;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private taskService: TaskService,
    public notificationService: NotificationService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  
  toggleMenu() {
    this.menuToggled.emit();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.user = u);

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const match = e.url.match(/\/boards\/([^\/]+)/);
      this.currentBoardId = match ? match[1] : null;
    });

    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(n => !n.read).length;
    });

    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards = boards;
        boards.forEach(board => {
          this.boardService.getLists(board._id).subscribe({
            next: (lists) => {
              this.allLists = [
                ...this.allLists,
                ...lists.map(l => ({ ...l, boardId: board._id, boardTitle: board.title }))
              ];
              lists.forEach(list => {
                this.taskService.getTasks(list._id).subscribe({
                  next: (tasks) => {
                    this.allTasks = [
                      ...this.allTasks,
                      ...tasks.map(t => ({ ...t, listId: list._id, boardId: board._id, boardTitle: board.title }))
                    ];
                  }
                });
              });
            }
          });
        });
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    const q = this.searchQuery.toLowerCase();

    if (this.currentBoardId) {
      const listResults = this.allLists
        .filter(l => l.boardId === this.currentBoardId && l.title.toLowerCase().includes(q))
        .map(l => ({ ...l, type: 'list' }));

      const taskResults = this.allTasks
        .filter(t => t.boardId === this.currentBoardId &&
          (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)))
        .map(t => ({ ...t, type: 'task' }));

      this.searchResults = [...listResults, ...taskResults].slice(0, 8);
    } else {
      const boardResults = this.boards
        .filter(b => b.title.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q))
        .map(b => ({ ...b, type: 'board' }));

      this.searchResults = boardResults.slice(0, 8);
    }

    this.showResults = true;
  }

  goToResult(result: any) {
    if (result.type === 'board') {
      this.router.navigate(['/boards', result._id]);
    } else {
      this.router.navigate(['/boards', result.boardId]);
    }
    this.searchQuery = '';
    this.showResults = false;
  }

  closeSearch() {
    setTimeout(() => this.showResults = false, 200);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.markAllRead();
    }
  }

  closeNotifications() {
    setTimeout(() => this.showNotifications = false, 200);
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout();
  }
}
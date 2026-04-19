import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { BoardService } from '../../boards/board.service';
import { AuthService } from '../../auth/auth.service';
import { TaskService } from '../../tasks/task.service';
import { TaskStateService } from '../../core/task-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  boards: any[] = [];
  user: any = null;
  currentBoardId: string | null = null;
expandedBoardId: string | null = null;
boardLists: { [boardId: string]: any[] } = {};
boardTasks: { [listId: string]: any[] } = {};
  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private taskService: TaskService,
      private taskStateService: TaskStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBoards();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const match = e.url.match(/\/boards\/([^\/]+)/);
      this.currentBoardId = match ? match[1] : null;
      this.loadBoards();
    });
  }

  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards) => this.boards = boards
    });
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  goToBoard(id: string) {
    this.router.navigate(['/boards', id]);
  }

  goToTeam(id: string, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/boards', id, 'team']);
  }
goToList(boardId: string, event: Event) {
  event.stopPropagation();
  this.router.navigate(['/boards', boardId]);
}
newBoard() {
  this.router.navigate(['/boards']).then(() => {
    window.dispatchEvent(new CustomEvent('openNewBoard'));
  });
}
toggleBoard(boardId: string, event: Event) {
  event.stopPropagation();
  if (this.expandedBoardId === boardId) {
    this.expandedBoardId = null;
  } else {
    this.expandedBoardId = boardId;
    if (!this.boardLists[boardId]) {
      this.boardService.getLists(boardId).subscribe({
        next: (lists) => {
          this.boardLists[boardId] = lists;
        }
      });
    }
  }
}

toggleList(listId: string, event: Event) {
  event.stopPropagation();
  if (!this.boardTasks[listId]) {
    this.taskService.getTasks(listId).subscribe({
      next: (tasks) => this.boardTasks[listId] = tasks
    });
  } else {
    delete this.boardTasks[listId];
  }
}


openTask(task: any, boardId: string) {
  this.taskStateService.requestOpenTask(task._id);
  this.router.navigate(['/boards', boardId]);
}
  logout() {
    this.authService.logout();
  }
}
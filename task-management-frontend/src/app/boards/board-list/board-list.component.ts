import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent implements OnInit {
  boards: any[] = [];
  loading = true;
  showForm = false;
  newTitle = '';
  newDescription = '';

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router
  ) {}

 
ngOnInit() {
  this.loadBoards();
  window.addEventListener('openNewBoard', () => {
    this.showForm = true;
  });
}
  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards = boards;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  createBoard() {
    if (!this.newTitle.trim()) return;
    this.boardService.createBoard({ title: this.newTitle, description: this.newDescription }).subscribe({
      next: (board) => {
        this.boards.unshift(board);
        this.newTitle = '';
        this.newDescription = '';
        this.showForm = false;
      }
    });
  }

  openBoard(id: string) {
    this.router.navigate(['/boards', id]);
  }

  deleteBoard(id: string, event: Event) {
    event.stopPropagation();
    this.boardService.deleteBoard(id).subscribe({
      next: () => this.boards = this.boards.filter(b => b._id !== id)
    });
  }

  logout() {
    this.authService.logout();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../boards/board.service';
import { NotificationService } from '../core/notification.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  boardId: string = '';
  board: any = null;
  members: any[] = [];
  newEmail = '';
  error = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') || '';
    if (this.boardId) {
      this.loadBoard();
      this.loadMembers();
    }
  }

  loadBoard() {
    this.boardService.getBoard(this.boardId).subscribe({
      next: (board) => this.board = board
    });
  }

  loadMembers() {
    this.boardService.getMembers(this.boardId).subscribe({
      next: (members) => {
        this.members = members;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addMember() {
    if (!this.newEmail.trim()) return;
    this.error = '';
    this.boardService.addMember(this.boardId, this.newEmail).subscribe({
      next: (user) => {
        this.members.push(user);
        this.newEmail = '';
        this.notificationService.add(`${user.name} added to the board`, 'success');
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add member';
      }
    });
  }

  removeMember(userId: string, userName: string) {
    this.boardService.removeMember(this.boardId, userId).subscribe({
      next: () => {
        this.members = this.members.filter(m => m._id !== userId);
        this.notificationService.add(`${userName} removed from the board`, 'info');
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
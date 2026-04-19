import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { AuthService } from '../../auth/auth.service';
import { BoardService } from '../../boards/board.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent implements OnInit {
  @Input() task: any = null;
  @Input() listId: string = '';
  @Input() boardId: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>();

  editTitle = '';
  editDescription = '';
  editPriority = 'medium';
  editDueDate = '';
  newComment = '';
  saving = false;
  user: any = null;
  members: any[] = [];
  selectedAssignee = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.user = u);
    if (this.task) {
      this.editTitle = this.task.title;
      this.editDescription = this.task.description || '';
      this.editPriority = this.task.priority || 'medium';
      this.editDueDate = this.task.dueDate ? this.task.dueDate.substring(0, 10) : '';
      this.selectedAssignee = this.task.assignee?._id || this.task.assignee || '';
    }
    if (this.boardId) {
      this.boardService.getMembers(this.boardId).subscribe({
        next: (members) => this.members = members
      });
    }
  }

  save() {
    this.saving = true;
    this.taskService.updateTask(this.task._id, {
      title: this.editTitle,
      description: this.editDescription,
      priority: this.editPriority,
      dueDate: this.editDueDate || null
    }).subscribe({
      next: (updated) => {
        if (this.selectedAssignee) {
          this.taskService.assignTask(this.task._id, this.selectedAssignee).subscribe({
            next: (assigned) => {
              this.saving = false;
              this.updated.emit(assigned);
            },
            error: () => this.saving = false
          });
        } else {
          this.saving = false;
          this.updated.emit(updated);
        }
      },
      error: () => this.saving = false
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.taskService.addComment(this.task._id, this.newComment).subscribe({
      next: (updated) => {
        this.task = updated;
        this.newComment = '';
      }
    });
  }

  updateStatus(status: string) {
    this.taskService.updateStatus(this.task._id, status).subscribe({
      next: (updated) => {
        this.task = updated;
        this.updated.emit(updated);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAssigneeName(): string {
    const member = this.members.find(m => m._id === this.selectedAssignee);
    return member?.name || 'Unassigned';
  }

  close() {
    this.closed.emit();
  }
}
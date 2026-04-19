import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../boards/board.service';
import { TaskService } from '../tasks/task.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  boards: any[] = [];
  allTasks: any[] = [];
  loading = true;

  totalBoards = 0;
  totalTasks = 0;
  todoCount = 0;
  inProgressCount = 0;
  doneCount = 0;
  highPriority = 0;
  mediumPriority = 0;
  lowPriority = 0;
  boardStats: any[] = [];

  constructor(
    private boardService: BoardService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards = boards;
        this.totalBoards = boards.length;
        let pending = boards.length;

        if (boards.length === 0) {
          this.loading = false;
          return;
        }

        boards.forEach(board => {
          let boardTasks: any[] = [];
          this.boardService.getLists(board._id).subscribe({
            next: (lists) => {
              let listPending = lists.length;
              if (lists.length === 0) {
                this.boardStats.push({ title: board.title, total: 0, done: 0, inProgress: 0, todo: 0 });
                pending--;
                if (pending === 0) this.calcStats();
                return;
              }
              lists.forEach(list => {
                this.taskService.getTasks(list._id).subscribe({
                  next: (tasks) => {
                    boardTasks = [...boardTasks, ...tasks];
                    this.allTasks = [...this.allTasks, ...tasks];
                    listPending--;
                    if (listPending === 0) {
                      this.boardStats.push({
                        title: board.title,
                        total: boardTasks.length,
                        done: boardTasks.filter(t => t.status === 'done').length,
                        inProgress: boardTasks.filter(t => t.status === 'in-progress').length,
                        todo: boardTasks.filter(t => t.status === 'todo').length
                      });
                      pending--;
                      if (pending === 0) this.calcStats();
                    }
                  }
                });
              });
            }
          });
        });
      }
    });
  }

  calcStats() {
    this.totalTasks = this.allTasks.length;
    this.todoCount = this.allTasks.filter(t => t.status === 'todo').length;
    this.inProgressCount = this.allTasks.filter(t => t.status === 'in-progress').length;
    this.doneCount = this.allTasks.filter(t => t.status === 'done').length;
    this.highPriority = this.allTasks.filter(t => t.priority === 'high').length;
    this.mediumPriority = this.allTasks.filter(t => t.priority === 'medium').length;
    this.lowPriority = this.allTasks.filter(t => t.priority === 'low').length;
    this.loading = false;
  }

  getPercent(count: number): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((count / this.totalTasks) * 100);
  }

  getBoardPercent(done: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }
}
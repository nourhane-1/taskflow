import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardService } from '../../boards/board.service';
import { TaskService } from '../../tasks/task.service';
import { TaskModalComponent } from '../../tasks/task-modal/task-modal.component';
import { NotificationService } from '../../core/notification.service';
import { TaskStateService } from '../../core/task-state.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
@Component({
  selector: 'app-board-detail',
  standalone: true,
imports: [CommonModule, FormsModule, TaskModalComponent, RouterLink, DragDropModule],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.scss', 

animations: [
  trigger('cardAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(15px)', height: '0px', marginBottom: '0px', padding: '0px' }),
      animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
        style({ opacity: 1, transform: 'translateY(0)', height: '*', marginBottom: '8px', padding: '*' }))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'scale(1)', height: '*' }),
      animate('200ms ease-in', 
        style({ opacity: 0, transform: 'scale(0.9)', height: '0px', marginBottom: '0px', padding: '0px' }))
    ])
  ]),
  trigger('listAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      animate('500ms 100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ])
]
})
export class BoardDetailComponent implements OnInit {
  board: any = null;
  lists: any[] = [];
  tasks: { [listId: string]: any[] } = {};
  loading = true;
  showListForm = false;
  newListTitle = '';
  newTaskTitle: { [listId: string]: string } = {};
  showTaskForm: { [listId: string]: boolean } = {};
selectedTask: any = null;
selectedListId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private taskService: TaskService,
   private notificationService: NotificationService,
  private taskStateService: TaskStateService
  ) {}

 ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) this.loadBoard(id);

  this.taskStateService.openTaskId$.subscribe(taskId => {
    if (!taskId) return;
    const found = this.tryOpenTask(taskId);
    if (!found) {
      setTimeout(() => {
        this.tryOpenTask(taskId);
        this.taskStateService.clear();
      }, 1000);
    } else {
      this.taskStateService.clear();
    }
  });
}
tryOpenTask(taskId: string): boolean {
  for (const listId in this.tasks) {
    const task = this.tasks[listId]?.find((t: any) => t._id === taskId);
    if (task) {
      this.openTask(task, listId);
      return true;
    }
  }
  return false;
}
getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
}
  loadBoard(id: string) {
    this.boardService.getBoard(id).subscribe({
      next: (board) => {
        this.board = board;
        this.loadLists(id);
      }
    });
  }

 loadLists(boardId: string) {
  this.boardService.getLists(boardId).subscribe({
    next: (lists) => {
      this.lists = lists;
      this.loading = false;
      lists.forEach(list => this.loadTasks(list._id));

      setTimeout(() => {
        const state = history.state;
        if (state?.openTaskId) {
          for (const listId in this.tasks) {
            const task = this.tasks[listId]?.find((t: any) => t._id === state.openTaskId);
            if (task) {
              this.openTask(task, listId);
              break;
            }
          }
        }
      }, 800);
    }
  });
}

  loadTasks(listId: string) {
    this.taskService.getTasks(listId).subscribe({
      next: (tasks) => this.tasks[listId] = tasks
    });
  }

 createList() {
  if (!this.newListTitle.trim()) return;
  this.boardService.createList(this.board._id, { title: this.newListTitle }).subscribe({
    next: (list) => {
      this.lists.push(list);
      this.tasks[list._id] = [];
      this.newListTitle = '';
      this.showListForm = false;
      this.notificationService.add(`List "${list.title}" created`,'success');
    }
  });
}

  deleteList(listId: string) {
 
  this.boardService.deleteList(this.board._id, listId).subscribe({
    next: () => {
   
      this.lists = this.lists.filter(l => l._id !== listId);
      
    
      const updatedTasks = { ...this.tasks };
      delete updatedTasks[listId];
      this.tasks = updatedTasks;

      this.notificationService.add('List deleted successfully', 'success');
    },
    error: (err) => {
      console.error('Delete error:', err);
      this.notificationService.add('Failed to delete list', 'warning');
    }
  });
}

 createTask(listId: string) {
  const title = this.newTaskTitle[listId];
  if (!title?.trim()) return;
  this.taskService.createTask(listId, { title }).subscribe({
    next: (task) => {
      this.tasks[listId] = [...(this.tasks[listId] || []), task];
      this.newTaskTitle[listId] = '';
      this.showTaskForm[listId] = false;
      this.notificationService.add(`Task "${task.title}" created`, 'success');
    }
  });
}

 deleteTask(event: Event, listId: string, taskId: string) {
  event.stopPropagation(); 

  
  this.taskService.deleteTask(taskId).subscribe({
    next: () => {
      this.tasks[listId] = this.tasks[listId].filter(t => t._id !== taskId);
      this.notificationService.add('Task deleted', 'success');
    },
    error: (err) => {
      console.error(err);
      this.notificationService.add('Delete failed', 'warning');
    }
  });
}
  updateStatus(listId: string, taskId: string, status: string) {
    this.taskService.updateStatus(taskId, status).subscribe({
      next: (updated) => {
        const idx = this.tasks[listId].findIndex(t => t._id === taskId);
        if (idx !== -1) this.tasks[listId][idx] = updated;
      }
    });
  }
openTask(task: any, listId: string) {
  this.selectedTask = task;
  this.selectedListId = listId;
}

onTaskUpdated(updated: any) {
  const listTasks = this.tasks[this.selectedListId];
  const idx = listTasks.findIndex((t: any) => t._id === updated._id);
  if (idx !== -1) listTasks[idx] = updated;
  this.selectedTask = updated;
}
closeModal() {
  this.selectedTask = null;
  this.selectedListId = '';
}
drop(event: CdkDragDrop<any[]>, targetListId: string) {
  if (event.previousContainer === event.container) {
    const items = [...this.tasks[targetListId]];
    const [moved] = items.splice(event.previousIndex, 1);
    items.splice(event.currentIndex, 0, moved);
    this.tasks[targetListId] = items;
  } else {
    const sourceListId = event.previousContainer.id;
    const sourceItems = [...this.tasks[sourceListId]];
    const [moved] = sourceItems.splice(event.previousIndex, 1);
    this.tasks[sourceListId] = sourceItems;

    const targetItems = [...(this.tasks[targetListId] || [])];
    targetItems.splice(event.currentIndex, 0, moved);
    this.tasks[targetListId] = targetItems;

    this.taskService.moveTask(moved._id, targetListId).subscribe({
      next: () => {
        this.notificationService.add(`Task moved to ${this.lists.find(l => l._id === targetListId)?.title}`, 'success');
      },
      error: () => {
        const revert = [...this.tasks[targetListId]];
        const [reverted] = revert.splice(event.currentIndex, 1);
        this.tasks[targetListId] = revert;
        const source = [...this.tasks[sourceListId]];
        source.splice(event.previousIndex, 0, reverted);
        this.tasks[sourceListId] = source;
      }
    });
  }
}

getListIds(): string[] {
  return this.lists.map(l => l._id);
}
  goBack() {
    this.router.navigate(['/boards']);
  }

}
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task/task-service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { TEXTSCOMMAN } from '../../../constants/text-common';
import { TEXTSTASK } from '../../../constants/text-task';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-view',
  imports: [RouterLink,DatePipe],
  templateUrl: './task-view.html',
  styleUrl: './task-view.css',
})
export class TaskView implements OnInit {
   textComman = TEXTSCOMMAN;
    textTask = TEXTSTASK;
  loading = signal(false);
  private snackBar = inject(MatSnackBar);

  private route = inject(ActivatedRoute);
  taskService = inject(TaskService);
  dialog = inject(MatDialog);

  projectId = signal<number>(0);

  filter = signal<'all' | 'active' | 'completed'>('all');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectId.set(id);

    this.taskService.loadTasksByProject(id);
  }

  filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();

    switch (this.filter()) {
      case 'active':
        return tasks.filter(t => !t.completed);

      case 'completed':
        return tasks.filter(t => t.completed);

      default:
        return tasks;
    }
  });

  setFilter(value: 'all' | 'active' | 'completed') {
    this.filter.set(value);
  }

  toggleStatus(task: any) {
  this.taskService.toggleTaskStatus(task).subscribe({
    next: () => {

      this.taskService.tasksSignal.update(tasks =>
        tasks.map(t =>
          t.id === task.id
            ? { ...t, completed: !t.completed }
            : t
        )
      );

      const message = task.completed
        ? 'Task marked as Active 🔄'
        : 'Task marked as Completed ✅';

      this.snackBar.open(message, 'Close', {
        duration: 2500,
        panelClass: ['snackbar-success']
      });
    },

    error: () => {
      this.snackBar.open('Failed to update status ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
}

  deleteTask(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialog);

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    this.loading.set(true);

    this.taskService.deleteTask(id).subscribe({
      next: () => {

        this.taskService.tasksSignal.update(tasks =>
          tasks.filter(t => t.id !== id)
        );

        this.snackBar.open('Task deleted successfully 🗑️', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.loading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.snackBar.open('Failed to delete task ❌', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.loading.set(false);
      }
    });
  });
}

}
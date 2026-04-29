import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task/task-service';
import { TEXTSCOMMAN } from '../../../constants/text-common';
import { TEXTSTASK } from '../../../constants/text-task';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnInit  {
  textComman = TEXTSCOMMAN;
  textTask = TEXTSTASK;
private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  // 🔹 جلب projectId من الرابط
  // projectId = Number(this.route.snapshot.paramMap.get('id'));
projectId = signal<number>(0);
ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('projectId'));
    this.projectId.set(id);
  }
  // 🔹 Form
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]]
  });

  // 🚀 Submit
  onSubmit() {
    console.log(this.projectId())
    if (this.taskForm.invalid) return;

    const { title, description } = this.taskForm.value;

    this.taskService.addTask(
      title!,
      description!,
      this.projectId()
    ).subscribe({
    next: () => {

      this.snackBar.open('Task added successfully ✅', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

      // this.loading.set(false);
       this.router.navigate(['/task', this.projectId()]);
    },

    error: () => {
      // this.loading.set(false);

      this.snackBar.open('Something went wrong ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
  }
}
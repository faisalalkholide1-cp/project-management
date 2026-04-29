import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project/project-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-project',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProject implements OnInit {
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);

  projectId = signal<number>(0);
  loading = signal<boolean>(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]]
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.router.navigate(['/']);
      return;
    }

    this.projectId.set(id);
    this.loadProject(id);
  }

  loadProject(id: number) {
    this.loading.set(true);

    this.projectService.getProjectById(id).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          name: res.name,
          description: res.description
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
  if (this.form.invalid) return;

  this.loading.set(true);

  const { name, description } = this.form.value;

  this.projectService.updateProject(
    this.projectId(),
    name!,
    description!
  ).subscribe({
    next: () => {

      this.snackBar.open('Project updated successfully ✅', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

      this.loading.set(false);
      this.router.navigate(['/']);
    },

    error: () => {
      this.loading.set(false);

      this.snackBar.open('Something went wrong ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
}
}
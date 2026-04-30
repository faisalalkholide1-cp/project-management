import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project/project-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TEXTSPROJECT } from '../../../constants/texts-project';
import { TEXTSCOMMAN } from '../../../constants/text-common';

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
  textProject = TEXTSPROJECT;
  textComman = TEXTSCOMMAN;

  projectId = signal<number>(0);

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

  this.projectService.getProjectById(id).subscribe({
    next: (project) => {

      this.form.patchValue({
        name: project.name,
        description: project.description
      });

    },
    error: () => {
      this.router.navigate(['/']);
    }
  });

}

  onSubmit() {
  if (this.form.invalid) return;

  const { name, description } = this.form.value;

  this.projectService.updateProject(
    this.projectId(),
    name!,
    description!
  ).subscribe({
    next: (res) => {

      if (res.status === 'success') {

        this.snackBar.open('Project updated successfully ✅', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/']);

      } else {

        this.snackBar.open('Update failed ❌', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

      }
    },

    error: () => {

      this.snackBar.open('Something went wrong ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });

    }
  });
}
}
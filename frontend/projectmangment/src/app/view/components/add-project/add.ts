import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ProjectService } from '../../../services/project/project-service';
import { TEXTSCOMMAN } from '../../../constants/text-common';
import { TEXTSPROJECT } from '../../../constants/texts-project';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './add.html',
  styleUrl: './add.css',
})
export class Add {
  private snackBar = inject(MatSnackBar);
  textComman = TEXTSCOMMAN;
  textProject = TEXTSPROJECT
  private router = inject(Router);
private fb = inject(FormBuilder);
private projectService = inject(ProjectService);
  projectForm = this.fb.nonNullable.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  description: ['', [Validators.required]],
});

onSubmit() {
  if (this.projectForm.invalid) return;

  const { name, description } = this.projectForm.value;

  if (!name || !description) return;
  if(this.projectForm.invalid) this.router;


  this.projectService.addProject(name, description).subscribe({
    next: () => {

      this.snackBar.open('Project added successfully ✅', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });


      this.projectForm.reset();
      this.router.navigate(['/']);

    },

    error: () => {
      this.snackBar.open('Failed to add project ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
}
}

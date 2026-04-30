import { Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../../services/project/project-service';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { TEXTSPROJECT } from '../../../constants/texts-project';
import { TEXTSCOMMAN } from '../../../constants/text-common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-project',
  imports: [RouterLink,RouterLinkWithHref],
  templateUrl: './home-project.html',
  styleUrl: './home-project.css',
})
export class HomeProject {
  textProject = TEXTSPROJECT;
  textComman = TEXTSCOMMAN;

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  projectService = inject(ProjectService);
  
  dialog = inject(MatDialog);
  projects = computed(() => {
  return this.projectService.project();
    }
  );
  ngOnInit() {
    this.projectService.loadProject(); 
  }


  deleteProject(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialog);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      this.projectService.deleteProject(id).subscribe({
    next: () => {

      this.snackBar.open('Project deleted successfully 🗑️', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

      this.projectService.loadProject();
      this.router.navigate(['/']);
    },

    error: () => {
      this.snackBar.open('Failed to delete project ❌', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  });
    }
  });
}


}

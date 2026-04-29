import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProjectModel } from '../../models/project-model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
    private http = inject(HttpClient);
    private api = 'http://localhost:81/api/projects/';

    projectSignal = signal<ProjectModel[]>([]);
    project = this.projectSignal.asReadonly();

  

    loadProject() {
    this.http.get<any[]>(this.api + 'get_projects.php')
      .subscribe(data => {

        const projects = data.map(item => ({
          id: Number(item.id),
          name: item.name,
          description: item.description,
          createdAt: new Date(item.created_at)
        }));

        this.projectSignal.set(projects);

      });
  }

    //  إضافة مشروع
  addProject(name: string, description: string) {
    return this.http.post(this.api + 'add_project.php', {
      name,
      description
    });
  }

    //  حذف مشروع
    deleteTask(id: number) {
      return this.http.delete(this.api + 'delete_project.php?id=' + id)

    }
    getProjectById(id: number) {
      return this.http.get<any>(this.api + `get_project_id.php?id=${id}`);
    }

    updateProject(id: number, name: string, description: string) {
      return this.http.post(this.api + 'update_project.php', {
        id,
        name,
        description
      });
    }


}

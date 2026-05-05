import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProjectModel } from '../../models/project-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
    private http = inject(HttpClient);
    private api = 'http://localhost:81/api_angular/projects/projects.php';

    projectSignal = signal<ProjectModel[]>([]);
    project = this.projectSignal.asReadonly();

  

    loadProject() {
      this.http.get<{ status: string; data: any[] }>(this.api)
        .subscribe(res => {

          if (res.status !== 'success') return;

          const projects = res.data.map(item => ({
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
    return this.http.post<{ status: string }>(this.api, {
      name,
      description
    });
  }

    //  حذف مشروع
    deleteProject(id: number) {
      return this.http.delete<{ status: string }>(`${this.api}?id=${id}`);
    }

getProjectById(id: number) {
  return this.http.get<{ status: string; data: any }>(
    `${this.api}?id=${id}`
  ).pipe(
    map(res => {

      if (res.status !== 'success' || !res.data) {
        throw new Error('Project not found');
      }

      return {
        id: Number(res.data.id),
        name: res.data.name,
        description: res.data.description,
        createdAt: new Date(res.data.created_at)
      };

    })
  );
}

    updateProject(id: number, name: string, description: string) {
  return this.http.put<{ status: string }>(this.api, {
    id,
    name,
    description
  });
}


}

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskModel } from '../../models/task-model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private http = inject(HttpClient);
    private api = 'http://localhost:81/api_angular/task/tasks.php';

    tasksSignal = signal<TaskModel[]>([]);
    tasks = this.tasksSignal.asReadonly();

    completedTasks = computed(() =>
      this.tasksSignal().filter(task => task.completed)
    );

    activeTasks = computed(() =>
      this.tasksSignal().filter(task => !task.completed)
    );

    loadTasksByProject(projectId: number) {
      this.http.get<{ status: string; data: any[] }>(
        `${this.api}?project_id=${projectId}`
      ).subscribe(res => {

        if (res.status !== 'success') return;

        const tasks = res.data.map(item => ({
          id: Number(item.id),
          projectId: Number(item.project_id),
          title: item.title,
          description: item.description,
          completed: Boolean(item.completed),
          createdAt: new Date(item.created_at)
        }));

        this.tasksSignal.set(tasks);
      });
    }

    //  إضافة مهمة
    addTask(title: string, description: string, projectId: number) {
      return this.http.post<{ status: string }>(this.api, {
        title,
        description,
        project_id: projectId
      });
    }

    //  حذف مهمة
    deleteTask(id: number) {
      return this.http.delete<{ status: string }>(
        `${this.api}?id=${id}`
      );
    }



    //  تغيير حالة المهمة
    toggleTaskStatus(task: any) {
      return this.http.put<{ status: string }>(this.api, {
        id: task.id,
        completed: task.completed ? 0 : 1
      });
    }

    //  جلب مهمة واحدة
    getTask(id: number) {
      return this.tasksSignal().find(task => task.id === id);
    }

    totalTasks = computed(() =>
      this.tasksSignal().length
    );

    completedTasksCount = computed(() =>
      this.tasksSignal().filter(t => t.completed).length
    );

    activeTasksCount = computed(() =>
      this.tasksSignal().filter(t => !t.completed).length
    );

    
}

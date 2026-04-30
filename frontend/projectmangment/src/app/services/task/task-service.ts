import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskModel } from '../../models/task-model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private http = inject(HttpClient);
    private api = 'http://localhost:81/api/task/';

    tasksSignal = signal<TaskModel[]>([]);
    tasks = this.tasksSignal.asReadonly();

    completedTasks = computed(() =>
      this.tasksSignal().filter(task => task.completed)
    );

    activeTasks = computed(() =>
      this.tasksSignal().filter(task => !task.completed)
    );

    loadTasksByProject(projectId: number) {
    this.http.get<any[]>(`${this.api}get_tasks.php?project_id=${projectId}`)
      .subscribe(data => {

        const tasks = data.map(item => ({
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
    return this.http.post(this.api + 'add_task.php', {
      title,
      description,
      project_id: projectId
    });
  }

    //  حذف مهمة
      deleteTask(id: number) {
    return this.http.get(this.api + `delete_task.php?id=${id}`);
  }



    //  تغيير حالة المهمة
  toggleTaskStatus(task: any) {
    return this.http.post(this.api + 'update_task.php', {
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

export interface TaskModel {
  id: number;
  projectId: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

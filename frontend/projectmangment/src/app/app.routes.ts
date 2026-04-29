import { Routes } from '@angular/router';
import { HomeProject } from './view/project/home-project/home-project';
import { Add } from './view/components/add-project/add';
import { TaskView } from './view/task/task-view/task-view';
import { AddTask } from './view/components/add-task/add-task';
import { EditProject } from './view/components/edit-project/edit-project';

export const routes: Routes = [
    {
        path:"",
        component:HomeProject
    },
    {
        path:"add",
        component: Add
    },
    {
        path:"task/:id",
        component: TaskView
    },
    { path: 'add-task/:projectId', component: AddTask },
    { path: 'edit-project/:id', component: EditProject }
];

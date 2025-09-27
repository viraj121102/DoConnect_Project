import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component/login.component';
import { RegisterComponent } from './features/auth/register.component/register.component';
import { Questions } from './features/questions/questions/questions';
import { QuestionDetail } from './features/questions/question-detail/question-detail';
import { AskQuestion } from './features/questions/ask-question/ask-question';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayout } from './layout/main.layout/main.layout';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  //{ path: 'questions', component: Questions },
 {
    path: '',
    component: MainLayout,
    children: [
      { path: 'questions', component: Questions },
      {
        path: 'questions/ask',
        component: AskQuestion,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['User', 'Admin'] }
      },
      { path: 'questions/:id', component: QuestionDetail },
      {
        path: 'admin',
        component: AdminDashboard,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Admin'] }
      }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

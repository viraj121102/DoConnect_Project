import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './features/auth/login.component/login.component';
import { RegisterComponent } from './features/auth/register.component/register.component';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { Questions } from './features/questions/questions/questions';
import { AskQuestion } from './features/questions/ask-question/ask-question';
import { QuestionDetail } from './features/questions/question-detail/question-detail';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { MainLayout } from './layout/main.layout/main.layout';
import { UserNavbar } from './shared/user-navbar/user-navbar';
import { AdminNavbar } from './shared/admin-navbar/admin-navbar';
import { Footer } from './shared/footer/footer';
import { Search } from './features/search/search';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    Questions,
    AskQuestion,
    QuestionDetail,
    AdminDashboard,
    MainLayout,
    UserNavbar,
    AdminNavbar,
    Footer,
    Search,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }

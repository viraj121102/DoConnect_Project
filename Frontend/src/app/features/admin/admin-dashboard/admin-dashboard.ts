import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { AnswerService } from '../../../core/services/answer.service';
import { AdminService } from '../../../core/services/admin.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit{
pendingQ: any[] = [];
  pendingA: any[] = [];

  constructor(private qs: QuestionService, private as: AnswerService) {}

  ngOnInit() {
    this.load();
  }
load() {
    // ✅ Load pending questions
    this.qs.listPending().subscribe({
      next: (res: any) => (this.pendingQ = res),
      error: (err) => console.error('Error loading pending questions', err)
    });

    // ✅ Load pending answers
    this.as.listPending().subscribe({
      next: (res: any) => (this.pendingA = res),
      error: (err) => console.error('Error loading pending answers', err)
    });
  }

  // ===== Questions =====
  approveQ(id: number) {
    this.qs.approve(id).subscribe({
      next: () => {
        // ✅ turant remove from list
        this.pendingQ = this.pendingQ.filter(q => q.questionId !== id);
      },
      error: (err) => console.error('Error approving question', err)
    });
  }

  rejectQ(id: number) {
    this.qs.reject(id).subscribe({
      next: () => {
        this.pendingQ = this.pendingQ.filter(q => q.questionId !== id);
      },
      error: (err) => console.error('Error rejecting question', err)
    });
  }

  // ===== Answers =====
  approveA(id: number) {
    this.as.approve(id).subscribe({
      next: () => {
        this.pendingA = this.pendingA.filter(a => a.answerId !== id);
      },
      error: (err) => console.error('Error approving answer', err)
    });
  }

  rejectA(id: number) {
    this.as.reject(id).subscribe({
      next: () => {
        this.pendingA = this.pendingA.filter(a => a.answerId !== id);
      },
      error: (err) => console.error('Error rejecting answer', err)
    });
  }
deleteQ(id: number) {
  if (confirm("Are you sure you want to delete this Question?")) {
    this.qs.deleteAsAdmin(id).subscribe(() => this.load());
  }
}


deleteA(id: number) {
  if (confirm("Are you sure you want to delete this Answer?")) {
    this.as.deleteAsAdmin(id).subscribe(() => this.load());
  }
}


}
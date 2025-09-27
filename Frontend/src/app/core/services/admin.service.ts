import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
   constructor(private http: HttpClient) {}

  getPendingQuestions() {
    return this.http.get(`${environment.apiBase}/questions/pending`);
  }

  approveQuestion(id: number) {
    return this.http.put(`${environment.apiBase}/questions/${id}/approve`, {});
  }

  rejectQuestion(id: number) {
    return this.http.put(`${environment.apiBase}/questions/${id}/reject`, {});
  }
}

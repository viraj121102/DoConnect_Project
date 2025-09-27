import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CreateAnswer, AnswerListItem } from '../models/answer.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  base = `${environment.apiBase}/api/answers`;

  constructor(private http: HttpClient) {}

  listByQuestion(qid:number): Observable<AnswerListItem[]> {
    return this.http.get<AnswerListItem[]>(`${this.base}/question/${qid}`);
  }

 create(payload: { questionId: number; answerText: string }) {
  return this.http.post(`${this.base}`, payload);
}


  listPending() {
    return this.http.get<any[]>(`${this.base}/pending`);
  }

  approve(id:number) {
    return this.http.put(`${this.base}/${id}/approve`, {});
  }

  reject(id:number) {
    return this.http.put(`${this.base}/${id}/reject`, {});
  }
 // For user delete (self)
delete(id: number) {
  return this.http.delete(`${this.base}/${id}`);
}

// For admin delete
deleteAsAdmin(id: number) {
  return this.http.delete(`${this.base}/${id}/admin`);
}
update(id: number, payload: { answerText: string }) {
  return this.http.put(`${this.base}/${id}`, payload);
}

}

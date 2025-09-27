import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CreateQuestion, QuestionDetail, QuestionListItem } from '../models/question.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  base = `${environment.apiBase}/api/questions`;

  constructor(private http: HttpClient) {}

  list(): Observable<QuestionListItem[]> {
    return this.http.get<QuestionListItem[]>(this.base);
  }

  get(id:number): Observable<QuestionDetail> {
    return this.http.get<QuestionDetail>(`${this.base}/${id}`);
  }

  create(payload: CreateQuestion) {
    return this.http.post(this.base, payload);
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
 // User delete (self)
delete(id: number) {
  return this.http.delete(`${this.base}/${id}`);
}

// Admin delete
deleteAsAdmin(id: number) {
  return this.http.delete(`${this.base}/${id}/admin`);
}
search(query: string) {
  return this.http.get(`${environment.apiBase}/api/Questions/search?query=${query}`);
}


}

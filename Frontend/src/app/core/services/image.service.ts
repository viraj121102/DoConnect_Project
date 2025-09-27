import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  base = `${environment.apiBase}/api/images`;

  constructor(private http: HttpClient) {}

  uploadForQuestion(qid:number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.base}/upload/question/${qid}`, fd);
  }

  uploadForAnswer(aid:number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.base}/upload/answer/${aid}`, fd);
  }
}

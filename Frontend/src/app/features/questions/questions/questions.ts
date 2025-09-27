import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';


@Component({
  selector: 'app-questions',
  standalone: false,
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions implements OnInit{
items: any[] = [];
fileBase = environment.fileBase;  
  constructor(
    private qs: QuestionService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.qs.list().subscribe(r => (this.items = r));
  }

  open(id: number) {
    this.router.navigate(['/questions', id]);
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-ask-question',
  standalone: false,
  templateUrl: './ask-question.html',
  styleUrl: './ask-question.css'
})
export class AskQuestion {
  title = '';
  text = '';
  file?: File;

  constructor(
    private qs: QuestionService,
    private img: ImageService,
    private router: Router
  ) {}

  onFileSelected(e: any) {
    this.file = e.target.files[0];
  }

  submit() {
    if (!this.title.trim() || !this.text.trim()) {
      alert('Please enter title and description');
      return;
    }

    this.qs.create({ questionTitle: this.title, questionText: this.text })
      .subscribe((res: any) => {
        alert('Question submitted for approval');
        
    
        if (this.file) {
          this.img.uploadForQuestion(res.questionId, this.file).subscribe(() => {
            console.log('Image uploaded');
            this.router.navigate(['/questions']);
          });
        } else {
          this.router.navigate(['/questions']);
        }
      });
  }
}

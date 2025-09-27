import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { AnswerService } from '../../../core/services/answer.service';
import { ImageService } from '../../../core/services/image.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-question-detail',
  standalone: false,
  templateUrl: './question-detail.html',
  styleUrl: './question-detail.css'
})
export class QuestionDetail implements OnInit {
  qid!: number;
  detail: any;
  answerText = '';
  qfile?: File;
  afile?: File;
  fileBase = environment.fileBase;
    // Edit state
  editingQ = false;
  editQTitle = '';
  editQText = '';

  editingA: number | null = null; // store answerId being edited
  editAText = '';


  // Lightbox state
  lightboxOpen = false;
  lightboxImages: string[] = [];
  currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService,
    private ans: AnswerService,
    private img: ImageService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.qid = +idParam;
      this.load();
    }
  }

  load() {
    this.qs.get(this.qid).subscribe(r => (this.detail = r));
  }

  postAnswer() {
    if (!this.answerText.trim()) return;

    this.ans.create({ questionId: this.qid, answerText: this.answerText })
      .subscribe(() => {
        this.answerText = '';
        this.load();
      });
       alert('Answer submitted for approval');
  }

  onQFile(e: any) { this.qfile = e.target.files[0]; }
  onAFile(e: any) { this.afile = e.target.files[0]; }

  uploadQ() {
    if (!this.qfile) return;
    this.img.uploadForQuestion(this.qid, this.qfile).subscribe(() => this.load());
  }

  uploadA(aid: number) {
    if (!this.afile) return;
    this.img.uploadForAnswer(aid, this.afile).subscribe(() => this.load());
  }

  // Helpers for image URLs
  getQuestionImageUrls(): string[] {
    return this.detail?.questionImages?.map((x: any) => this.fileBase + x.path) || [];
  }

  getAnswerImageUrls(answer: any): string[] {
    return answer?.answerImages?.map((x: any) => this.fileBase + x.path) || [];
  }

  //  Lightbox methods
  openGallery(imgs: string[], index: number) {
    this.lightboxImages = imgs;
    this.currentIndex = index;
    this.lightboxOpen = true;
  }

  closeGallery() { this.lightboxOpen = false; }

  prevImage() {
    if (this.currentIndex > 0) this.currentIndex--;
    else this.currentIndex = this.lightboxImages.length - 1;
  }

  nextImage() {
    if (this.currentIndex < this.lightboxImages.length - 1) this.currentIndex++;
    else this.currentIndex = 0;
  }

  handleKey(event: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (event.key === 'Escape') this.closeGallery();
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
  }
  
}

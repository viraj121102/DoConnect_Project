import { Component ,OnInit} from '@angular/core';
import { QuestionService } from '../../core/services/question.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
 query = '';
  results: any[] = [];

  constructor(private route: ActivatedRoute, private qs: QuestionService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.qs.search(this.query).subscribe((res: any) => {
          this.results = res;
        });
      }
    });
  }
}

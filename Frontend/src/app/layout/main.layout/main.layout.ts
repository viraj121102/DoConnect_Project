import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { QuestionService } from '../../core/services/question.service';

@Component({
  selector: 'app-main.layout',
  standalone: false,
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.css'
})
export class MainLayout {
    role: string | null = null;
  menuOpen = false;
  
 searchText: string = '';
  searchResults: any[] = []; 
  constructor(public auth: AuthService, private qs: QuestionService) {}

 ngOnInit(): void {
    this.role = this.auth.getRole(); // AuthService se role
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
  }

   onSearch(event: Event) {
    event.preventDefault();
    if (this.searchText.trim()) {
      this.qs.search(this.searchText).subscribe((res: any) => {
        this.searchResults = res;
        console.log(res);
        
      });
    }
    
  }
  
}

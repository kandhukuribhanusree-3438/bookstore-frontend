import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedCategory: string = 'All';
  categories: string[] = [
    'All',
    'Tutorials',
    'Programming Languages',
    'DSA',
    'Web Technology',
    'AI, ML & Data Science',
    'DevOps',
    'CS Core Subjects',
    'GATE',
    'School Subjects',
    'Software & Tools (Beginner)'
  ];
  searchTerm: string = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
        this.filteredBooks = books;
      },
      error: (error: any) => console.error('Error loading books:', error)
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredBooks = this.books.filter(book => {
      const matchesCategory = this.selectedCategory === 'All' || book.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm.trim() ||
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  scrollToOrder(book: Book) {
    // Navigate to order route with book name as query param
    this.router.navigate(['/order'], { 
      queryParams: { book: book.title }
    });
    
    // Dispatch event for auto-fill after navigation
    setTimeout(() => {
      const event = new CustomEvent('bookSelected', { detail: book });
      window.dispatchEvent(event);
      
      // Scroll to order section after component loads
      setTimeout(() => {
        const orderSection = document.getElementById('order-section');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 200);
  }
}



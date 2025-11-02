import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];

  constructor(
    private router: Router,
    private bookService: BookService
  ) {
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

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
  }

  navigateToSection(path: string) {
    this.router.navigate([path]);
  }

  scrollToOrder(bookName?: string) {
    this.router.navigate(['/order'], { 
      queryParams: bookName ? { book: bookName } : {}
    });
    setTimeout(() => {
      const orderSection = document.getElementById('order-section');
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}

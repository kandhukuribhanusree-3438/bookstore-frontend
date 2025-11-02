import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { Book } from '../../models/book.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm: Order = {
    name: '',
    email: '',
    phone: '',
    bookName: '',
    quantity: 1,
    address: '',
    totalPrice: 0
  };

  books: Book[] = [];
  selectedBook: Book | null = null;
  isLoading = false;
  orderSubmitted = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadBooks();
    
    // Check for book name in query params
    this.route.queryParams.subscribe(params => {
      if (params['book']) {
        this.orderForm.bookName = params['book'];
        this.findBookAndSetPrice();
      }
    });

    // Listen for book selection from home component
    window.addEventListener('bookSelected', ((event: CustomEvent) => {
      const book = event.detail as Book;
      this.orderForm.bookName = book.title;
      this.selectedBook = book;
      this.calculateTotalPrice();
    }) as EventListener);
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
        if (this.orderForm.bookName) {
          this.findBookAndSetPrice();
        }
      },
      error: (error: any) => console.error('Error loading books:', error)
    });
  }

  findBookAndSetPrice() {
    const book = this.books.find(b => b.title === this.orderForm.bookName);
    if (book) {
      this.selectedBook = book;
      this.calculateTotalPrice();
    }
  }

  onBookNameChange() {
    this.findBookAndSetPrice();
  }

  calculateTotalPrice() {
    if (this.selectedBook && this.orderForm.quantity > 0) {
      this.orderForm.totalPrice = this.selectedBook.price * this.orderForm.quantity;
    } else {
      this.orderForm.totalPrice = 0;
    }
  }

  onQuantityChange() {
    if (this.orderForm.quantity < 1) {
      this.orderForm.quantity = 1;
    }
    this.calculateTotalPrice();
  }

  onSubmit() {
    // Validation
    if (!this.orderForm.name || !this.orderForm.email || !this.orderForm.phone ||
        !this.orderForm.bookName || !this.orderForm.address) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.orderForm.quantity < 1) {
      this.errorMessage = 'Quantity must be at least 1.';
      return;
    }

    if (!this.isValidEmail(this.orderForm.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.createOrder(this.orderForm).subscribe({
      next: (order: Order) => {
        this.orderSubmitted = true;
        this.isLoading = false;
        // Reset form
        setTimeout(() => {
          this.orderForm = {
            name: '',
            email: '',
            phone: '',
            bookName: '',
            quantity: 1,
            address: '',
            totalPrice: 0
          };
          this.selectedBook = null;
          this.orderSubmitted = false;
        }, 5000);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Failed to place order. Please try again.';
        this.isLoading = false;
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

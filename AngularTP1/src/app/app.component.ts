import { Component } from '@angular/core';
import { Book } from './shared/models/book';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  books: Book[] = [
    new Book('The Great Gatsby', true),
    new Book('The Presentation of Self in Everyday Life', false),
    new Book('To Kill a Mockingbird', false)
  ];

  onReadStatusChange(book: Book, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    book.isRead = checkbox.checked;
  }
}

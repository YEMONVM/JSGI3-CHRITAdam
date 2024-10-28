import { Status, Format, IBook } from '../models/Book.js';

async function loadBooks() {
    try {
        console.log('Fetching books...');
        const response = await fetch('/api/books');
        const books = await response.json();
        console.log('Received books:', books);
        displayBooks(books);
    } catch (err) {
        console.error('Failed to load books:', err);
    }
}

function displayBooks(books: IBook[]) {
    const booksList = document.getElementById('booksList');
    if (!booksList) return;

    booksList.innerHTML = books.map(book => `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${book.title}</h3>
            <div class="space-y-1 text-gray-600">
                <p><span class="font-medium">Author:</span> ${book.author}</p>
                <p><span class="font-medium">Pages:</span> ${book.pagesRead}/${book.pages}</p>
                <p><span class="font-medium">Status:</span> ${book.status}</p>
                <p><span class="font-medium">Format:</span> ${book.format}</p>
                <p><span class="font-medium">Price:</span> $${book.price.toFixed(2)}</p>
                <p><span class="font-medium">Suggested By:</span> ${book.suggestedBy}</p>
                <div class="mt-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" 
                             style="width: ${(book.pagesRead / book.pages * 100)}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Form submission
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const bookData = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        pages: Number(formData.get('pages')),
        status: formData.get('status') as Status,
        price: Number(formData.get('price')),
        pagesRead: Number(formData.get('pagesRead')),
        format: formData.get('format') as Format,
        suggestedBy: formData.get('suggestedBy') as string,
        finished: false
    };

    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        form.reset();
        await loadBooks();
    } catch (err) {
        console.error('Failed to add book:', err);
    }
});

// Load books when page loads
loadBooks();

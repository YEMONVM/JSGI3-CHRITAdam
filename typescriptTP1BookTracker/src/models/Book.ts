import { ObjectId } from "mongodb";

export enum Status {
    READ = "Read",
    RE_READ = "Re-read",
    DNF = "DNF",
    CURRENTLY_READING = "Currently reading",
    RETURNED_UNREAD = "Returned Unread",
    WANT_TO_READ = "Want to read"
}

export enum Format {
    PRINT = "Print",
    PDF = "PDF",
    EBOOK = "Ebook",
    AUDIOBOOK = "AudioBook"
}

export interface IBook {
    _id?: ObjectId;
    title: string;
    author: string;
    pages: number;
    status: Status;
    price: number;
    pagesRead: number;
    format: Format;
    suggestedBy: string;
    finished: boolean;
}

export class Book implements IBook {
    _id?: ObjectId;
    finished: boolean;

    constructor(
        public title: string,
        public author: string,
        public pages: number,
        public status: Status,
        public price: number,
        public pagesRead: number,
        public format: Format,
        public suggestedBy: string
    ) {
        this.validatePagesRead();
        this.finished = this.pagesRead >= this.pages;
    }

    private validatePagesRead(): void {
        if (this.pagesRead < 0 || this.pagesRead > this.pages) {
            throw new Error("Pages read must be between 0 and total pages");
        }
    }

    updateProgress(pagesRead: number): void {
        this.pagesRead = pagesRead;
        this.validatePagesRead();
        this.finished = this.pagesRead >= this.pages;
        
        // Update status if needed
        if (this.finished && this.status === Status.CURRENTLY_READING) {
            this.status = Status.READ;
        } else if (!this.finished && this.pagesRead > 0) {
            this.status = Status.CURRENTLY_READING;
        }
    }

    toJSON(): IBook {
        return {
            _id: this._id,
            title: this.title,
            author: this.author,
            pages: this.pages,
            status: this.status,
            price: this.price,
            pagesRead: this.pagesRead,
            format: this.format,
            suggestedBy: this.suggestedBy,
            finished: this.finished
        };
    }
}

export default Book;

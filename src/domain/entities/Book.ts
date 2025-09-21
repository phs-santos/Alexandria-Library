export class Book {
    constructor(
        public readonly title: string,
        public readonly author: string,
        public readonly isbn: string,
        public readonly category: string,
        public readonly publisher: string,
        public readonly publicationYear: number,
        public readonly totalQuantity: number,
        public quantityAvailable: number,
        public readonly coverUrl: string
    ) { }

    loan() {
        if (this.quantityAvailable <= 0) {
            throw new Error("Livro indisponível para empréstimo");
        }
        this.quantityAvailable -= 1;
    }

    returnBook() {
        if (this.quantityAvailable < this.totalQuantity) {
            this.quantityAvailable += 1;
        }
    }
}

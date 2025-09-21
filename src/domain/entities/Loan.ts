import { LoanStatus } from "../enums/LoanStatus";

export class Loan {
    constructor(
        public readonly userId: number,
        public readonly bookId: number,
        public readonly loanDate: Date,
        public readonly expectedReturnDate: Date,
        public returnDate: Date | null = null,
        public status: LoanStatus = LoanStatus.Active
    ) { }

    markReturned() {
        if (this.status !== LoanStatus.Active && this.status !== LoanStatus.Late) {
            throw new Error("Esse empréstimo já foi finalizado");
        }
        this.status = LoanStatus.Returned;
        this.returnDate = new Date();
    }

    markLate() {
        if (this.status === LoanStatus.Active) {
            this.status = LoanStatus.Late;
        }
    }

    isOverdue(today: Date = new Date()): boolean {
        return this.status === LoanStatus.Active && this.expectedReturnDate < today;
    }
}

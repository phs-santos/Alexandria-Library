import crypto from "crypto";

export function generateLibraryCard(): string {
    // Gera código tipo: LIB-ABCDE123
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `LIB-${random}`;
}

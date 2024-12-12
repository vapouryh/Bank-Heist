export default class InputCleaner {
    constructor(input) {
        this.input = (input ?? "").toUpperCase().trim();
    }

    getCleanInput() {
        let result = '';
        const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

        for (let i = 0; i < this.input.length; i++) {
            const char = this.input[i].toUpperCase();
            if (allowedChars.includes(char)) {
                result += char;
            } else if (char === ' ' && !result.endsWith(' ')) {
                result += ' ';
            }
        }

        return result.trim();
    }
}
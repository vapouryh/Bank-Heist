import Filler from "./wordClasses.js"

export default class Sentence {
    constructor(cleanInput = "") {
        this.cleanInput = cleanInput;
        this.parseSuccess = false;
        this.unknownWord = "";
        this.word1 = null; // Verb
        this.word2 = null; // Filler
        this.word3 = null; // Filler
        this.word4 = null; // Noun
        this.word5 = null; // Filler
        this.word6 = null; // Filler
        this.word7 = null; // Noun
        this.word4Confident = false;
        this.word7Confident = false;
    }

    get ambiguous() {
        return (
            (this.word4 !== null && !this.word4Confident) || 
            (this.word7 !== null && !this.word7Confident)
        );
    }

    get allWords() {
        return [this.word1, this.word2, this.word3, this.word4, this.word5, this.word6, this.word7]
            .filter(word => word !== null);
    }

    get importantWords() {
        return [
            this.word1,
            this.word2?.isImportant ? this.word2 : null,
            this.word3?.isImportant ? this.word3 : null,
            this.word4,
            this.word5?.isImportant ? this.word5 : null,
            this.word6?.isImportant ? this.word6 : null,
            this.word7
        ].filter(word => word !== null);
    }

    toString() {
        let str = `Input: ${this.cleanInput}\n`;
        str += `Parse success: ${this.parseSuccess}\n`;
        if (this.unknownWord) {
            str += `Unknown word: ${this.unknownWord}\n`;
        }
        str += `Ambiguous: ${this.ambiguous}\n`;

        this.allWords.forEach(w => {
            str += `Word: ${w.getDescription()}\n`;
        })
        
        str += "Important words:\n";
        str += this.importantWords.map(w => w.getDescription()).join(" ");

        return str;
    }
}
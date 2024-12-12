export default class Word {
    constructor(value) {
        this.value = (value ?? "").toUpperCase().trim();
    }

    getValue() {
        return this.value;
    }
    getDescription() {
        throw new Error('getDescription() method must be implemented by subclasses.');
    }
}

export class Verb extends Word {
    constructor(value) {
        super(value);
    }

    getDescription() {
        return `[Verb] ${this.value}`;
    }
}

export class Noun extends Word {
    constructor(value, precedingAdjective = null) {
        super(value);
        this.precedingAdjective = precedingAdjective;
        this.confident = false;
    }

    getFullString() {
        return `${(this.precedingAdjective ? this.precedingAdjective.value : "")} ${this.value}`.trim();
    }

    getDescription() {
        return this.precedingAdjective === null
            ? `[Noun] ${this.value} (${this.confString})`
            : `[Adj/Noun] ${this.precedingAdjective.value} ${this.value} (${this.confString})`;
    }

    get confString() {
        return this.confident ? "Confident" : "Ambiguous";
    }
}

export class Filler extends Word {
    constructor(value, isImportant) {
        super(value);
        this.isImportant = isImportant;
    }

    getDescription() {
        return `[Fill] ${this.value} (${this.isImportant ? 'important' : 'not important'})`;
    }
}

export class Adjective extends Word {
    constructor(value) {
        super(value);
    }

    getDescription() {
        return `[Adj] ${this.value}`
    }
}
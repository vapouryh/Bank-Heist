import InputCleaner from "./inputCleaner.js";

export class Alias {
    constructor(value, translatesTo) {
        this.value = new InputCleaner(value).getCleanInput();
        this.translatesTo = new InputCleaner(translatesTo).getCleanInput();
    }
}

export default class AliasList extends Array {
    add(translatesTo, ...aliases) {
        aliases.forEach(alias => {
            this.push(new Alias(alias, translatesTo));
        });
    }

    apply(value) {
        const alias = this.find(a => a.value == value);
        return alias ? alias.translatesTo : value;
    }
}
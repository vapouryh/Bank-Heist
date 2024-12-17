import AliasList from "./alias.js";
import InputCleaner from "./inputCleaner.js";
import Sentence from "./sentence.js";
import { Adjective, Filler, Noun, Verb } from "./wordClasses.js"

class Parser {
    constructor() {
        this.aliases = new AliasList();
        this.verbs = [];
        this.fillers = [];
        this.nouns = [];
    }

    parse(input) {
        const cleanInput = new InputCleaner(input).getCleanInput();
        const result = new Sentence(cleanInput);

        var toParse = this.aliases.apply(result.cleanInput);

        [result.word1, toParse] = this.popVerb(toParse);
        [result.word2, toParse] = this.popFiller(toParse);
        [result.word3, toParse] = this.popFiller(toParse);
        [result.word4, result.word4Confident, toParse] = this.popNoun(toParse);
        [result.word5, toParse] = this.popFiller(toParse);
        [result.word6, toParse] = this.popFiller(toParse);
        [result.word7, result.word7Confident, toParse] = this.popNoun(toParse);
      
        if (result.word4) {
          result.word4.confident = result.word4Confident;
        }
      
        if (result.word7) {
          result.word7.confident = result.word7Confident;
        }

        if (toParse !== null && toParse !== undefined && toParse.trim() !== '') {
            result.unknownWord = toParse.indexOf(' ') > -1 ? toParse.split(' ')[0] : toParse;
        }

        result.parseSuccess = result.word1 !== null && !result.unknownWord;
        return result;
    }

    popVerb(toParse) {
        for (const verb of this.verbs.sort((a, b) => b.toString().length - a.toString().length)) {
            if (toParse !== verb.value && !toParse.startsWith(verb.value + " ")) continue;

            toParse = toParse.substring(verb.value.length).trim();
            return [verb, toParse];
        }
        return [null, toParse];
    }

    popFiller(toParse) {
        for (const f of [...this.fillers].sort((a, b) => b.toString().length - a.toString().length)) {
            if (toParse === f.value || toParse.startsWith(f.value + " ")) {
                toParse = toParse.substring(f.value.length).trim();
                return [f, toParse];
            }
        }
        return [null, toParse];
    }

    popNoun(toParse) {

        for (const n of [...this.nouns].sort((a, b) => b.getFullString().length - a.getFullString().length)) {
            if (toParse === n.getFullString() || toParse.startsWith(n.getFullString() + " ")) {
                toParse = toParse.substring(n.getFullString().length).trim();
                return [n, true, toParse];
            }
        }

        for (const n of [...this.nouns].sort((a, b) => b.toString().length - a.toString().length)) {
            if (toParse === n.value || toParse.startsWith(n.value + " ")) {
                toParse = toParse.substring(n.value.length).trim();
                return [n, false, toParse];
            }
        }
    
        return [null, false, toParse];
    }

    addVerbs(...words) {
        for (const word of words) {
            this.verbs.push(new Verb(word));
        }
    }

    addImportantFillers(...words) {
        for (const word of words) {
            this.fillers.push(new Filler(word, true));
        }
    }

    addUnimportantFillers(...words) {
        for (const word of words) {
            this.fillers.push(new Filler(word, false));
        }
    }

    addNouns(...words) {
        for (const word of words) {
            if (word.indexOf(' ') > -1) {
                const parts = word.split(' ');
                this.nouns.push(new Noun(parts[1], new Adjective(parts[0])));
            } else {
                this.nouns.push(new Noun(word));
            }
        }
    }
}

function createParser() {
    const parser = new Parser();
  
    parser.addVerbs("GO", "OPEN", "LOOK", "INSPECT", "INVENTORY", "TAKE", "DROP", "USE", "SHOOT", "THREATEN", "ATTACH", "MAP", "COMMANDS", "HELP");
    parser.addImportantFillers("TO", "ON", "IN", "WITH", "INSIDE");
    parser.addUnimportantFillers("THE", "A", "AN", "AT", "OF", "UP");
    parser.addNouns("NORTH", "EAST", "WEST", "SOUTH", "OLD PISTOL", "VAULT DRILL", "HACKING DEVICE", "KEY", "SUPPRESSOR", "CROWBAR", "LOCKER", "WORKBENCH", "VAN", "GUARD", "CCTV ROOM", "HOSTAGES", "DOOR", "SHELF");

  
    parser.aliases.add("GO NORTH", "N", "NORTH", "MOVE NORTH", "MOVE N");
    parser.aliases.add("GO EAST", "E", "EAST", "MOVE EAST", "MOVE E");
    parser.aliases.add("GO SOUTH", "S", "SOUTH", "MOVE SOUTH", "MOVE S");
    parser.aliases.add("GO WEST", "W", "WEST", "MOVE WEST", "MOVE W");
    parser.aliases.add("INVENTORY", "I", "INV", "OPEN INVENTORY", "OPEN INV", "OPEN I");
    parser.aliases.add("TAKE", "PICK");
  
    return parser;
}

const parser = createParser();

export default parser;
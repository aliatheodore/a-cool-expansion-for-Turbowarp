// Original: Gemini and me 


(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('All extension must run unsandboxed');
  }
  //v1.1 / v1.0 / v1.4 / v1.5.1

  const clickTimes = [];
  let currentMouseX = 0;
  let currentMouseY = 0;


  window.addEventListener('click', () => {
    const now = performance.now();
    clickTimes.push(now);
  });

  window.addEventListener('mousemove', (event) => {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
  });

  class MouseData {
    getInfo() {
      return {
        id: 'mousedata',
        name: 'Mouse Data',
        color1: '#7f7f7f', 
        color2: '#eeeeee', 
        color3: '#000000', 
        blocks: [
          {
            opcode: 'getClicksPerSecond',
            blockType: Scratch.BlockType.REPORTER,
            text: 'average clicks per second',
          },
          {
            opcode: 'getMouseX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'mouse x',
          },
          {
            opcode: 'getMouseY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'mouse y',
          },
        ]
      };
    }


    getClicksPerSecond() {
      const now = performance.now();
      const oneSecondAgo = now - 1000;
      

      while (clickTimes.length > 0 && clickTimes[0] < oneSecondAgo) {
        clickTimes.shift();
      }
      
      return clickTimes.length;
    }

    getMouseX() {
      return currentMouseX;
    }

    getMouseY() {
      return currentMouseY;
    }
  }

  Scratch.extensions.register(new MouseData());

  const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxBase = DIGITS.length;

  class CustomBaseConverter {
    getInfo() {
      return {
        id: 'custombaseconverter',
        name: 'Base Converter',
        color1: '#7f7f7f', 
        color2: '#eeeeee', 
        color3: '#000000', 
        blocks: [
          {
            opcode: 'convertBase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'return [NUM] in base [FROM] to base [TO]',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10'
              },
              FROM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              TO: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          }
        ]
      };
    }

    convertBase(args) {
      const fromBase = Math.round(Number(args.FROM));
      const toBase = Math.round(Number(args.TO));
      const numStr = String(args.NUM);
      let base10 = 0;

      if (fromBase === 1) {
        const unarySymbol = DIGITS[0];
        if (!numStr.split('').every(char => char === unarySymbol)) {
           return `error "${numStr}"`;
        }
        base10 = numStr.length - 1; 
        if (base10 < 0) base10 = 0;

      } else if (fromBase >= 2 && fromBase <= maxBase) {
        for (let i = 0; i < numStr.length; i++) {
          const digit = numStr[numStr.length - 1 - i];
          const digitValue = DIGITS.indexOf(digit);
          if (digitValue === -1 || digitValue >= fromBase) {
            return `error "${digit}"`;
          }
          base10 += digitValue * Math.pow(fromBase, i);
        }
      } else {
        return `1<${fromBase}< ${maxBase+1}`;
      }

      if (toBase === 1) {
        return DIGITS[0].repeat(base10 + 1);

      } else if (toBase >= 2 && toBase <= maxBase) {
        if (base10 === 0) return '0';
        let result = '';
        let tempNum = base10;
        while (tempNum > 0) {
          const remainder = tempNum % toBase;
          result = DIGITS[remainder] + result;
          tempNum = Math.floor(tempNum / toBase);
        }
        return result;

      } else {
        return `eror: ${toBase}>${maxBase}`;
      }
    }
  }

  Scratch.extensions.register(new CustomBaseConverter());

  class LogExtension {
    constructor() {
        this.messages = {};
    }

    getInfo() {
        return {
            id: 'log',
            name: 'Message Storage',
            color1: '#7f7f7f', 
            color2: '#eeeeee', 
            color3: '#000000', 
            blocks: [
                {
                    opcode: 'setMessage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'message: [MESSAGE] (tag: [TAG]) log: [LOG_TOGGLE_SET]',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello!'
                        },
                        TAG: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '123'
                        },
                        LOG_TOGGLE_SET: {
                            type: Scratch.ArgumentType.BOOLEAN,
                            defaultValue: true
                        }
                    }
                },
                {
                    opcode: 'getMessageAndLog',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'take the message tag: [TAG] log: [LOG_TOGGLE_GET]',
                    arguments: {
                        TAG: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '123'
                        },
                        LOG_TOGGLE_GET: {
                            type: Scratch.ArgumentType.BOOLEAN,
                            defaultValue: false
                        }
                    }
                },
            ]
        };
    }

    setMessage(args) {
        const message = Scratch.Cast.toString(args.MESSAGE);
        const tag = Scratch.Cast.toString(args.TAG);
        const shouldLog = Scratch.Cast.toBoolean(args.LOG_TOGGLE_SET);
        this.messages[tag] = message;

        if (shouldLog) {
            console.log(`[Tag: ${tag}] Stored message: "${message}"`);
        }
    }

    getMessageAndLog(args) {
        const tag = Scratch.Cast.toString(args.TAG);
        const shouldLog = Scratch.Cast.toBoolean(args.LOG_TOGGLE_GET);
        const message = this.messages[tag] || '';
        this.messages[tag] = "";

        if (shouldLog) {
            console.log(`[Tag: ${tag}] Retrieved message: "${message}"`);
        }

        if (message !== "") {
            return message;
        } else {
            return "\t";
        }
    }
  }

  Scratch.extensions.register(new LogExtension());

  class More {
    getInfo() {
      const i = 0;
      const defaultValue = "";
      return {
        id: "More",
        name: "More",
        color1: '#7f7f7f', 
        color2: '#eeeeee', 
        color3: '#000000', 
        blocks: [
          {
            opcode: "foreverLoop",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause",
          },
          {
            opcode: "noOpCrash",
            blockType: Scratch.BlockType.COMMAND,
            text: "crash",
          },
          {
            opcode: "getBooleanFromMenu",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[MOD]",
            arguments: {
              MOD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "true",
                menu: "booleanMenu",
              },
            },
          },
          {
            opcode: "isDivisibleBy",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [NUMERATOR] divisible by [DENOMINATOR]?",
            arguments: {
              NUMERATOR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4
              },
              DENOMINATOR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
            },
          },
          {
            opcode: 'lessThan',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE] < [TWO]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
              TWO: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
            },
          },
          {
            opcode: 'equals',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE] = [TWO]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
              TWO: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
            },
          },
          {
            opcode: 'greaterThan',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE] > [TWO]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
              TWO: { type: Scratch.ArgumentType.STRING, defaultValue: ' ' },
            },
          },
          {
            opcode: 'strictlyEquals',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE]===[TWO]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING },
              TWO: { type: Scratch.ArgumentType.STRING },
            },
          },
          {
            opcode: 'NotEquals',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE] !== [TWO]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING },
              TWO: { type: Scratch.ArgumentType.STRING },
            },
          },
          {
            opcode: 'Untold',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ONE]',
            arguments: {
              ONE: { type: Scratch.ArgumentType.STRING },
            },
          },
          {
            opcode: "containsText",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[TEXT] contains [SUBSTRING]?",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world' },
              SUBSTRING: { type: Scratch.ArgumentType.STRING, defaultValue: 'world' },
            },
          },
          {
            opcode: "numberCrash",
            blockType: Scratch.BlockType.REPORTER,
            text: "pause",
          },
          {
            opcode: "randomTextOfLength",
            blockType: Scratch.BlockType.REPORTER,
            text: "random text of length [LENGTH]",
            arguments: {
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
            },
          },
          {
            opcode: "joinListWithSeparator",
            blockType: Scratch.BlockType.REPORTER,
            text: "join list [LIST] with separator [SEPARATOR]",
            arguments: {
              LIST: {
                type: Scratch.ArgumentType.STRING, 
                defaultValue: "apple,banana,cherry"
              },
              SEPARATOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "-"
              },
            },
          },
          {
            opcode: "getTextLength",
            blockType: Scratch.BlockType.REPORTER,
            text: "length of [TEXT]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' },
            },
          },
          {
            opcode: "changeCase",
            blockType: Scratch.BlockType.REPORTER,
            text: "[CASE] case of [TEXT]",
            arguments: {
              CASE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "uppercase",
                menu: "caseMenu",
              },
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello World' },
            },
          },
          {
            opcode: "Pi",
            blockType: Scratch.BlockType.REPORTER,
            text: "π",
            allowDropAnywhere: true,
          },
          {
            opcode: "getN",
            blockType: Scratch.BlockType.REPORTER,
            text: "/n",
            allowDropAnywhere: true,
          },
          {
            opcode: "getS",
            blockType: Scratch.BlockType.REPORTER,
            text: "space",
            allowDropAnywhere: true,
          },
          {
            opcode: "getT",
            blockType: Scratch.BlockType.REPORTER,
            text: "/t",
            allowDropAnywhere: true,
          },
          {
            opcode: "getR",
            blockType: Scratch.BlockType.REPORTER,
            text: "/r",
            allowDropAnywhere: true,
          },
          {
            opcode: "getB",
            blockType: Scratch.BlockType.REPORTER,
            text: "/b",
            allowDropAnywhere: true,
          },
          {
            opcode: "getF",
            blockType: Scratch.BlockType.REPORTER,
            text: "/f",
            allowDropAnywhere: true,
          },
          {
            opcode: "getV",
            blockType: Scratch.BlockType.REPORTER,
            text: "/v",
            allowDropAnywhere: true,
          },
          {
            opcode: "geto",
            blockType: Scratch.BlockType.REPORTER,
            text: "/0",
            allowDropAnywhere: true,
          },
          {
            opcode: "Intcolor",
            blockType: Scratch.BlockType.REPORTER,
            text: "Color:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#80fff2ff"
              },
            },
          },
          {
            opcode: "Intangle",
            blockType: Scratch.BlockType.REPORTER,
            text: "Angle:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: "90"
              },
            },
          },
          {
            opcode: "Intmatrix",
            blockType: Scratch.BlockType.REPORTER,
            text: "Matrix:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.MATRIX,
                defaultValue: "1111100100001000010011111"
              },
            },
          },
          {
            opcode: "Intnote",
            blockType: Scratch.BlockType.REPORTER,
            text: "Note:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: "32"
              },
            },
          },
          {
            opcode: "Intcostume",
            blockType: Scratch.BlockType.REPORTER,
            text: "Costume:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.COSTUME,
                defaultValue: " "
              },
            },
          },
          {
            opcode: "Intsound",
            blockType: Scratch.BlockType.REPORTER,
            text: "Sound:[ONE]",
            allowDropAnywhere: true,
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.SOUND,
                defaultValue: " "
              },
            },
          },
        ],
        menus: {
          caseMenu: {
            acceptsReporters: true,
            items: [
              { text: "UPPERCASE", value: "uppercase" },
              { text: "lowercase", value: "lowercase" },
              { text: "Title Case", value: "titlecase" },
            ],
          },
          booleanMenu: {
            items: [
              { text: "true", value: "true" },
              { text: "false", value: "false" },
            ],
          },
        },
      };
    }
    

    foreverLoop() {
        while(true) {
        i+=i;
        }
    }

    noOpCrash() {
      while(true) {
      continue;
      }
    }

    numberCrash() {
        while(true) {
        i++; //a normal bug
        }
        return i;
    }

    isDivisibleBy(args) {
        const numerator = Scratch.Cast.toNumber(args.NUMERATOR);
        const denominator = Scratch.Cast.toNumber(args.DENOMINATOR);
        if (denominator === 0) return false;
        return numerator % denominator === 0;
    }

    randomTextOfLength(args) {
        const length = Scratch.Cast.toNumber(args.LENGTH);
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>?/`~';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    getBooleanFromMenu(args) {
        return args.MOD === "true";
    }

    joinListWithSeparator(args) {
        if (typeof args.LIST !== 'string') return "";
        const listItems = args.LIST.split(',');
        return listItems.join(String(args.SEPARATOR));
    }

    getTextLength(args) {
        return String(args.TEXT).length;
    }

    changeCase(args) {
        const text = String(args.TEXT);
        const caseType = String(args.CASE).toLowerCase();

        if (caseType === "uppercase") {
            return text.toUpperCase();
        } else if (caseType === "lowercase") {
            return text.toLowerCase();
        } else if (caseType === "titlecase") {
            return text.replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return text;
    }

    containsText(args) {
        return String(args.TEXT).includes(String(args.SUBSTRING));
    }

    getN() {
        return "\n";
    }

    getS() {
        return " ";
    }
    
    getT() {
        return "\t";
    }

    getR() {
        return "\r";
    }

    getB() {
        return "\b";
    }

    getF() {
        return "\f";
    }

    getV() {
        return "\v";
    }

    geto() {
        return "\0";
    }

    lessThan(args) {
        return Scratch.Cast.toNumber(args.ONE) < Scratch.Cast.toNumber(args.TWO);
    }

    equals(args) {
        return Scratch.Cast.compare(args.ONE, args.TWO) === 0;
    }

    greaterThan(args) {
        return Scratch.Cast.toNumber(args.ONE) > Scratch.Cast.toNumber(args.TWO);
    }

    strictlyEquals(args) {
        return args.ONE === args.TWO;
    }
    
    NotEquals(args) {
        return args.ONE !== args.TWO;
    }

    Untold(args) {
        return args.ONE
    }

    Pi() {
        return Math.PI;
    }

    Intcolor(args) {
        return args.ONE;
    }

    Intangle(args) {
        return args.ONE;
    }

    Intmatrix(args) {
        return args.ONE;
    }

    Intnote(args) {
        return args.ONE;
    }
    
    Intcostume(args) {
        return args.ONE;
    }
    
    Intsound(args) {
        return args.ONE;
    }
  }

  Scratch.extensions.register(new More());
  const alldata="(function(Scratch) { .use strict.: if (!Scratch.extensions.unsandboxed) { throw new Error(.This extension must run unsandboxed.): } const clickTimes = []: let currentMouseX = 0: let currentMouseY = 0: window.addEventListener(.click., () => { const now = performance.now(): clickTimes.push(now): }): window.addEventListener(.mousemove., (event) => { currentMouseX = event.clientX: currentMouseY = event.clientY: }): class MouseData { getInfo() { return { id: .mousedata., name: .Mouse Data., color1: ..#7f7f7f.., color2: ..#000000.., color3: ..#eeeeee.., blocks: [ { opcode: .getClicksPerSecond., blockType: Scratch.BlockType.REPORTER, text: .average clicks per second., }, { opcode: .getMouseX., blockType: Scratch.BlockType.REPORTER, text: .mouse x., }, { opcode: .getMouseY., blockType: Scratch.BlockType.REPORTER, text: .mouse y., }, ] }: } getClicksPerSecond() { const now = performance.now(): const oneSecondAgo = now - 1000: while (clickTimes.length > 0 && clickTimes[0] < oneSecondAgo) { clickTimes.shift(): } return clickTimes.length: } getMouseX() { return currentMouseX: } getMouseY() { return currentMouseY: } } Scratch.extensions.register(new MouseData()): const DIGITS = .0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.: const maxBase = DIGITS.length: class CustomBaseConverter { getInfo() { return { id: .custombaseconverter., name: .Base Converter., color1: .#7f7f7f., color2: .#000000., color3: .#eeeeee., blocks: [ { opcode: .convertBase., blockType: Scratch.BlockType.REPORTER, text: .return [NUM] in base [FROM] to base [TO]., arguments: { NUM: { type: Scratch.ArgumentType.STRING, defaultValue: .10. }, FROM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }, TO: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 } } } ] }: } convertBase(args) { const fromBase = Math.round(Number(args.FROM)): const toBase = Math.round(Number(args.TO)): const numStr = String(args.NUM): let base10 = 0: if (fromBase === 1) { const unarySymbol = DIGITS[0]: if (!numStr.split(..).every(char => char === unarySymbol)) { return `error ..${numStr}..`: } base10 = numStr.length - 1: if (base10 < 0) base10 = 0: } else if (fromBase >= 2 && fromBase <= maxBase) { for (let i = 0: i < numStr.length: i++) { const digit = numStr[numStr.length - 1 - i]: const digitValue = DIGITS.indexOf(digit): if (digitValue === -1 || digitValue >= fromBase) { return `error ..${digit}..`: } base10 += digitValue * Math.pow(fromBase, i): } } else { return `1<${fromBase}< ${maxBase+1}`: } if (toBase === 1) { return DIGITS[0].repeat(base10 + 1): } else if (toBase >= 2 && toBase <= maxBase) { if (base10 === 0) return .0.: let result = ..: let tempNum = base10: while (tempNum > 0) { const remainder = tempNum % toBase: result = DIGITS[remainder] + result: tempNum = Math.floor(tempNum / toBase): } return result: } else { return `eror: ${toBase}>${maxBase}`: } } } Scratch.extensions.register(new CustomBaseConverter()): class LogExtension { constructor() { this.messages = {}: } getInfo() { return { id: .log., name: .Message Storage., color1: .#7f7f7f., color2: .#000000., color3: .#eeeeee., blocks: [ { opcode: .setMessage., blockType: Scratch.BlockType.COMMAND, text: .message: [MESSAGE] (tag: [TAG]) log: [LOG_TOGGLE_SET]., arguments: { MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: .hello!. }, TAG: { type: Scratch.ArgumentType.STRING, defaultValue: .123. }, LOG_TOGGLE_SET: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: true } } }, { opcode: .getMessageAndLog., blockType: Scratch.BlockType.REPORTER, text: .take the message tag: [TAG] log: [LOG_TOGGLE_GET]., arguments: { TAG: { type: Scratch.ArgumentType.STRING, defaultValue: .123. }, LOG_TOGGLE_GET: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false } } }, ] }: } setMessage(args) { const message = Scratch.Cast.toString(args.MESSAGE): const tag = Scratch.Cast.toString(args.TAG): const shouldLog = Scratch.Cast.toBoolean(args.LOG_TOGGLE_SET): this.messages[tag] = message: if (shouldLog) { console.log(`[Tag: ${tag}] Stored message: ..${message}..`): } } getMessageAndLog(args) { const tag = Scratch.Cast.toString(args.TAG): const shouldLog = Scratch.Cast.toBoolean(args.LOG_TOGGLE_GET): const message = this.messages[tag] || ..: this.messages[tag] = ....: if (shouldLog) { console.log(`[Tag: ${tag}] Retrieved message: ..${message}..`): } if (message !== ....) { return message: } else { return ..\t..: } } } Scratch.extensions.register(new LogExtension()): class More { getInfo() { const i = 0: const defaultValue = ....: return { id: ..More.., name: ..More.., color1: ..#7f7f7f.., color2: ..#000000.., color3: ..#eeeeee.., blocks: [ { opcode: ..foreverLoop.., blockType: Scratch.BlockType.COMMAND, text: ..pause.., }, { opcode: ..noOpCrash.., blockType: Scratch.BlockType.COMMAND, text: ..crash.., }, { opcode: ..getBooleanFromMenu.., blockType: Scratch.BlockType.BOOLEAN, text: ..[MOD].., arguments: { MOD: { type: Scratch.ArgumentType.STRING, defaultValue: ..true.., menu: ..booleanMenu.., }, }, }, { opcode: ..isDivisibleBy.., blockType: Scratch.BlockType.BOOLEAN, text: ..is [NUMERATOR] divisible by [DENOMINATOR]?.., arguments: { NUMERATOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }, DENOMINATOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }, }, }, { opcode: .lessThan., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE] < [TWO]., arguments: { ONE: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, TWO: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, }, }, { opcode: .equals., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE] = [TWO]., arguments: { ONE: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, TWO: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, }, }, { opcode: .greaterThan., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE] > [TWO]., arguments: { ONE: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, TWO: { type: Scratch.ArgumentType.STRING, defaultValue: . . }, }, }, { opcode: .strictlyEquals., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE]===[TWO]., arguments: { ONE: { type: Scratch.ArgumentType.STRING }, TWO: { type: Scratch.ArgumentType.STRING }, }, }, { opcode: .NotEquals., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE] !== [TWO]., arguments: { ONE: { type: Scratch.ArgumentType.STRING }, TWO: { type: Scratch.ArgumentType.STRING }, }, }, { opcode: .Untold., blockType: Scratch.BlockType.BOOLEAN, text: .[ONE]., arguments: { ONE: { type: Scratch.ArgumentType.STRING }, }, }, { opcode: ..containsText.., blockType: Scratch.BlockType.BOOLEAN, text: ..[TEXT] contains [SUBSTRING]?.., arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: .hello world. }, SUBSTRING: { type: Scratch.ArgumentType.STRING, defaultValue: .world. }, }, }, { opcode: ..numberCrash.., blockType: Scratch.BlockType.REPORTER, text: ..pause.., }, { opcode: ..randomTextOfLength.., blockType: Scratch.BlockType.REPORTER, text: ..random text of length [LENGTH].., arguments: { LENGTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }, }, }, { opcode: ..joinListWithSeparator.., blockType: Scratch.BlockType.REPORTER, text: ..join list [LIST] with separator [SEPARATOR].., arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: ..apple,banana,cherry.. }, SEPARATOR: { type: Scratch.ArgumentType.STRING, defaultValue: ..-.. }, }, }, { opcode: ..getTextLength.., blockType: Scratch.BlockType.REPORTER, text: ..length of [TEXT].., arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: .hello. }, }, }, { opcode: ..changeCase.., blockType: Scratch.BlockType.REPORTER, text: ..[CASE] case of [TEXT].., arguments: { CASE: { type: Scratch.ArgumentType.STRING, defaultValue: ..uppercase.., menu: ..caseMenu.., }, TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: .Hello World. }, }, }, { opcode: ..Pi.., blockType: Scratch.BlockType.REPORTER, text: ..π.., allowDropAnywhere: true, }, { opcode: ..getN.., blockType: Scratch.BlockType.REPORTER, text: ../n.., allowDropAnywhere: true, }, { opcode: ..getS.., blockType: Scratch.BlockType.REPORTER, text: ..space.., allowDropAnywhere: true, }, { opcode: ..getT.., blockType: Scratch.BlockType.REPORTER, text: ../t.., allowDropAnywhere: true, }, { opcode: ..getR.., blockType: Scratch.BlockType.REPORTER, text: ../r.., allowDropAnywhere: true, }, { opcode: ..getB.., blockType: Scratch.BlockType.REPORTER, text: ../b.., allowDropAnywhere: true, }, { opcode: ..getF.., blockType: Scratch.BlockType.REPORTER, text: ../f.., allowDropAnywhere: true, }, { opcode: ..getV.., blockType: Scratch.BlockType.REPORTER, text: ../v.., allowDropAnywhere: true, }, { opcode: ..geto.., blockType: Scratch.BlockType.REPORTER, text: ../0.., allowDropAnywhere: true, }, { opcode: ..Intcolor.., blockType: Scratch.BlockType.REPORTER, text: ..Color:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.COLOR, defaultValue: ..#fffff0.. }, }, }, { opcode: ..Intangle.., blockType: Scratch.BlockType.REPORTER, text: ..Angle:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.ANGLE, defaultValue: ..90.. }, }, }, { opcode: ..Intmatrix.., blockType: Scratch.BlockType.REPORTER, text: ..Matrix:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.MATRIX, defaultValue: ..1111100100001000010011111.. }, }, }, { opcode: ..Intnote.., blockType: Scratch.BlockType.REPORTER, text: ..Note:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.NOTE, defaultValue: ..32.. }, }, }, { opcode: ..Intcostume.., blockType: Scratch.BlockType.REPORTER, text: ..Costume:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.COSTUME, defaultValue: .. .. }, }, }, { opcode: ..Intsound.., blockType: Scratch.BlockType.REPORTER, text: ..Sound:[ONE].., allowDropAnywhere: true, arguments: { ONE: { type: Scratch.ArgumentType.SOUND, defaultValue: .. .. }, }, }, ], menus: { caseMenu: { acceptsReporters: true, items: [ { text: ..UPPERCASE.., value: ..uppercase.. }, { text: ..lowercase.., value: ..lowercase.. }, { text: ..Title Case.., value: ..titlecase.. }, ], }, booleanMenu: { items: [ { text: ..true.., value: ..true.. }, { text: ..false.., value: ..false.. }, ], }, }, }: } foreverLoop() { while(true) { i+=i: } } noOpCrash() { while(true) { continue: } } numberCrash() { while(true) { i+=i: } return i: } isDivisibleBy(args) { const numerator = Scratch.Cast.toNumber(args.NUMERATOR): const denominator = Scratch.Cast.toNumber(args.DENOMINATOR): if (denominator === 0) return false: return numerator % denominator === 0: } randomTextOfLength(args) { const length = Scratch.Cast.toNumber(args.LENGTH): const characters = .ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|::..,.<>?/`~.: let result = ..: for (let i = 0: i < length: i++) { result += characters.charAt(Math.floor(Math.random() * characters.length)): } return result: } getBooleanFromMenu(args) { return args.MOD === ..true..: } joinListWithSeparator(args) { if (typeof args.LIST !== .string.) return ....: const listItems = args.LIST.split(.,.): return listItems.join(String(args.SEPARATOR)): } getTextLength(args) { return String(args.TEXT).length: } changeCase(args) { const text = String(args.TEXT): const caseType = String(args.CASE).toLowerCase(): if (caseType === ..uppercase..) { return text.toUpperCase(): } else if (caseType === ..lowercase..) { return text.toLowerCase(): } else if (caseType === ..titlecase..) { return text.replace(/\b\w/g, (char) => char.toUpperCase()): } return text: } containsText(args) { return String(args.TEXT).includes(String(args.SUBSTRING)): } getN() { return ..\n..: } getS() { return .. ..: } getT() { return ..\t..: } getR() { return ..\r..: } getB() { return ..\b..: } getF() { return ..\f..: } getV() { return ..\v..: } geto() { return ..\0..: } lessThan(args) { return Scratch.Cast.toNumber(args.ONE) < Scratch.Cast.toNumber(args.TWO): } equals(args) { return Scratch.Cast.compare(args.ONE, args.TWO) === 0: } greaterThan(args) { return Scratch.Cast.toNumber(args.ONE) > Scratch.Cast.toNumber(args.TWO): } strictlyEquals(args) { return args.ONE === args.TWO: } NotEquals(args) { return args.ONE !== args.TWO: } Untold(args) { return args.ONE } Pi() { return Math.PI: } Intcolor(args) { return args.ONE: } Intangle(args) { return args.ONE: } Intmatrix(args) { return args.ONE: } Intnote(args) { return args.ONE: } Intcostume(args) { return args.ONE: } Intsound(args) { return args.ONE: } } Scratch.extensions.register(new More()): const alldata=....: class GetData { getInfo() { return { id: .data., name: .Data., color1: ..#7f7f7f.., color2: ..#000000.., color3: ..#eeeeee.., blocks: [ { opcode: .data., blockType: Scratch.BlockType.REPORTER, text: .DATA., }, ] }: } data() { return alldata: } } Scratch.extensions.register(new GetData()): })(Scratch):";
  class GetData {
    getInfo() {
      return {
        id: 'data',
        name: 'Data',
        color1: '#7f7f7f', 
        color2: '#eeeeee', 
        color3: '#000000', 
        blocks: [
          {
            opcode: 'data',
            blockType: Scratch.BlockType.REPORTER,
            text: 'DATA',
          },
        ]
      };
    }
    data() {
      return alldata;
    }
  }
  Scratch.extensions.register(new GetData());

  class OminiScript {
    constructor() {
      this.globalLastResult = 0;
    }

    getInfo() {
      return {
        id: 'ominiscript',
        name: 'OminiScript',
        color1: '#7f7f7f', 
        color2: '#eeeeee', 
        color3: '#000000', 
        blocks: [
          {
            opcode: 'runScript',
            blockType: Scratch.BlockType.REPORTER,
            text: 'run [STR]',
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '=!Help'
              }
            }
          },
          {
            opcode: 'getLastResult',
            blockType: Scratch.BlockType.REPORTER,
            text: 'latest result'
          }
        ]
      };
    }

    getLastResult() {
      return this.globalLastResult;
    }

    runScript(args) {
      let rawInput = args.STR.trim();
      
      if (rawInput === '=!Help') {
        return "OminiScript v1.5, \\n (New Line), \\t (Tab) | OP: +, -, *, /, %, ^, !^, joint | FUNC: sqrt, abs, round, floor, ceil, min, max, rand, log, len, clamp;
      }

      try {
        // Handle escapes
        rawInput = rawInput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

        // Clean input
        const cleanInput = rawInput.replace(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '');
        const statements = cleanInput.split(';');
        let variables = { 'pi': Math.PI, 'e': Math.E };
        
        const now = new Date();
        const timeData = {
          'day': now.getDate(), 'hour': now.getHours(), 'minut': now.getMinutes(),
          'segond': now.getSeconds(), 'milliesegond': now.getMilliseconds()
        };

        let currentResult = 0;

        for (let statement of statements) {
          if (!statement) continue;
          
          if (statement.includes('==')) {
            currentResult = this.evaluate(statement.split('==')[1], variables, timeData);
            this.globalLastResult = currentResult;
            return currentResult;
          } else if (statement.includes('=')) {
            let [varName, expr] = statement.split('=');
            currentResult = this.evaluate(expr, variables, timeData);
            variables[varName] = currentResult;
          } else {
            currentResult = this.evaluate(statement, variables, timeData);
          }
        }
        
        this.globalLastResult = currentResult;
        return currentResult;

      } catch (err) {
        console.error("OminiScript Error:" +","+ err +","+ rawInput);
        return "Error\t\n\v!"; // Returns 'rawInput' ? instead of crashing TurboWarp
      }
    }

    evaluate(expr, vars, timeData) {
      let processed = expr;

      // Time Data
      processed = processed.replace(/time\(day\)/g, timeData['day']);
      processed = processed.replace(/time\(hour\)/g, timeData['hour']);
      processed = processed.replace(/time\(minut\)/g, timeData['minut']);
      processed = processed.replace(/time\(segond\)/g, timeData['segond']);
      processed = processed.replace(/time\(milliesegond\)/g, timeData['milliesegond']);

      processed = processed.replace(/joint/g, '+');

      const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
      for (let key of sortedKeys) {
        const regex = new RegExp('(?<![0-9])\\b' + key + '\\b(?![0-9])', 'g');
        processed = processed.replace(regex, vars[key]);
      }

      while (processed.includes('!^')) {
        processed = processed.replace(/([0-9.eE-]+)!?\^([0-9.eE-]+)/g, 'Math.pow($1, 1/$2)');
      }

      const mathMap = {
        '\\^': '**', '\\bsqrt\\b': 'Math.sqrt', '\\blog\\b': 'Math.log10',
        '\\babs\\b': 'Math.abs', '\\bround\\b': 'Math.round', '\\bfloor\\b': 'Math.floor',
        '\\bceil\\b': 'Math.ceil', '\\bmin\\b': 'Math.min', '\\bmax\\b': 'Math.max',
        '\\bsin\\b': 'Math.sin', '\\bcos\\b': 'Math.cos', '\\btan\\b': 'Math.tan'
      };

      for (let [key, val] of Object.entries(mathMap)) {
        processed = processed.replace(new RegExp(key, 'g'), val);
      }

      // Handle strings/functions
      processed = processed.replace(/len\(([^)]+)\)/g, 'String($1).length');
      processed = processed.replace(/upper\(([^)]+)\)/g, 'String($1).toUpperCase()');
      processed = processed.replace(/lower\(([^)]+)\)/g, 'String($1).toLowerCase()');
      processed = processed.replace(/clamp\(([^,]+),([^,]+),([^)]+)\)/g, 'Math.min(Math.max($1,$2),$3)');
      processed = processed.replace(/rand\(([^,]+),([^)]+)\)/g, '(Math.floor(Math.random()*($2-$1+1))+(1*$1))');

      return Function('"use strict"; return (' + processed + ')')();
    }
  }

  Scratch.extensions.register(new OminiScript());

})(Scratch);

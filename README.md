The file I posted is a bit large. It was made by Gemini.
running in unsandboxed!!!!!
the file:
[function - math.js](https://github.com/user-attachments/files/24444593/function.-.math.js)
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('All extensions must run unsandboxed');
  }

  const THEME = {
    color1: '#7f7f7f',
    color2: '#eeeeee',
    color3: '#000000'
  };

  class OminiScript {
    constructor() {
      this.resetVars();
    }

    resetVars() {
      this.vars = { 
        'pi': Math.PI, 
        'e': Math.E, 
        'help': "Omini v4.5 | : is return | input(); Err(T/F); Log(T/F)" 
      };
      this.safetyExp = 4;
      this.stopOnError = false;
      this.logErrors = false;
      this.errorList = [];
    }

    getInfo() {
      return {
        id: 'ominiscript',
        name: 'OminiScript',
        ...THEME,
        blocks: [
          {
            opcode: 'run',
            blockType: Scratch.BlockType.REPORTER,
            text: 'run omini [S]',
            arguments: {
              S: { type: Scratch.ArgumentType.STRING, defaultValue: 'Log(true); var(i); for(10){i=i+1}; :i' }
            }
          },
          {
            opcode: 'clear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear variables'
          }
        ]
      };
    }

    clear() {
      this.resetVars();
    }

    run(args) {
      let script = args.S;
      this.errorList = []; // Reset errors for new run
      
      // Settings & Flags
      script = script.replace(/Safe\((.*?)\)/g, (m, v) => { this.safetyExp = Number(v); return ""; });
      script = script.replace(/Err\((true|false)\)/gi, (m, v) => { this.stopOnError = (v.toLowerCase() === 'true'); return ""; });
      script = script.replace(/Log\((true|false)\)/gi, (m, v) => { this.logErrors = (v.toLowerCase() === 'true'); return ""; });

      const LIMIT = Math.pow(2, Math.pow(2, this.safetyExp));

      // Variable Initialization
      script = script.replace(/var\((.*?)\)/g, (m, n) => { 
        this.vars[n.trim()] = 0; 
        return ""; 
      });

      try {
        let result = this.executeFlow(script, LIMIT);
        
        // Append logs if requested
        if (this.logErrors && this.errorList.length > 0) {
          return `${result} // Errors: ${this.errorList.join('; ')}`;
        }
        return result;
      } catch (e) {
        if (this.logErrors) return `Execution Failed // ${this.errorList.join('; ')}`;
        return "Error!";
      }
    }

    executeFlow(code, limit) {
      let current = code;
      while (current.includes('for(')) {
        let matched = false;
        current = current.replace(/for\((.*?)\)\s*\{([\s\S]*?)\}/, (m, count, body) => {
          matched = true;
          const iterations = Math.min(limit, Math.max(0, this.evaluate(count)));
          for (let i = 0; i < iterations; i++) {
            this.execLines(body);
          }
          return "0";
        });
        if (!matched) break;
      }
      return this.execLines(current);
    }

    execLines(script) {
      const lines = script.split(';');
      let lastResult = 0;
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        try {
          if (line.startsWith(':')) {
            return this.evaluate(line.substring(1));
          }

          if (line.includes('=') && !line.match(/[<>!]=/)) {
            let [key, val] = line.split('=');
            this.vars[key.trim()] = this.evaluate(val);
            lastResult = this.vars[key.trim()];
          } else {
            lastResult = this.evaluate(line);
          }
        } catch (err) {
          this.errorList.push(`Line Error: ${line}`);
          if (this.stopOnError) throw new Error("Stop");
          continue;
        }
      }
      return lastResult;
    }

    evaluate(expr) {
      let processed = expr.trim().replace(/\^/g, '**');
      const keys = Object.keys(this.vars);
      const values = keys.map(k => this.vars[k]);
      
      try {
        const inputFunc = (msg) => {
          const val = prompt(msg);
          return val === null ? "" : val;
        };

        const func = new Function('input', ...keys, `"use strict"; return (${processed});`);
        return func(inputFunc, ...values);
      } catch (e) {
        throw e; // Pass to execLines for logging
      }
    }
  }

  Scratch.extensions.register(new OminiScript());
})(Scratch);

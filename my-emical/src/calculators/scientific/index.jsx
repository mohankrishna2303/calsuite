import React, { useEffect, useState, useRef } from "react";
import './styles.css';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("");
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("RAD");
  const [history, setHistory] = useState([]);
  const displayRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter") {
        onCalculate();
        return;
      }
      if (e.key === "Backspace") {
        onBackspace();
        return;
      }
      const allowed = "0123456789+-*/().%";
      if (allowed.includes(e.key)) {
        setDisplay((d) => d + e.key);
        return;
      }
      if (e.key === "p") setDisplay((d) => d + "π");
      if (e.key === "e") setDisplay((d) => d + "e");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const insert = (txt) => setDisplay((d) => d + txt);
  const clearAll = () => setDisplay("");
  const onBackspace = () => setDisplay((d) => d.slice(0, -1));

  const toNumberSafe = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const replaceWithMath = (expr) => {
    let s = expr
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`)
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/\^/g, "**")
      .replace(/\blog\(/g, "Math.log10(")
      .replace(/\bln\(/g, "Math.log(")
      .replace(/\bexp\(/g, "Math.exp(")
      .replace(/\bsin\(/g, (match) => {
        return angleMode === "DEG" ? "Math.sin((" : "Math.sin((";
      })
      .replace(/\bcos\(/g, (match) => "Math.cos(")
      .replace(/\btan\(/g, (match) => "Math.tan(")
      .replace(/\basin\(/g, "Math.asin(")
      .replace(/\bacos\(/g, "Math.acos(")
      .replace(/\batan\(/g, "Math.atan(");

    if (angleMode === "DEG") {
      s = s.replace(/Math\.(sin|cos|tan|asin|acos|atan)\(/g, (m, name) => {
        if (name === "asin" || name === "acos" || name === "atan") {
          return `Math.${name}(`;
        }
        return `Math.${name}(`;
      });
    }

    return s;
  };

  const safeEval = (expr) => {
    try {
      let jsExpr = replaceWithMath(expr);

      if (angleMode === "DEG") {
        jsExpr = jsExpr.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (m, fn, inside) => {
          return `Math.${fn}(( ${inside} )* Math.PI / 180)`;
        });
        jsExpr = jsExpr.replace(/Math\.(asin|acos|atan)\(([^)]+)\)/g, (m, fn, inside) => {
          return `(Math.${fn}(${inside}) * 180 / Math.PI)`;
        });
      }

      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${jsExpr})`);
      const result = fn();
      if (typeof result === "number" && !Number.isFinite(result)) return "Infinity";
      return result;
    } catch (e) {
      return "Error";
    }
  };

  const onCalculate = () => {
    if (!display) return;
    const result = safeEval(display);
    setHistory((h) => [{ expr: display, result }, ...h].slice(0, 50));
    setDisplay(String(result));
  };

  const memAdd = () => setMemory((m) => m + toNumberSafe(safeEval(display)));
  const memSub = () => setMemory((m) => m - toNumberSafe(safeEval(display)));
  const memRecall = () => setDisplay((d) => d + String(memory));
  const memClear = () => setMemory(0);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {}
  };

  return (
    <div className="scicalc-wrap">
      <div className="scicalc-header">
        <h3>Scientific Calculator</h3>
        <div className="scicalc-header-actions">
          <button className="small-btn" onClick={() => { setDisplay(""); setHistory([]); setMemory(0); }}>Reset</button>
          <button className="small-btn mode-btn" onClick={() => setAngleMode((m) => (m === "RAD" ? "DEG" : "RAD"))}>{angleMode}</button>
        </div>
      </div>

      <div className="scicalc-grid">
        <div className="scicalc-panel">
          <div className="display-top">
            <div className="display-info">
              <span className="info-label">Memory</span>
              <span className="info-value">{memory}</span>
            </div>
            <div className="display-info">
              <span className="info-label">Mode</span>
              <span className="info-value">{angleMode}</span>
            </div>
          </div>

          <input
            ref={displayRef}
            className="display"
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            placeholder="0"
          />

          <div className="btn-grid">
            {/* Row 1 - Clear & Brackets */}
            <button className="btn func clear-btn" onClick={() => { clearAll(); }}>AC</button>
            <button className="btn func" onClick={onBackspace}>DEL</button>
            <button className="btn func" onClick={() => insert('(')}>(</button>
            <button className="btn func" onClick={() => insert(')')}>)</button>
            <button className="btn func" onClick={() => insert('π')}>π</button>
            <button className="btn func" onClick={() => insert('e')}>e</button>

            {/* Row 2 - Trig Functions */}
            <button className="btn func" onClick={() => insert('sin(')}>sin</button>
            <button className="btn func" onClick={() => insert('cos(')}>cos</button>
            <button className="btn func" onClick={() => insert('tan(')}>tan</button>
            <button className="btn func" onClick={() => insert('asin(')}>asin</button>
            <button className="btn func" onClick={() => insert('acos(')}>acos</button>
            <button className="btn func" onClick={() => insert('atan(')}>atan</button>

            {/* Row 3 - Math Functions */}
            <button className="btn func" onClick={() => insert('log(')}>log</button>
            <button className="btn func" onClick={() => insert('ln(')}>ln</button>
            <button className="btn func" onClick={() => insert('√(')}>√</button>
            <button className="btn func" onClick={() => insert('^')}>^</button>
            <button className="btn func" onClick={() => insert('^2')}>x²</button>
            <button className="btn func" onClick={() => insert('exp(')}>exp</button>

            {/* Row 4 - Numbers & Memory */}
            <button className="btn num" onClick={() => insert('7')}>7</button>
            <button className="btn num" onClick={() => insert('8')}>8</button>
            <button className="btn num" onClick={() => insert('9')}>9</button>
            <button className="btn operator" onClick={() => insert('/')}>÷</button>
            <button className="btn func memory" onClick={memRecall}>MR</button>
            <button className="btn func memory" onClick={memClear}>MC</button>

            {/* Row 5 */}
            <button className="btn num" onClick={() => insert('4')}>4</button>
            <button className="btn num" onClick={() => insert('5')}>5</button>
            <button className="btn num" onClick={() => insert('6')}>6</button>
            <button className="btn operator" onClick={() => insert('*')}>×</button>
            <button className="btn func memory" onClick={memAdd}>M+</button>
            <button className="btn func memory" onClick={memSub}>M−</button>

            {/* Row 6 */}
            <button className="btn num" onClick={() => insert('1')}>1</button>
            <button className="btn num" onClick={() => insert('2')}>2</button>
            <button className="btn num" onClick={() => insert('3')}>3</button>
            <button className="btn operator" onClick={() => insert('-')}>−</button>
            <button className="btn func" onClick={() => insert('%')}>%</button>
            <button className="btn func" onClick={() => insert('.')}>.</button>

            {/* Row 7 */}
            <button className="btn num" onClick={() => insert('0')}>0</button>
            <button className="btn num" onClick={() => insert('00')}>00</button>
            <button className="btn equal" onClick={onCalculate}>=</button>
            <button className="btn operator" onClick={() => insert('+')}>+</button>
            <button className="btn func" onClick={() => { if (display) setDisplay(String(Math.pow(Number(display), 2))); }}>x²</button>
            <button className="btn func" onClick={() => { if (display) setDisplay(String(Math.sqrt(Number(display)))); }}>√</button>
          </div>

          <div className="footer">
            <button className="small-btn" onClick={() => copyToClipboard(display)}>Copy</button>
            <button className="small-btn" onClick={() => { if (history.length) { setDisplay(String(history[0].result)); } }}>Recall</button>
            <div className="entry-count">Entries: {history.length}</div>
          </div>
        </div>

        <div className="scicalc-panel history-panel">
          <h4>History</h4>
          <div className="history">
            {history.length === 0 && <div className="empty-history">No history yet — calculations will appear here.</div>}
            {history.map((h, idx) => (
              <div className="history-item" key={idx} onClick={() => setDisplay(String(h.result))}>
                <div className="history-expr">{h.expr}</div>
                <div className="history-result">{String(h.result)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

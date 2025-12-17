import React, { useState, useEffect } from "react";
import "./styles.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Currency list with flags & names
  const currencyInfo = {
    USD: "🇺🇸 US Dollar",
    INR: "🇮🇳 Indian Rupee",
    EUR: "🇪🇺 Euro",
    GBP: "🇬🇧 British Pound",
    JPY: "🇯🇵 Japanese Yen",
    AUD: "🇦🇺 Australian Dollar",
    CAD: "🇨🇦 Canadian Dollar",
    CHF: "🇨🇭 Swiss Franc",
    CNY: "🇨🇳 Chinese Yuan",
    SGD: "🇸🇬 Singapore Dollar",
    NZD: "🇳🇿 New Zealand Dollar",
    AED: "🇦🇪 UAE Dirham",
    SAR: "🇸🇦 Saudi Riyal",
    ZAR: "🇿🇦 South African Rand",
    MYR: "🇲🇾 Malaysian Ringgit",
    THB: "🇹🇭 Thai Baht",
    PKR: "🇵🇰 Pakistani Rupee",
    BDT: "🇧🇩 Bangladeshi Taka",
    BRL: "🇧🇷 Brazilian Real",
    RUB: "🇷🇺 Russian Ruble",
    HKD: "🇭🇰 Hong Kong Dollar",
    KRW: "🇰🇷 South Korean Won",
    IDR: "🇮🇩 Indonesian Rupiah",
    MXN: "🇲🇽 Mexican Peso",
    SEK: "🇸🇪 Swedish Krona",
    NOK: "🇳🇴 Norwegian Krone",
    DKK: "🇩🇰 Danish Krone",
    PLN: "🇵🇱 Polish Zloty",
    TRY: "🇹🇷 Turkish Lira",
    EGP: "🇪🇬 Egyptian Pound",
    KWD: "🇰🇼 Kuwaiti Dinar",
    BHD: "🇧🇭 Bahraini Dinar",
    QAR: "🇶🇦 Qatari Riyal",
  };

  const currencyList = Object.keys(currencyInfo);

  // ✅ Fetch live rates on component load or currency change
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await res.json();
        setRates(data.rates || {});
      } catch (err) {
        console.error("Error fetching rates", err);
        setError("Unable to fetch live rates. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  // ✅ Conversion Logic
  const handleConvert = () => {
    setError("");
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!rates[toCurrency]) {
      setError("Conversion rate not available.");
      return;
    }

    const converted = (parseFloat(amount) * rates[toCurrency]).toFixed(2);
    setResult(converted);
  };

  // ✅ Swap logic
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  return (
    <div className="currency-converter">
      <div className="card-header">
        <h2>Currency Converter</h2>
        <p className="subtext">Convert between 30+ global currencies instantly</p>
      </div>

      <div className="form-grid three">
        {/* Amount */}
        <div className="field">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* From Currency */}
        <div className="field">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencyList.map((code) => (
              <option key={code} value={code}>
                {currencyInfo[code]}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div className="field">
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencyList.map((code) => (
              <option key={code} value={code}>
                {currencyInfo[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="actions-row">
        <button className="btn swap" onClick={handleSwap}>
          🔁 Swap
        </button>
        <button className="btn swap" onClick={handleConvert} disabled={isLoading}>
          {isLoading ? "Loading..." : "💱 Convert"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Results */}
      {result && (
        <div className="results pro">
          <div className="result">
            <h4>
              {amount} {fromCurrency} = {result} {toCurrency}
            </h4>
            <p className="muted">
              1 {fromCurrency} = {rates[toCurrency].toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

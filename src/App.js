import React, { Component } from "react";
import "./App.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import $ from "jquery";
import subscriptionkey from "./config/subscriptionkey.js";
import subIndex from "./config/subscriptionkey.js";

const RECENT_SEARCHES_KEY = "recentSearches";

class App extends Component {
  constructor(props) {
    super(props);

    var defaultValue;
    var recentSearches = [];

    if (localStorage.getItem("symbol")) {
      defaultValue = localStorage.getItem("symbol").toUpperCase();
    } else {
      defaultValue = "";
    }

    if (defaultValue === undefined || defaultValue === "undefined") {
      defaultValue = "";
    }

    if (localStorage.getItem(RECENT_SEARCHES_KEY)) {
      try {
        recentSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY))
          .filter(
            (item, index, items) =>
              typeof item === "string" &&
              item.trim() &&
              items.indexOf(item) === index,
          )
          .slice(0, 10);
      } catch (error) {
        recentSearches = [];
      }
    }

    this.state = {
      symbol: defaultValue,
      recentSearches,
      stock: "",
      open: 0,
      high: 0,
      low: 0,
      date: "",
      close: 0,
      classicPP: 0.0,
      range: 0,
      x: 0,
      message: "",
      change: "",
      changeColor: "green",
      isLookupDisabled: false,
      lookupCountdown: 0,
    };

    this.enterSymbol = (event) => {
      this.setState({ symbol: event.target.value.toUpperCase() });
    };

    this.keyPress = (event) => {
      if (event.keyCode === 13) {
        this.setState(
          { symbol: event.target.value.toUpperCase() },
          this.handleLookupClick,
        );
      }
    };

    this.storeRecentSearch = (symbol) => {
      const normalizedSymbol = (symbol || "").trim().toUpperCase();

      if (!normalizedSymbol) {
        return;
      }

      this.setState((prevState) => {
        const updatedRecentSearches = [normalizedSymbol]
          .concat(
            prevState.recentSearches.filter(
              (item) => item !== normalizedSymbol,
            ),
          )
          .slice(0, 10);

        localStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(updatedRecentSearches),
        );

        return { recentSearches: updatedRecentSearches };
      });
    };

    var component = this;

    this.lookupCooldownTimer = null;

    this.startLookupCooldown = () => {
      if (this.lookupCooldownTimer) {
        return;
      }

      component.setState({ isLookupDisabled: true, lookupCountdown: 15 });

      this.lookupCooldownTimer = setInterval(() => {
        component.setState((prevState) => {
          if (prevState.lookupCountdown <= 1) {
            clearInterval(this.lookupCooldownTimer);
            this.lookupCooldownTimer = null;
            return { isLookupDisabled: false, lookupCountdown: 0 };
          }

          return { lookupCountdown: prevState.lookupCountdown - 1 };
        });
      }, 1000);
    };

    this.handleLookupClick = () => {
      const symbol = (component.state.symbol || "").trim().toUpperCase();

      if (component.state.isLookupDisabled || !symbol) {
        return;
      }

      component.setState({ symbol });
      this.storeRecentSearch(symbol);
      this.lookup(symbol);
      this.startLookupCooldown();
    };

    this.lookup = (symbolOverride) => {
      const symbol = (symbolOverride || component.state.symbol || "")
        .trim()
        .toUpperCase();

      if (!symbol) {
        component.setState({ message: "Enter a stock symbol to begin" });
        return;
      }

      component.setState({ message: "Crunching numbers...", symbol });
      $.ajax({
        url:
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          symbol +
          "&apikey=" +
          subscriptionkey,
        // component.state.symbol.toUpperCase()
        crossDomain: true,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          if (data.Information !== undefined) {
            component.setState({
              message: "Server error or busy. Please try again in a minute",
            });
          } else {
            // var info = data['Global Quote'];
            var stock = data["Global Quote"]["01. symbol"];
            var date =
              "Based on last trading session: " +
              data["Global Quote"]["07. latest trading day"];
            var high = parseFloat(data["Global Quote"]["03. high"]).toFixed(2);
            var low = parseFloat(data["Global Quote"]["04. low"]).toFixed(2);
            var open = parseFloat(data["Global Quote"]["02. open"]).toFixed(2);
            var close = parseFloat(data["Global Quote"]["05. price"]).toFixed(
              2,
            );
            var change =
              " ( $ " +
              parseFloat(data["Global Quote"]["09. change"]).toFixed(2) +
              " ) ";
            var classicPP = (
              (parseFloat(high) + parseFloat(low) + parseFloat(close)) /
              3
            ).toFixed(2);
            var range = (parseFloat(high) - parseFloat(low)).toFixed(2);
            var x;
            var changeColor = "";
            if (data["Global Quote"]["09. change"] >= 0) {
              changeColor = "green";
            }
            if (data["Global Quote"]["09. change"] < 0) {
              changeColor = "red";
            }
            if (open > high) {
              high = open;
            } //sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
            if (close > high) {
              high = close;
            } //sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
            if (open < low) {
              low = open;
            } //sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
            if (close < low) {
              low = close;
            } //sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
            if (close === "NaN") {
              component.setState({
                message: "Server error or busy. Please try again in a minute",
              });
            }

            if (parseFloat(close) > parseFloat(open)) {
              x = 2 * parseFloat(high) + parseFloat(low) + parseFloat(close);
            } else if (parseFloat(close) < parseFloat(open)) {
              x = parseFloat(high) + 2 * parseFloat(low) + parseFloat(close);
            } else if (parseFloat(close) === parseFloat(open)) {
              x = parseFloat(high) + parseFloat(low) + 2 * parseFloat(close);
            }
            component.setState({
              high,
              low,
              stock,
              close,
              open,
              date,
              classicPP,
              range,
              x,
              change,
              changeColor,
              message: date,
            });
            if (stock === undefined) {
              stock = "";
            }
            localStorage.setItem("symbol", stock);
          }
        },
        error: function (jqXHR, textStatus, error) {
          console.log("Post error: " + error);
          component.setState({
            message: "Server error or busy. Please try again in a minute",
          });
        },
      });
    };
  }

  componentDidMount() {
    if (localStorage.getItem("symbol")) {
      this.lookup();
    }
  }

  componentWillUnmount() {
    if (this.lookupCooldownTimer) {
      clearInterval(this.lookupCooldownTimer);
      this.lookupCooldownTimer = null;
    }
  }

  render() {
    const isSymbolEmpty = !this.state.symbol || !this.state.symbol.trim();
    const isLookupBlocked = this.state.isLookupDisabled || isSymbolEmpty;
    const formatLevel = (value) => {
      const parsedValue = parseFloat(value);

      return Number.isFinite(parsedValue)
        ? `$ ${parsedValue.toFixed(2)}`
        : "--";
    };
    const pivotRows = [
      {
        label: "Resistance 3",
        classic:
          parseFloat(this.state.classicPP) +
          2 * (parseFloat(this.state.high) - parseFloat(this.state.low)),
        camarilla:
          parseFloat(this.state.close) +
          (parseFloat(this.state.range) * 1.1) / 4,
        fibonacci: parseFloat(this.state.close) + parseFloat(this.state.range),
        demark: "--",
      },
      {
        label: "Resistance 2",
        classic:
          parseFloat(this.state.classicPP) +
          parseFloat(this.state.high) -
          parseFloat(this.state.low),
        camarilla:
          parseFloat(this.state.close) +
          (parseFloat(this.state.range) * 1.1) / 6,
        fibonacci:
          parseFloat(this.state.close) + parseFloat(this.state.range) * 0.618,
        demark: "--",
      },
      {
        label: "Resistance 1",
        classic:
          2 * parseFloat(this.state.classicPP) - parseFloat(this.state.low),
        camarilla:
          parseFloat(this.state.close) +
          (parseFloat(this.state.range) * 1.1) / 12,
        fibonacci:
          parseFloat(this.state.close) + parseFloat(this.state.range) * 0.382,
        demark: parseFloat(this.state.x) / 2 - parseFloat(this.state.low),
      },
      {
        label: "Pivot",
        classic: parseFloat(this.state.classicPP),
        camarilla: "--",
        fibonacci: parseFloat(this.state.classicPP),
        demark: parseFloat(this.state.x) / 4,
        isPivot: true,
      },
      {
        label: "Support 1",
        classic:
          2 * parseFloat(this.state.classicPP) - parseFloat(this.state.high),
        camarilla:
          parseFloat(this.state.close) -
          (parseFloat(this.state.range) * 1.1) / 12,
        fibonacci:
          parseFloat(this.state.close) - parseFloat(this.state.range) * 0.382,
        demark: parseFloat(this.state.x) / 2 - parseFloat(this.state.high),
      },
      {
        label: "Support 2",
        classic:
          parseFloat(this.state.classicPP) -
          parseFloat(this.state.high) +
          parseFloat(this.state.low),
        camarilla:
          parseFloat(this.state.close) -
          (parseFloat(this.state.range) * 1.1) / 6,
        fibonacci:
          parseFloat(this.state.close) - parseFloat(this.state.range) * 0.618,
        demark: "--",
      },
      {
        label: "Support 3",
        classic:
          parseFloat(this.state.classicPP) -
          2 * (parseFloat(this.state.high) - parseFloat(this.state.low)),
        camarilla:
          parseFloat(this.state.close) -
          (parseFloat(this.state.range) * 1.1) / 4,
        fibonacci: parseFloat(this.state.close) - parseFloat(this.state.range),
        demark: "--",
      },
    ];
    const mobileMethods = [
      {
        name: "Classic",
        className: "classic",
        values: pivotRows.map((row) => ({
          label: row.label,
          value: row.classic,
          isPivot: row.isPivot,
        })),
      },
      {
        name: "Camarilla",
        className: "camarilla",
        values: pivotRows.map((row) => ({
          label: row.label,
          value: row.camarilla,
          isPivot: row.isPivot,
        })),
      },
      {
        name: "Fibonacci",
        className: "fibonacci",
        values: pivotRows.map((row) => ({
          label: row.label,
          value: row.fibonacci,
          isPivot: row.isPivot,
        })),
      },
      {
        name: "DeMark",
        className: "demark",
        values: pivotRows
          .filter(
            (row) =>
              ![
                "Resistance 3",
                "Resistance 2",
                "Support 2",
                "Support 3",
              ].includes(row.label),
          )
          .map((row) => ({
            label: row.label,
            value: row.demark,
            isPivot: row.isPivot,
          })),
      },
    ];

    return (
      <div className="App">
        <div className="container">
          <div className="content">
            <div className="appHeader">
              <div className="appHeaderLeft">
                <div className="appHeaderMain">
                  <h1 className="appTitle"> Pivot Points </h1>
                  <p className="subtitle">
                    Find session levels fast with classic and alternative pivot
                    models.
                  </p>
                </div>

                <div className="lookupRow">
                  <TextField
                    className="symbolInput"
                    id="symbol"
                    type="text"
                    value={this.state.symbol}
                    onKeyDown={this.keyPress}
                    label="Stock Symbol"
                    helperText="Try symbols like AAPL, MSFT, SPY"
                    onChange={this.enterSymbol}
                    inputProps={{ "aria-label": "Stock Symbol" }}
                  />
                  <Button
                    size="medium"
                    id="button"
                    className="lookupButton"
                    variant="contained"
                    color="primary"
                    onClick={this.handleLookupClick}
                    disabled={isLookupBlocked}
                  >
                    {" "}
                    {this.state.isLookupDisabled
                      ? `Retry in ${this.state.lookupCountdown}s`
                      : "Look up"}{" "}
                  </Button>
                </div>
              </div>

              <aside
                className="recentSearchesPanel"
                aria-label="Recent searches"
              >
                <h2 className="recentSearchesTitle">Recent searches</h2>
                {this.state.recentSearches.length ? (
                  <div className="recentSearchesList">
                    {this.state.recentSearches.map((recentSymbol) => (
                      <button
                        type="button"
                        className="recentSearchChip"
                        key={recentSymbol}
                        onClick={() => this.setState({ symbol: recentSymbol })}
                      >
                        {recentSymbol}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="recentSearchesEmpty">
                    Your last ten unique symbols will show here.
                  </p>
                )}
              </aside>
            </div>

            <div aria-live="polite" className="liveStatus">
              {" "}
              <span id="message"> {this.state.message}</span>
              <span style={{ color: this.state.changeColor }}>
                {" "}
                {this.state.change}{" "}
              </span>
            </div>

            <div className="statsRow">
              <span className="stats">High: $ {this.state.high} </span>
              <span className="stats">Low: $ {this.state.low} </span>
              <span className="stats">Open: $ {this.state.open} </span>
              <span className="stats">Close: $ {this.state.close} </span>
            </div>
            <hr className="divider" />
            <section className="tableSection">
              <div className="tableIntro">
                <h2 className="tableSubtitle">
                  Compare support, resistance, and pivot levels across the four
                  calculation methods.
                </h2>
              </div>
              <div className="pivotTableWrapper">
                <table className="pivotTable">
                  <thead>
                    <tr>
                      <th scope="col">Level</th>
                      <th scope="col">Classic</th>
                      <th scope="col">Camarilla</th>
                      <th scope="col">Fibonacci</th>
                      <th scope="col">DeMark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pivotRows.map((row) => (
                      <tr
                        key={row.label}
                        className={row.isPivot ? "pivotRow" : ""}
                      >
                        <th scope="row">{row.label}</th>
                        <td>{formatLevel(row.classic)}</td>
                        <td>{formatLevel(row.camarilla)}</td>
                        <td>{formatLevel(row.fibonacci)}</td>
                        <td>{formatLevel(row.demark)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobilePivotCards">
                {mobileMethods.map((method) => (
                  <article
                    className={`mobilePivotCard mobilePivotCard--${method.className}`}
                    key={method.name}
                  >
                    <h3 className="mobilePivotTitle">{method.name}</h3>
                    <div className="mobilePivotList">
                      {method.values.map((item) => (
                        <div
                          className={
                            item.isPivot
                              ? "mobilePivotItem mobilePivotItemHighlight"
                              : "mobilePivotItem"
                          }
                          key={`${method.name}-${item.label}`}
                        >
                          <span className="mobilePivotLabel">{item.label}</span>
                          <span className="mobilePivotValue">
                            {formatLevel(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <hr className="divider" />
            <div className="footnote">
              ** Pivot Point data is only accurate before/after trading hours **
            </div>
          </div>
          <div className="versionFootnote">2026 version 0.1.{subIndex}</div>
        </div>
      </div>
    );
  }
}

export default App;

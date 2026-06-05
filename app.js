(() => {
  const RECENT_SEARCHES_KEY = 'recentSearches';

  const apiKeys = ['XUH8ZUK3OVO9R8K8', 'Q8C6TGMUFWS1F5AH', 'HGW8JD955DCWQ14S'];
  const apiKeyIndex = Math.floor(Math.random() * apiKeys.length);
  const apiKey = apiKeys[apiKeyIndex];

  const state = {
    symbol: '',
    recentSearches: [],
    stock: '',
    open: 0,
    high: 0,
    low: 0,
    date: '',
    close: 0,
    classicPP: 0,
    range: 0,
    x: 0,
    message: '',
    change: '',
    changeColor: 'green',
    isLookupDisabled: false,
    lookupCountdown: 0,
  };

  let lookupCooldownTimer = null;

  const elements = {
    symbolInput: document.getElementById('symbol'),
    lookupButton: document.getElementById('lookupButton'),
    message: document.getElementById('message'),
    highStat: document.getElementById('highStat'),
    lowStat: document.getElementById('lowStat'),
    openStat: document.getElementById('openStat'),
    closeStat: document.getElementById('closeStat'),
    recentSearchesList: document.getElementById('recentSearchesList'),
    recentSearchesEmpty: document.getElementById('recentSearchesEmpty'),
    pivotTableBody: document.getElementById('pivotTableBody'),
    mobilePivotCards: document.getElementById('mobilePivotCards'),
    versionFootnote: document.getElementById('versionFootnote'),
  };

  const formatPrice = (value) => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      return '--';
    }
    return `$ ${parsed.toFixed(2)}`;
  };

  const getPivotRows = () => [
    {
      label: 'Resistance 3',
      classic: Number.parseFloat(state.classicPP) + 2 * (Number.parseFloat(state.high) - Number.parseFloat(state.low)),
      camarilla: Number.parseFloat(state.close) + (Number.parseFloat(state.range) * 1.1) / 4,
      fibonacci: Number.parseFloat(state.close) + Number.parseFloat(state.range),
      demark: '--',
    },
    {
      label: 'Resistance 2',
      classic: Number.parseFloat(state.classicPP) + Number.parseFloat(state.high) - Number.parseFloat(state.low),
      camarilla: Number.parseFloat(state.close) + (Number.parseFloat(state.range) * 1.1) / 6,
      fibonacci: Number.parseFloat(state.close) + Number.parseFloat(state.range) * 0.618,
      demark: '--',
    },
    {
      label: 'Resistance 1',
      classic: 2 * Number.parseFloat(state.classicPP) - Number.parseFloat(state.low),
      camarilla: Number.parseFloat(state.close) + (Number.parseFloat(state.range) * 1.1) / 12,
      fibonacci: Number.parseFloat(state.close) + Number.parseFloat(state.range) * 0.382,
      demark: Number.parseFloat(state.x) / 2 - Number.parseFloat(state.low),
    },
    {
      label: 'Pivot',
      classic: Number.parseFloat(state.classicPP),
      camarilla: '--',
      fibonacci: Number.parseFloat(state.classicPP),
      demark: Number.parseFloat(state.x) / 4,
      isPivot: true,
    },
    {
      label: 'Support 1',
      classic: 2 * Number.parseFloat(state.classicPP) - Number.parseFloat(state.high),
      camarilla: Number.parseFloat(state.close) - (Number.parseFloat(state.range) * 1.1) / 12,
      fibonacci: Number.parseFloat(state.close) - Number.parseFloat(state.range) * 0.382,
      demark: Number.parseFloat(state.x) / 2 - Number.parseFloat(state.high),
    },
    {
      label: 'Support 2',
      classic: Number.parseFloat(state.classicPP) - Number.parseFloat(state.high) + Number.parseFloat(state.low),
      camarilla: Number.parseFloat(state.close) - (Number.parseFloat(state.range) * 1.1) / 6,
      fibonacci: Number.parseFloat(state.close) - Number.parseFloat(state.range) * 0.618,
      demark: '--',
    },
    {
      label: 'Support 3',
      classic: Number.parseFloat(state.classicPP) - 2 * (Number.parseFloat(state.high) - Number.parseFloat(state.low)),
      camarilla: Number.parseFloat(state.close) - (Number.parseFloat(state.range) * 1.1) / 4,
      fibonacci: Number.parseFloat(state.close) - Number.parseFloat(state.range),
      demark: '--',
    },
  ];

  const getMobileMethods = (pivotRows) => [
    {
      name: 'Classic',
      className: 'classic',
      values: pivotRows.map((row) => ({ label: row.label, value: row.classic, isPivot: row.isPivot })),
    },
    {
      name: 'Camarilla',
      className: 'camarilla',
      values: pivotRows.map((row) => ({ label: row.label, value: row.camarilla, isPivot: row.isPivot })),
    },
    {
      name: 'Fibonacci',
      className: 'fibonacci',
      values: pivotRows.map((row) => ({ label: row.label, value: row.fibonacci, isPivot: row.isPivot })),
    },
    {
      name: 'DeMark',
      className: 'demark',
      values: pivotRows
        .filter((row) => !['Resistance 3', 'Resistance 2', 'Support 2', 'Support 3'].includes(row.label))
        .map((row) => ({ label: row.label, value: row.demark, isPivot: row.isPivot })),
    },
  ];

  const renderRecentSearches = () => {
    elements.recentSearchesList.innerHTML = '';

    if (!state.recentSearches.length) {
      elements.recentSearchesEmpty.style.display = 'block';
      return;
    }

    elements.recentSearchesEmpty.style.display = 'none';

    state.recentSearches.forEach((recentSymbol) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recentSearchChip';
      chip.textContent = recentSymbol;
      chip.addEventListener('click', () => {
        state.symbol = recentSymbol;
        render();
      });
      elements.recentSearchesList.appendChild(chip);
    });
  };

  const renderPivotTable = (pivotRows) => {
    elements.pivotTableBody.innerHTML = '';

    pivotRows.forEach((row) => {
      const tr = document.createElement('tr');
      if (row.isPivot) {
        tr.className = 'pivotRow';
      }

      const labelCell = document.createElement('th');
      labelCell.scope = 'row';
      labelCell.textContent = row.label;
      tr.appendChild(labelCell);

      ['classic', 'camarilla', 'fibonacci', 'demark'].forEach((key) => {
        const td = document.createElement('td');
        td.textContent = formatPrice(row[key]);
        tr.appendChild(td);
      });

      elements.pivotTableBody.appendChild(tr);
    });
  };

  const renderMobileCards = (pivotRows) => {
    const methods = getMobileMethods(pivotRows);
    elements.mobilePivotCards.innerHTML = '';

    methods.forEach((method) => {
      const article = document.createElement('article');
      article.className = `mobilePivotCard mobilePivotCard--${method.className}`;

      const title = document.createElement('h3');
      title.className = 'mobilePivotTitle';
      title.textContent = method.name;

      const list = document.createElement('div');
      list.className = 'mobilePivotList';

      method.values.forEach((item) => {
        const row = document.createElement('div');
        row.className = item.isPivot ? 'mobilePivotItem mobilePivotItemHighlight' : 'mobilePivotItem';

        const label = document.createElement('span');
        label.className = 'mobilePivotLabel';
        label.textContent = item.label;

        const value = document.createElement('span');
        value.className = 'mobilePivotValue';
        value.textContent = formatPrice(item.value);

        row.append(label, value);
        list.appendChild(row);
      });

      article.append(title, list);
      elements.mobilePivotCards.appendChild(article);
    });
  };

  const render = () => {
    const isSymbolEmpty = !state.symbol || !state.symbol.trim();
    const isLookupBlocked = state.isLookupDisabled || isSymbolEmpty;

    elements.symbolInput.value = state.symbol;
    elements.lookupButton.disabled = isLookupBlocked;
    elements.lookupButton.textContent = state.isLookupDisabled ? `Retry in ${state.lookupCountdown}s` : 'Look up';

    elements.message.textContent = state.message;
    elements.message.style.color = state.changeColor;

    elements.highStat.textContent = `High: $ ${state.high}`;
    elements.lowStat.textContent = `Low: $ ${state.low}`;
    elements.openStat.textContent = `Open: $ ${state.open}`;
    elements.closeStat.textContent = `Close: $ ${state.close}`;

    const pivotRows = getPivotRows();
    renderRecentSearches();
    renderPivotTable(pivotRows);
    renderMobileCards(pivotRows);

    elements.versionFootnote.textContent = `2026 version 0.1.${apiKeyIndex}`;
  };

  const storeRecentSearch = (symbol) => {
    const normalizedSymbol = (symbol || '').trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    const updated = [normalizedSymbol, ...state.recentSearches.filter((item) => item !== normalizedSymbol)].slice(0, 10);

    state.recentSearches = updated;
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const startLookupCooldown = () => {
    if (lookupCooldownTimer) {
      return;
    }

    state.isLookupDisabled = true;
    state.lookupCountdown = 15;
    render();

    lookupCooldownTimer = setInterval(() => {
      if (state.lookupCountdown <= 1) {
        clearInterval(lookupCooldownTimer);
        lookupCooldownTimer = null;
        state.isLookupDisabled = false;
        state.lookupCountdown = 0;
      } else {
        state.lookupCountdown -= 1;
      }
      render();
    }, 1000);
  };

  const setServerErrorMessage = () => {
    state.message = 'Server error or busy. Please try again in a minute';
    render();
  };

  const lookup = async (symbolOverride) => {
    const symbol = (symbolOverride || state.symbol || '').trim().toUpperCase();

    if (!symbol) {
      state.message = 'Enter a stock symbol to begin';
      render();
      return;
    }

    state.symbol = symbol;
    state.message = 'Crunching numbers...';
    render();

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
      );
      const data = await response.json();

      if (!response.ok || data.Information !== undefined || !data['Global Quote']) {
        setServerErrorMessage();
        return;
      }

      const quote = data['Global Quote'];
      let stock = quote['01. symbol'];
      const date = `Based on last trading session: ${quote['07. latest trading day']}`;

      let high = Number.parseFloat(quote['03. high']);
      let low = Number.parseFloat(quote['04. low']);
      const open = Number.parseFloat(quote['02. open']);
      const close = Number.parseFloat(quote['05. price']);
      const change = Number.parseFloat(quote['09. change']);

      if (!Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close)) {
        setServerErrorMessage();
        return;
      }

      if (open > high) high = open;
      if (close > high) high = close;
      if (open < low) low = open;
      if (close < low) low = close;

      let x = 0;
      if (close > open) {
        x = 2 * high + low + close;
      } else if (close < open) {
        x = high + 2 * low + close;
      } else {
        x = high + low + 2 * close;
      }

      state.high = high.toFixed(2);
      state.low = low.toFixed(2);
      state.open = open.toFixed(2);
      state.close = close.toFixed(2);
      state.stock = stock;
      state.date = date;
      state.classicPP = ((high + low + close) / 3).toFixed(2);
      state.range = (high - low).toFixed(2);
      state.x = x;
      state.change = ` ( $ ${Number.isFinite(change) ? change.toFixed(2) : '0.00'} ) `;
      state.changeColor = Number.isFinite(change) && change < 0 ? 'red' : 'green';
      state.message = date;

      if (stock === undefined) {
        stock = '';
      }

      localStorage.setItem('symbol', stock);
      render();
    } catch {
      setServerErrorMessage();
    }
  };

  const handleLookupClick = () => {
    const symbol = (state.symbol || '').trim().toUpperCase();

    if (state.isLookupDisabled || !symbol) {
      return;
    }

    state.symbol = symbol;
    storeRecentSearch(symbol);
    lookup(symbol);
    startLookupCooldown();
  };

  const initializeState = () => {
    let defaultSymbol = localStorage.getItem('symbol') ? localStorage.getItem('symbol').toUpperCase() : '';
    if (defaultSymbol === undefined || defaultSymbol === 'undefined') {
      defaultSymbol = '';
    }

    let recentSearches = [];
    const rawRecentSearches = localStorage.getItem(RECENT_SEARCHES_KEY);

    if (rawRecentSearches) {
      try {
        recentSearches = JSON.parse(rawRecentSearches)
          .filter((item, index, items) => typeof item === 'string' && item.trim() && items.indexOf(item) === index)
          .slice(0, 10);
      } catch {
        recentSearches = [];
      }
    }

    state.symbol = defaultSymbol;
    state.recentSearches = recentSearches;
    state.message = defaultSymbol ? 'Loading previous symbol...' : 'Enter a stock symbol to begin';
  };

  const attachEventListeners = () => {
    elements.symbolInput.addEventListener('input', (event) => {
      state.symbol = event.target.value.toUpperCase();
      render();
    });

    elements.symbolInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        state.symbol = event.target.value.toUpperCase();
        handleLookupClick();
      }
    });

    elements.lookupButton.addEventListener('click', handleLookupClick);

    window.addEventListener('beforeunload', () => {
      if (lookupCooldownTimer) {
        clearInterval(lookupCooldownTimer);
      }
    });
  };

  initializeState();
  attachEventListeners();
  render();

  if (localStorage.getItem('symbol')) {
    lookup();
  }
})();

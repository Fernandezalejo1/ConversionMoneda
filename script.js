document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://api.exchangerate-api.com/v4/latest/USD';
    const conversionForm = document.getElementById('conversionForm');
    const buyForm = document.getElementById('buyForm');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const result = document.getElementById('result');
    const historyList = document.getElementById('history');
    const buyResult = document.getElementById('buyResult');

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            currencies.forEach(currency => {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency;
                optionFrom.textContent = currency;
                fromCurrency.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = currency;
                optionTo.textContent = currency;
                toCurrency.appendChild(optionTo);
            });
        });

    conversionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amount = document.getElementById('amount').value;

        fetch(`${apiURL}?base=${from}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[to];
                const convertedAmount = (amount * rate).toFixed(2);
                const date = new Date().toLocaleString();
                const operationId = `OP-${Date.now()}`;

                result.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;

                const conversion = {
                    date,
                    from,
                    to,
                    amount,
                    convertedAmount,
                    rate,
                    operationId
                };

                saveConversion(conversion);
                displayHistory();
            });
    });

    buyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('buyAmount').value;
        const cbu = document.getElementById('cbu').value;

        buyResult.textContent = `Transaction successful! ${amount} has been transferred to your account with CBU/Swift: ${cbu}`;
        buyForm.reset();
    });

    function saveConversion(conversion) {
        let conversions = JSON.parse(localStorage.getItem('conversions')) || [];
        conversions.push(conversion);
        localStorage.setItem('conversions', JSON.stringify(conversions));
    }

    function displayHistory() {
        historyList.innerHTML = '';
        const conversions = JSON.parse(localStorage.getItem('conversions')) || [];
        conversions.forEach(conversion => {
            const li = document.createElement('li');
            li.textContent = `[${conversion.date}] ${conversion.amount} ${conversion.from} to ${conversion.to} at rate ${conversion.rate} - ID: ${conversion.operationId}`;
            historyList.appendChild(li);
        });
    }

    displayHistory();
});

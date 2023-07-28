document.querySelector('form').addEventListener('submit', validate);

function validate(e) {
    e.preventDefault();
    let [totalInputField, providedInputField] = document.getElementsByTagName('input');

    let priceRegex = new RegExp(/^(0\.[0-9]{1,2})?([1-9]+[0-9]*(,[0-9]{3})*)(\.[0-9]{1,2})?$/gm);
    let total = totalInputField.value;
    total = total.replaceAll(/\s+/g, '');
    let provided = providedInputField.value;
    provided = provided.replaceAll(/\s+/g, '');

    let validTotal = false;
    let validProvided = false;
    if (total == '' || !total.match(priceRegex)) {
        totalInputField.setAttribute('class', 'error');
    } else {
        totalInputField.removeAttribute('class');
        validTotal = true;
    }

    if (provided == '' || !provided.match(priceRegex)) {
        providedInputField.setAttribute('class', 'error');
    } else {
        providedInputField.removeAttribute('class');
        validProvided = true;
    }

    let errorMsg = document.getElementById('errMsg');
    if (!validTotal || !validProvided) {
        errorMsg.style.visibility = 'visible';
    } else {
        errorMsg.style.visibility = 'hidden';
    }

    if (validTotal && validProvided) {
        getResult(total, provided);
    }
}

function getResult(total, provided) {
    fetch('http://localhost:80/cash-register/calculate.php', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ total, provided })
    }).then(res => {
        if (res.status != 200) {
            console.log(res.status);
            return;
        }

        return res.json();
    }).then(data => {
        if (data != undefined) {
            showResult(data);
        }
    })
}

function showResult(data) {
    let change = data['change'];
    let bills = data['bills'];
    let coins = data['coins'];
    let changeP = document.getElementById('change');
    changeP.textContent = change.toFixed(2);
    if (change > 0) {
        let tds = document.getElementsByTagName('td');
        let i = tds.length - 1;
        for (let val in coins) {
            tds[i--].textContent = coins[val];
        }
        for (let val in bills) {
            tds[i--].textContent = bills[val];
        }
        document.getElementById('denominations').removeAttribute('hidden');
    }
}
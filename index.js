document.querySelector('form').addEventListener('submit', validate);

function validate(e) {
    e.preventDefault();
    let [total, provided] = document.getElementsByTagName('input');

    if (!checkFields(total, provided)) {
        return;
    }

    fetch('http://localhost:80/cash-register/calculate.php', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ 'total': total.value, 'provided': provided.value })
    }).then(res => {
        if (res.status != 200) {
            return;
        }

        return res.json();
    }).then(data => {
        if (data != undefined) {
            showResult(data);
        }
    })

}

function checkFields(totalInputField, providedInputField) {
    let priceRegex = new RegExp(/^([0-9]*,?[0-9]*)*.?[0-9]{0,2}$/gm);
    let total = totalInputField.value;
    let provided = providedInputField.value;

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

    return validTotal && validProvided;
}

function showResult(data) {
    console.log(data['change']);
    console.log(data['bills']);
    console.log(data['coins']);
}
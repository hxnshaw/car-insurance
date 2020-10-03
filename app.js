//variables
const html = new HTMLUI();
const form = document.getElementById('request-quote');



//event listeners
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', function () {
        html.displayYears();
        const spinner = document.querySelector('#loading img');
        spinner.style.display = 'none';
    })
}

//after generating the years, the following happen when the form is submitted
form.addEventListener('submit', function (e) {
    e.preventDefault();


    //read the values from the form
    const make = document.getElementById('make').value;
    const year = document.getElementById('year').value;
    const level = document.querySelector('input[name=level]:checked').value;
    if (make === '' || year === '' || level === '') {
        html.displayError('All Fields Are Mandatory!');
    } else {
        const prevResult = document.querySelector('#result div');
        if (prevResult != null) {
            //remove previous results from the screen
            prevResult.remove();
        }
        //make the quotation
        const insurance = new Insurance(make, year, level);
        const price = insurance.calculateQuotation(insurance);

        html.showResults(price, insurance);
    }
})


//classes
function HTMLUI() { }


HTMLUI.prototype.displayYears = function () {
    //get the max and minimum year
    const max = new Date().getFullYear(),
        min = max - 20;

    //generate the select option with the last 20 years
    const selectYears = document.getElementById('year');

    //print the values
    for (i = max; i >= min; i--) {
        //create option
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYears.appendChild(option);

    }
}

HTMLUI.prototype.displayError = function (message) {
    const div = document.createElement('div');
    div.classList = 'error';
    //insert the error message
    div.innerHTML = `<p>${message}</p>`;

    document.querySelector('.right').insertBefore(div, document.querySelector('.form-group'));
    setTimeout(() => {
        document.querySelector('.error').remove();
    }, 3000);

}

HTMLUI.prototype.showResults = function (price, insurance) {
    //get the parent element you will append the result to
    const result = document.getElementById('result');

    //create the div for the result
    const div = document.createElement('div');

    //get the make and print a readable value
    let make = insurance.make;

    switch (make) {
        case '1':
            make = 'American';

            break;
        case '2':
            make = 'Asian';

            break;
        case '3':
            make = 'European';

            break;

    }
    div.innerHTML = `
        <h1>Summary</h1>
        <p>Make:${make}</p>
    <p>Year:${insurance.year}</p>    
    <p>Level:${insurance.level}</p> 
    <p> Total:$ ${price}</p>   
 
    `;
    const spinner = document.querySelector('#loading img');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        result.appendChild(div);
    }, 2000);
}

//insurance
function Insurance(make, year, level) {
    this.make = make;
    this.year = year;
    this.level = level;
}

Insurance.prototype.calculateQuotation = function (insurance) {
    let price;
    const base = 2000;

    //get the make
    const make = insurance.make;
    /*
    
    1=American 15%
    2=Asian=05%
    3=European=35%


    */
    switch (make) {
        case '1':
            price = base * 1.15;

            break;
        case '2':
            price = base * 1.05;

            break;
        case '3':
            price = base * 1.35;

            break;

    }

    //get the year
    const year = insurance.year;
    const difference = this.getYearDifference(year);

    //each year the insurance gets cheaper by 3%
    price = price - ((difference * 3) * price) / 100;

    //factor in the level of protection
    const level = insurance.level;
    price = this.calculateLevel(price, level);

    return price;
}

Insurance.prototype.getYearDifference = function (year) {
    return new Date().getFullYear() - year;
}

Insurance.prototype.calculateLevel = function (price, level) {
    /*
    Basic insurance will increase the value by 30%
    Complete insurance will increase the value by 50%
    */
    if (level === 'basic') {
        price = price * 1.30;
    } else {
        price = price * 1.50;
    }
    return price;
}
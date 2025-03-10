const formElement = document.getElementById('form-element');
const inputField = document.getElementById('input-field');
const errorDisplay = document.getElementById('error-display');
const loadingStatus = document.getElementById('loading-status');
const infoContainer = document.getElementById('info-container');
const nameDisplay = document.getElementById('name-display');
const capitalCity = document.getElementById('capital-city');
const totalPopulation = document.getElementById('total-population');
const areaRegion = document.getElementById('area-region');
const countryFlag = document.getElementById('country-flag');
const neighborList = document.getElementById('neighbor-list');
const noNeighborMessage = document.getElementById('no-neighbor-message');

formElement.addEventListener('submit', function(event) {
    event.preventDefault();

    const countryInput = inputField.value.trim();
    if (!countryInput) return;

    fetchCountryInfo(countryInput);
});

async function fetchCountryInfo(country) {
    errorDisplay.textContent = '';
    loadingStatus.textContent = 'Loading...';
    infoContainer.style.display = 'none';
    neighborList.innerHTML = '';

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

        if (!response.ok) {
            throw new Error('Country not found. Please check the spelling and try again.');
        }

        const data = await response.json();
        const countryData = data[0];

        displayCountryDetails(countryData);

        if (countryData.borders && countryData.borders.length > 0) {
            noNeighborMessage.style.display = 'none';
            await fetchNeighborCountries(countryData.borders);
        } else {
            noNeighborMessage.style.display = 'block';
        }

        infoContainer.style.display = 'block';
        loadingStatus.textContent = '';

    } catch (error) {
        errorDisplay.textContent = error.message || 'An error occurred. Please try again.';
        loadingStatus.textContent = '';
    }
}

function displayCountryDetails(countryData) {
    nameDisplay.textContent = countryData.name.common;
    capitalCity.textContent = countryData.capital ? countryData.capital[0] : 'Not available';
    totalPopulation.textContent = countryData.population.toLocaleString();
    areaRegion.textContent = countryData.region;
    
    countryFlag.src = countryData.flags.png;
    countryFlag.alt = `Flag of ${countryData.name.common}`;
}

async function fetchNeighborCountries(borderCodes) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`);

        if (!response.ok) {
            throw new Error('Failed to fetch neighboring countries');
        }

        const borderCountries = await response.json();

        borderCountries.forEach(country => {
            const neighborRow = document.createElement('div');
            neighborRow.className = 'neighbor-row';

            const nameElement = document.createElement('div');
            nameElement.className = 'neighbor-name';
            nameElement.textContent = `${country.name.common}:`;

            const flagElement = document.createElement('div');
            flagElement.className = 'neighbor-flag';

            const flagImage = document.createElement('img');
            flagImage.src = country.flags.png;
            flagImage.alt = `Flag of ${country.name.common}`;

            flagElement.appendChild(flagImage);
            neighborRow.appendChild(nameElement);
            neighborRow.appendChild(flagElement);
            neighborList.appendChild(neighborRow);
        });

    } catch (error) {
        console.error('Error fetching neighboring countries:', error);
        const errorElement = document.createElement('p');
        errorElement.textContent = 'Failed to load neighboring countries.';
        errorElement.style.color = 'red';
        neighborList.appendChild(errorElement);
    }
}

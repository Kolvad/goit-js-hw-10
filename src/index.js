import './css/styles.css';
const DEBOUNCE_DELAY = 300;

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const API_URL = 'https://restcountries.com/v2/name/';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

async function onSearchInput() {
  const searchQuery = searchBox.value.trim();
  if (searchQuery.length === 0) {
    clearData();
    return;
  }

  try {
    const response = await fetch(`${API_URL}${searchQuery}`);
    const data = await response.json();
    handleSearchResult(data);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Oops, there was an error. Please try again later.'
    );
  }
}

function handleSearchResult(data) {
  if (data.status === 404) {
    clearData();
    Notiflix.Notify.failure('Oops, there is no country with that name.');
    return;
  }

  if (data.length > 10) {
    clearData();
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (data.length > 1) {
    renderCountryList(data);
    clearCountryInfo();
    return;
  }

  if (data.length === 1) {
    renderCountryInfo(data[0]);
    clearCountryList();
    return;
  }
}

function renderCountryList(data) {
  const countriesHTML = data
    .map(
      ({ flag, name }) => `
    <li>
      <img src="${flag}" alt="${name} flag" width="50">
      <span>${name}</span>
    </li>
  `
    )
    .join('');

  countryList.innerHTML = countriesHTML;
}

function renderCountryInfo(country) {
  const { flag, name, capital, population, languages } = country;

  const languagesList = languages.map(({ name }) => name).join(', ');

  const countryHTML = `
    <div class="country">
      <img src="${flag}" alt="${name} flag" width="200">
      <h2>${name}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${languagesList}</p>
    </div>
  `;

  countryInfo.innerHTML = countryHTML;
}

function clearData() {
  clearCountryList();
  clearCountryInfo();
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

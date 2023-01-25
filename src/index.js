import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function handleInput() {
  clearItems();
  if (input.value.trim() === '') {
    return;
  } else {
    fetchCountries(input.value.trim())
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length <= 10 && countries.length > 1) {
          countries.forEach(country => renderCountryList(country));
        } else {
          countries.forEach(country => renderCountryInfo(country));
        }
      })
      .catch(err => {
        console.log(err);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountryList(country) {
  countryList.insertAdjacentHTML(
    'beforeend',
    `<li class="country-list__item">
          <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
          <p>${country.name.common}</p>
         </li>`
  );
}

function renderCountryInfo(country) {
  countryInfo.innerHTML = `
    <div class="container">
      <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
      <h2>${country.name.common}</h2></div>
      <p><span class="bold">Capital:&nbsp;</span>${country.capital}</p>
      <p><span class="bold">Population:&nbsp;</span>${country.population}</p>
      <p><span class="bold">Languages:&nbsp;</span>${Object.values(
        country.languages
      )}</>
      `;
}

function clearItems() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

// api.js
const BASE_URL = 'https://apimocha.com/quicksell/data';

export async function fetchData() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

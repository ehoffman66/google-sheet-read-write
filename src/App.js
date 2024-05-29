import React, { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';

function App() {
  const [responseBody, setResponseBody] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!navigator.onLine) {
      console.error('Browser is offline');
    } else {
      fetch('http://localhost:3001/readSheet') // replace with your server's endpoint
        .then(response => 
          response.json().then(data => {
            if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
            }
            console.log(data); // Log the data to the console
            return data;
          })
        )
        .then(data => setResponseBody(data))
        .catch(error => console.error('Fetch error: ', error));
    }
  }, []);

  return (
    <div className="App grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-4" style={{backgroundColor: '#EAE7DC'}}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center mb-4">
            <img src={process.env.PUBLIC_URL + '/images/boar.png'} alt="Pour Boar" className="w-16 h-16 mr-4" />          <div>
            <h1 className="text-6xl font-bold">Pour Boar</h1>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4 mt-5">Search Coktails</h2>
        <input
          type="text"
          placeholder="Search by cocktail name or base sprit..."
          className="p-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {responseBody.filter(cocktail => 
        (cocktail['Cocktail'] && cocktail['Cocktail'].toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cocktail['Base Spirit'] && cocktail['Base Spirit'].toLowerCase().includes(searchTerm.toLowerCase()))
      ).map((cocktail, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4 inline-flex items-center">
            {cocktail['Cocktail']} 
            <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium" style={{backgroundColor: '#E98074', color: 'white'}}>
              {cocktail['Base Spirit']}
            </span>
          </h2>
          <p className="text-gray-600 mb-2 font-bold">Ingredients:</p>
            <Listbox as="ul" className="mb-2">
              {cocktail['Ingredients'] && cocktail['Ingredients'].trim() !== '' ?
                cocktail['Ingredients'].replace(/[\[\]']+/g,'').split(',').map((ingredient, i) => (
                  <div key={i} className="block pl-4">
                    <span className="text-lg pr-2">·</span>
                    <Listbox.Option as="li" className="text-gray-600 bg-gray-200 rounded px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2 inline-block">{ingredient.trim()}</Listbox.Option>
                  </div>
                ))
                : <li className="text-gray-600">No ingredients listed</li>
              }
            </Listbox>
          <p>
            <span className="text-gray-600 font-bold">Garnish:</span> {cocktail['Garnish']}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
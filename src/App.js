import React, { Fragment, useEffect, useState, useRef } from 'react';
import {Tab, Dialog, Transition } from '@headlessui/react';
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

function App() {
  const [responseBody, setResponseBody] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef();

  const handleAddCocktail = (e) => {
    e.preventDefault();
    console.log('Add cocktail form submitted');

    // Simulate an async operation (e.g., API call)
    new Promise((resolve) => {
      console.log('handleAddCocktail called');
      resolve();
    })
    .then(() => {
      // Simulate a click on the PopoverButton to close the popover
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    });
  }

  useEffect(() => {
    document.title = "Pour Boar Cocktails";
  }, []);

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
      <div className="App" style={{backgroundColor: '#EAE7DC'}}> 
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 text-center">
          <div className="flex justify-center mb-4">
            <img src={process.env.PUBLIC_URL + '/images/boar.png'} alt="Pour Boar" className="w-32 h-32 mr-4" />
            <div>
              <h1 className="text-9xl font-bold">Pour Boar</h1>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4 mt-5">Search Cocktails</h2>
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Search by cocktail name or base spirit..."
              className="p-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-4" style={{backgroundColor: '#EAE7DC'}}>
        {responseBody
          .filter(cocktail => 
            (cocktail['Cocktail'] && cocktail['Cocktail'].toLowerCase().includes(searchTerm.toLowerCase())) ||
            (cocktail['Base Spirit'] && cocktail['Base Spirit'].toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .filter(cocktail => cocktail['Ingredients'] && cocktail['Ingredients'].trim() !== '')
          .map((cocktail, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-1">
            <h2 className="text-5xl font-bold mb-4">
              {cocktail['Cocktail']}
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium" style={{backgroundColor: '#E98074', color: 'white'}}>
                  {cocktail['Base Spirit']}
                </span>
              </div>
            </h2>
  
            <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 rounded-xl">
              <Tab className={({ selected }) => selected ? 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg border-b-2 border-red-500 outline-none' : 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg outline-none'} style={{color: '#E85A4F'}}>Ingredients</Tab>
              <Tab className={({ selected }) => selected ? 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg border-b-2 border-red-500 outline-none' : 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg outline-none'} style={{color: '#E85A4F'}}>Instructions</Tab>
              <Tab className={({ selected }) => selected ? 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg border-b-2 border-red-500 outline-none' : 'w-full py-2.5 text-sm leading-5 font-bold rounded-lg outline-none'} style={{color: '#E85A4F'}}>Notes</Tab>
            </Tab.List>
              <Tab.Panels className="mt-1">
                  <Tab.Panel>
                    <ul className="list-disc pl-5">
                      {cocktail['Ingredients'] && cocktail['Ingredients'].trim() !== '' ?
                        cocktail['Ingredients'].replace(/[\[\]']+/g,'').split(',').map((ingredient, i) => (
                          <li key={i} className="text-gray-600 mr-2 mt-2 mb-4">
                            <span className="bg-gray-200 rounded px-3 py-1 text-sm font-semibold text-gray-700">{ingredient.trim()}</span>
                          </li>
                        ))
                        : <li className="text-gray-600">No ingredients listed</li>
                      }
                    </ul>
                    <p>
                      <span className="text-gray-600 font-bold">Garnish:</span> {cocktail['Garnish']}
                    </p>
                  </Tab.Panel>
                  <Tab.Panel>
                    {cocktail && cocktail['Instructions'] && cocktail['Instructions'].split(';').map((instruction, i) => (
                      <p key={i} className="mb-2">{instruction.trim()}</p>
                    ))}
                  </Tab.Panel>
                <Tab.Panel>
                  <p>{cocktail['Notes']}</p>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
  
          </div>
        ))}
      </div>
      </div>
    );
  }
  
  export default App;
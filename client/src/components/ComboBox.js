import { useState } from 'react'
import { Combobox } from '@headlessui/react'

const config = require('../config.json');

const people = [
  'Wade Cooper',
  'Arlene McCoy',
  'Devon Webb',
  'Tom Cook',
  'Tanya Fox',
  'Hellen Schmidt',
]

export default function MyCombobox({airports}) {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState('');

  const [searchResults, setSearchResults] = useState(["test"]);
  
  const searchDomFlight = (search) => {
    setQuery(search);
    fetch(`http://${config.server_host}:${config.server_port}/airport_search?search=${search}`)
      .then(res => res.json())
      .then(resJson => {
        const airpotsFromSearch = resJson.map((airport) => ({ name: airport.Name, IATA: airport.IATA }));
        setSearchResults(airpotsFromSearch);
      });
  }

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input onChange={(event) => searchDomFlight(event.target.value)} />
      <Combobox.Options>
        {searchResults.map((airport) => (
          <Combobox.Option key={airport.IATA} value={airport.Name}>
            {airport.Name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}
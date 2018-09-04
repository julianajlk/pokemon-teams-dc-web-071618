const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function() {
  console.log('hi')
  fetchTrainers()
})

// When a user loads the page, they should see all trainers, with their current team of Pokemon.
function fetchTrainers() {
  fetch(`${BASE_URL}/trainers`)
  .then(response => response.json())
  .then(jsonData => {
    jsonData.forEach(trainer => {renderTrainers(trainer)})
  })
}

function renderTrainers(trainer) {
  let card = document.createElement('div')
  card.classList.add('card')
  card.dataset.id = trainer.id
  card.id = `trainer-${trainer.id}`
  let pElement = document.createElement('p')
  pElement.innerHTML = trainer.name
  let addPokemonButton = document.createElement('button')
  addPokemonButton.dataset.trainerId = `${trainer.id}`
  addPokemonButton.innerText = 'Add Pokemon'
  addPokemonButton.addEventListener('click', addPokemon)

  card.appendChild(pElement)
  card.appendChild(addPokemonButton)
  document.querySelector('main').appendChild(card)

  let ulElement = document.createElement('ul')
  ulElement.id = `trainer-list-${trainer.id}`
  card.appendChild(ulElement)

  trainer.pokemons.forEach(pokemon => {
    renderPokemons(pokemon)
  })
}

function renderPokemons(pokemon){
  let liElement = document.createElement('li')
  liElement.id = `pokemon-${pokemon.id}`
  liElement.innerText = pokemon.nickname

  let liTrainer = document.getElementById(`trainer-list-${pokemon.trainer_id}`)

  let releasePokemonButton = document.createElement('button')
  releasePokemonButton.classList.add('release')
  releasePokemonButton.innerText = 'Release'
  releasePokemonButton.dataset.pokemonId = pokemon.id
  releasePokemonButton.addEventListener('click', releasePokemon)

  liElement.appendChild(releasePokemonButton)
  liTrainer.appendChild(liElement)
}


// Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
function addPokemon(event) {
  let trainerId = event.target.dataset.trainerId
  let data = {trainer_id: `${trainerId}`}
  fetch(`${BASE_URL}/pokemons`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(jsonData => {
    renderPokemons(jsonData)
  })
}

// Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.
function releasePokemon(id) {
  let pokemonId = event.target.dataset.pokemonId
  fetch(`${BASE_URL}/pokemons/${pokemonId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(jsonData => {
    //remove selected pokemon
    let div = document.getElementById(`pokemon-${pokemonId}`)
    div.remove()
  })
}

require('dotenv').config();
const {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
} = require('./helpers/inquirer.js');
const Search = require('./models/search');

const main = async () => {
  const search = new Search();
  let opt;
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        // Mostar mensaje del lugar
        const terms = await readInput('¿Qué lugar desea buscar? ');
        // Buscar lugar
        const places = await search.cities(terms);
        // Selecionar el lugar
        const idSel = await listPlaces(places);
        if (idSel === '0') continue;
        const placeSel = places.find((p) => p.id === idSel);
        // Guardar DB
        search.addHistory(placeSel.name);
        // Clima
        const clime = await search.climePlace(placeSel.lon, placeSel.lat);
        // Mostar resultados
        console.log('\nInformación del Lugar\n'.blue.bold);
        console.log('Ciudad:', placeSel.name.blue);
        console.log('lon:', placeSel.lon);
        console.log('Lat:', placeSel.lat);
        console.log('Temperatura:', clime.temp);
        console.log('Mínima:', clime.min);
        console.log('Máxima:', clime.max);
        console.log('Estado del clima:', clime.desc.blue);
        break;
      case 2:
        search.historyCap.forEach((place, i) => {
          const idx = `${i + 1}.`.blue;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    if (opt !== 3) await pause();
  } while (opt !== 3);
};
main();

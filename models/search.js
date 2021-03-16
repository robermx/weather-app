const fs = require('fs');
const axios = require('axios');

class Search {
  constructor() {
    this.history = [];
    this.dbPath = './db/database.json';
    // TODO: Leer db si existe
    this.readDB();
  }

  // capitalizar el history
  get historyCap() {
    // capitalizar cada palabra
    return this.history.map((place) => {
      let words = place.split(' ');
      words = words.map((p) => p[0].toUpperCase() + p.substring(1));
      return words.join(' ');
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
      lang: 'es',
    };
  }
  async cities(place = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });
      const resp = await instance.get();
      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lon: place.center[0],
        lat: place.center[1],
      }));
    } catch (e) {
      return []; // retorna los lugares
    }
  }

  async climePlace(lon, lat) {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { lon, lat, ...this.paramsWeather },
      });
      const resp = await instance.get();
      const { weather, main } = resp.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (e) {
      console.log(e);
    }
  }

  addHistory(place = '') {
    // Prevenir duplicar el lugar
    if (this.history.includes(place.toLocaleLowerCase())) return;
    // Tener solo los últimos 5 resultados en el historial
    this.history = this.history.splice(0, 5);
    // agregar al principio del array
    this.history.unshift(place.toLocaleLowerCase());
    // grabar en DB
    this.saveDB();
  }
  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    this.history = data.history;
  }
}

module.exports = Search;

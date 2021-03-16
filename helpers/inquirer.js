const inquirer = require('inquirer');
require('colors');

const questions = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.blue} Buscar Lugar`,
      },
      {
        value: 2,
        name: `${'2.'.blue} Historial de búsquedas`,
      },
      {
        value: 3,
        name: `${'3.'.blue} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log('====================================='.blue);
  console.log('        Seleccione una Opción        '.bgBlue);
  console.log('=====================================\n'.blue);

  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'ENTER'.green} para contunuar`,
    },
  ];
  console.log('\n');
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor';
        }
        return true;
      },
    },
  ];
  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}.`.blue;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: '0',
    name: '0.'.blue + ' Cancelar',
  });
  const questions = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccionar lugar',
      choices,
    },
  ];
  const { id } = await inquirer.prompt(questions);
  return id;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
};

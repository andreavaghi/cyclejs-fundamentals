import xs from 'xstream';

// Logic (functional)
function main() {
  return {
    DOM: xs.periodic(1000)
      .map(i => `Seconds elapsed ${i}`),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
}

// Effects (imperative)
function DOMDriver(text$) {
  text$.subscribe({
    next: (text) => {
      const container = document.querySelector('#app');
      container.textContent = text;
    }
  });
}

function consoleLogDriver(msg$) {
  msg$.subscribe({
    next: msg => console.log(msg)
  });
}

function run(mainFn, drivers) {
  const sinks = mainFn();
  Object.keys(drivers).forEach(key => {
    drivers[key](sinks[key]);
  });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver
};

run(main, drivers);

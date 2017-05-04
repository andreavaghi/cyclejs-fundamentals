import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';

// Logic (functional)
function main(sources) {
  const click$ = sources.DOM;
  const sinks = {
    DOM: click$
      .startWith(null)
      .map(() =>
        xs.periodic(1000)
        .map(i => `Seconds elapsed ${i}`)
      ).flatten(),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
  return sinks;
}

// source: input (read) effects
// sink: output (write) effects

// Effects (imperative)
function DOMDriver(text$) {
  text$.subscribe({
    next: (text) => {
      const container = document.querySelector('#app');
      container.textContent = text;
    }
  });
  const DOMSource = fromEvent(document, 'click');
  return DOMSource;
}

function consoleLogDriver(msg$) {
  msg$.subscribe({
    next: msg => console.log(msg)
  });
}

function run(mainFn, drivers) {
  const proxySources = {};
  Object.keys(drivers).forEach(key => {
    proxySources[key] = xs.create();
  });
  const sinks = mainFn(proxySources);
  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key]);
    proxySources[key].imitate(source);
  });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver
};

run(main, drivers);

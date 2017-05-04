import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';

// Logic (functional)
function main(DOMSource) {
  const click$ = DOMSource;
  return {
    DOM: click$
      .startWith(null)
      .map(() =>
        xs.periodic(1000)
        .map(i => `Seconds elapsed ${i}`)
      ).flatten(),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
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

// bProxy = ...
// a = f(bProxy)
// b = g(a)
// bProxy.imitate(b)

function run(mainFn, drivers) {
  const proxyDOMSource = xs.create();
  const sinks = mainFn(proxyDOMSource);
  const DOMSource = drivers.DOM(sinks.DOM);
  proxyDOMSource.imitate(DOMSource);
  // Object.keys(drivers).forEach(key => {
  //   drivers[key](sinks[key]);
  // });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver
};

run(main, drivers);

import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import { run } from '@cycle/run';

// Logic (functional)
function main(sources) {
  const mouseover$ = sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .map(() =>
        xs.periodic(1000)
        .map(i => {
          return {
            tagName: 'H1',
            children: [{
              tagName: 'SPAN',
              children: [
                `Seconds elapsed: ${i}`
              ]
            }]
          };
        })
      ).flatten(),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
  return sinks;
}

// source: input (read) effects
// sink: output (write) effects

// Effects (imperative)
function DOMDriver(obj$) {
  function createElement(obj) {
    const element = document.createElement(obj.tagName);
    obj.children
      .filter(c => typeof c === 'object')
      .map(createElement)
      .forEach(c => element.appendChild(c));
    obj.children
      .filter(c => typeof c === 'string')
      .forEach(c => element.innerHTML += c);
    return element;
  }

  obj$.subscribe({
    next: (obj) => {
      const container = document.querySelector('#app');
      container.innerHTML = '';
      const element = createElement(obj);
      container.appendChild(element);
    }
  });
  const DOMSource = {
    selectEvents: function (tagName, eventType) {
      return fromEvent(document, eventType)
        .filter(e => e.target.tagName === tagName.toUpperCase());
    }
  };
  return DOMSource;
}

function consoleLogDriver(msg$) {
  msg$.subscribe({
    next: msg => console.log(msg)
  });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver
};

run(main, drivers);

import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import { run } from '@cycle/run';
import { h, h1, span, makeDOMDriver } from '@cycle/dom';

// Logic (functional)
function main(sources) {
  const mouseover$ = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .map(() =>
        xs.periodic(1000)
        .map(i =>
          h1({ style: { background: 'red' } }, [
            span([
              `Seconds elapsed: ${i}`
            ])
          ])
        )
      ).flatten(),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
  return sinks;
}

// source: input (read) effects
// sink: output (write) effects

// Effects (imperative)
function consoleLogDriver(msg$) {
  msg$.subscribe({
    next: msg => console.log(msg)
  });
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver
};

run(main, drivers);

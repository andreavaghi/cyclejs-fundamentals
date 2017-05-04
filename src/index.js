import xs from 'xstream';
import { run } from '@cycle/run';
import { button, p, label, div, makeDOMDriver } from '@cycle/dom';

function main(sources) {
  const decrementClick$ = sources.DOM.select('.decrement').events('click');
  const incrementClick$ = sources.DOM.select('.increment').events('click');
  const decrementAction$ = decrementClick$.map(e => -1);
  const incrementAction$ = incrementClick$.map(e => +1);

  const number$ = xs.merge(xs.of(10), decrementAction$, incrementAction$)
    .fold((prev, curr) => prev + curr, 0);

  return {
    DOM: number$.map(number =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p([
          label(number)
        ])
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);

import { run } from '@cycle/run';
import { label, input, h1, hr, div, makeDOMDriver } from '@cycle/dom';

function main(sources) {
  const inputEv$ = sources.DOM.select('.field').events('input');
  const name$ = inputEv$.map(e => e.target.value).startWith('');
  return {
    DOM: name$.map(name =>
      div([
        label('Name: '),
        input('.field', { type: 'text' }),
        hr(),
        h1(`Hello ${name}!`)
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);

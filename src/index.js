import xs from 'xstream';
import { run } from '@cycle/run';
import { div, input, label, h2, makeDOMDriver } from '@cycle/dom';

// DOM read effect: detect slider change
// recalculate BMI
// DOM write effect: display BMI

function intent(DOMSource) {
  const changeWeight$ = DOMSource.select('.weight').events('input')
    .map(e => e.target.value);
  const changeHeight$ = DOMSource.select('.height').events('input')
    .map(e => e.target.value);
  return { changeWeight$, changeHeight$ };
}

function model(changeWeight$, changeHeight$) {
  return xs.combine(changeWeight$.startWith(70), changeHeight$.startWith(170))
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return { bmi, weight, height };
    });
}

function view(state$) {
  return state$.map(state =>
    div([
      div([
        label(`Weight: ${state.weight}kg`),
        input('.weight', { attrs: { type: 'range', min: 40, max: 150, value: state.weight } })
      ]),
      div([
        label(`Height: ${state.height}cm`),
        input('.height', { attrs: { type: 'range', min: 140, max: 220, value: state.height } })
      ]),
      h2(`BMI is ${state.bmi}`)
    ])
  );
}

function main(sources) {
  const { changeWeight$, changeHeight$ } = intent(sources.DOM);
  const state$ = model(changeWeight$, changeHeight$);
  const vtree$ = view(state$);
  return {
    DOM: vtree$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);

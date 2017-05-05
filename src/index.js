import xs from 'xstream';
import concat from 'xstream/extra/concat'
import { run } from '@cycle/run';
import { div, input, label, h2, makeDOMDriver } from '@cycle/dom';

function intent(DOMSources) {
  return DOMSources.select('.slider').events('input')
    .map(e => e.target.value);
}

function model(newValue$, props$) {
  const initialValue$ = props$.map(props => props.init);
  const value$ = concat(initialValue$, newValue$);
  return xs.combine(value$, props$)
    .map(([value, props]) => {
      return {
        label: props.label,
        unit: props.unit,
        min: props.min,
        max: props.max,
        value: value
      };
    });
}

function view(state$) {
  return state$.map(state =>
    div('.labeled-slider', [
      label('.label', `${state.label}: ${state.value}${state.unit}`),
      input('.slider', { attrs: { type: 'range', min: state.min, max: state.max, value: state.value } })
    ])
  );
}

function LabeledSlider(sources) {
  const change$ = intent(sources.DOM);
  const state$ = model(change$, sources.props);
  const vtree$ = view(state$);

  return {
    DOM: vtree$
  };
}

function main(sources) {
  const props$ = xs.of({
    label: 'Weight',
    unit: 'kg',
    min: 40,
    max: 150,
    init: 70,
  })
  return LabeledSlider({ DOM: sources.DOM, props: props$ });
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);

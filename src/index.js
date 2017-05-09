import xs from 'xstream';
import concat from 'xstream/extra/concat'
import { run } from '@cycle/run';
import { div, input, label, h2, makeDOMDriver } from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSources) {
  return DOMSources.select('.slider').events('input')
    .map(e => e.target.value);
}

function model(newValue$, props$) {
  return props$
    .map(props => newValue$
      .map(value => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        value: value,
        max: props.max
      }))
      .startWith(props)
    )
    .flatten()
    .remember();
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
    DOM: vtree$,
    value: state$.map(state => state.value)
  };
}

function IsolatedLabeledSlider(sources) {
  return isolate(LabeledSlider)(sources);
}

function main(sources) {
  const weightProps$ = xs.of({
    label: 'Weight',
    unit: 'kg',
    min: 40,
    max: 150,
    value: 70,
  });
  const weightSinks = IsolatedLabeledSlider({ DOM: sources.DOM, props: weightProps$ });
  const weightVTree$ = weightSinks.DOM;
  const weightValue$ = weightSinks.value;

  const heightProps$ = xs.of({
    label: 'Height',
    unit: 'cm',
    min: 140,
    max: 220,
    value: 170,
  });
  const heightSinks = IsolatedLabeledSlider({ DOM: sources.DOM, props: heightProps$ });
  const heightVTree$ = heightSinks.DOM;
  const heightValue$ = heightSinks.value;

  const bmi$ = xs.combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      return Math.round(weight / (heightMeters * heightMeters));
    })
    .remember();

  const vtree$ = xs.combine(bmi$, weightVTree$, heightVTree$)
    .map(([bmi, weightVTree, heightVTree]) =>
      div([
        weightVTree,
        heightVTree,
        h2(`BMI is ${bmi}`)
      ])
    );

  return {
    DOM: vtree$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);

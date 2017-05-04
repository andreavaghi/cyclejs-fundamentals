import xs from 'xstream';
import { run } from '@cycle/run';
import { button, h1, h4, a, div, makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

// DOM read effect: button clicked
// HTTP write effect: request sent
// HTTP read effect: response received
// DOM write effect: data displayed

function main(sources) {
  const clickEvent$ = sources.DOM
    .select('.first').events('click');

  const request$ = clickEvent$.map(() => {
    return {
      url: 'http://jsonplaceholder.typicode.com/users/1',
      category: 'user',
    };
  });

  const response$ = sources.HTTP
    .select('user')
    .flatten();

  const firstUser$ = response$.map(response => response.body)
    .startWith(null);

  return {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.first', 'Get first user'),
        firstUser === null ? null : div('.user-details', [
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', { attrs: { href: firstUser.website } }, firstUser.website)
        ])
      ])
    ),
    HTTP: request$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

run(main, drivers);

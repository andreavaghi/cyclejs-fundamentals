import xs from 'xstream';

// Logic (functional)
function main() {
  return {
    DOM: xs.periodic(1000)
      .map(i => `Seconds elapsed ${i}`),
    Log: xs.periodic(2000)
      .map(i => 2 * i),
  };
}

// Effects (imperative)
function DOMeffect(text$) {
  text$.subscribe({
    next: (text) => {
      const container = document.querySelector('#app');
      container.textContent = text;
    }
  });
}

function consoleLogEffect(msg$) {
  msg$.subscribe({
    next: msg => console.log(msg)
  });
}

const sinks = main();
DOMeffect(sinks.DOM);
consoleLogEffect(sinks.Log);

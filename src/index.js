import xs from 'xstream';

// Logic (functional)
function main() {
  return xs.periodic(1000)
    .map(i => `Seconds elapsed ${i}`);
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

const sink = main();
consoleLogEffect(sink);
DOMeffect(sink);

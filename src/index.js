import xs from 'xstream';

// Logic (functional)
xs.periodic(1000)
  .map(i => `Seconds elapsed ${i}`)

  // Effects (imperative)
  .subscribe({
    next: (text) => {
      const container = document.querySelector('#app');
      container.textContent = text;
    }
  });

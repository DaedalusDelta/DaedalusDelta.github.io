(() => {
  for (const element of document.querySelectorAll('.math')) {
    const latex = element.textContent.trim();
    try {
      katex.render(latex, element, {
        displayMode: element.classList.contains('display'),
        throwOnError: true,
        output: 'htmlAndMathml',
        trust: false
      });
      element.classList.add('rendered');
    } catch (error) {
      element.classList.add('math-error');
      element.title = String(error);
      console.error('Could not render equation:', latex, error);
    }
  }
})();

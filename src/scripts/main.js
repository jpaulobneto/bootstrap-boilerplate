import Common from './modules/common';

const availableModules = { Common };

window.modules = {};

$(() => {
  let htmlModules = $('[data-module]');

  // Loading htmlModules if they are in availableModules
  htmlModules.each((key, value) => {
    let mod = $(value).data('module');
    if (availableModules.hasOwnProperty(mod)) {
      window.modules[mod] = new availableModules[mod]();
    } else {
      console.log(`The module "${mod}" does not exists.`);
    }
  });

  console.log(window.modules);
});

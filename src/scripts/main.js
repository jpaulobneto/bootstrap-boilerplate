import { Common } from './modules/Common';

// document ready
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {

    let classes = { Common };
    let dataModules = document.querySelectorAll('[data-module]');

    // TODO Change to {} and add property with a new instance of module
    window.$modules = [];

    // Loading modules
    for (let i = 0; i < dataModules.length; i++) {
      let mod = dataModules[i].dataset.module;
      classes.hasOwnProperty(mod)
        ? window.$modules.push(new classes[mod]())
        : console.info(`${mod} module does not exist.`);
    }

  }
};

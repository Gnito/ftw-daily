import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

// react-dates needs to be initialized before using any react-dates component
// https://github.com/airbnb/react-dates#initialize
// NOTE: Initializing it here will initialize it also for app.test.js
import 'react-dates/initialize';
import loadable, { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as LoadableSecret } from '@loadable/component';
//import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as LoadableSecret } from '@loadable/component';
const { Context: LoadableContext } = LoadableSecret;

// import { HelmetProvider } from 'react-helmet-async';
// import { BrowserRouter, StaticRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import difference from 'lodash/difference';
// import mapValues from 'lodash/mapValues';
// import moment from 'moment';
// import { IntlProvider } from './util/reactIntl';
// import configureStore from './store';
// import routeConfiguration from './routeConfiguration';
// import Routes from './Routes';
// import config from './config';

// // Flex template application uses English translations as default.
// import defaultMessages from './translations/en.json';

// // If you want to change the language, change the imports to match the wanted locale:
// //   1) Change the language in the config.js file!
// //   2) Import correct locale rules for Moment library
// //   3) Use the `messagesInLocale` import to add the correct translation file.
// //   4) To support older browsers we need add the correct locale for intl-relativetimeformat to `util/polyfills.js`

// // Note that there is also translations in './translations/countryCodes.js' file
// // This file contains ISO 3166-1 alpha-2 country codes, country names and their translations in our default languages
// // This used to collect billing address in StripePaymentAddress on CheckoutPage

// // Step 2:
// // If you are using a non-english locale with moment library,
// // you should also import time specific formatting rules for that locale
// // e.g. for French: import 'moment/locale/fr';

// // Step 3:
// // If you are using a non-english locale, point `messagesInLocale` to correct .json file
// import messagesInLocale from './translations/fr.json';

// // If translation key is missing from `messagesInLocale` (e.g. fr.json),
// // corresponding key will be added to messages from `defaultMessages` (en.json)
// // to prevent missing translation key errors.
// const addMissingTranslations = (sourceLangTranslations, targetLangTranslations) => {
//   const sourceKeys = Object.keys(sourceLangTranslations);
//   const targetKeys = Object.keys(targetLangTranslations);
//   const missingKeys = difference(sourceKeys, targetKeys);

//   const addMissingTranslation = (translations, missingKey) => ({
//     ...translations,
//     [missingKey]: sourceLangTranslations[missingKey],
//   });

//   return missingKeys.reduce(addMissingTranslation, targetLangTranslations);
// };

// const isDefaultLanguageInUse = config.locale === 'en';

// const messages = isDefaultLanguageInUse
//   ? defaultMessages
//   : addMissingTranslations(defaultMessages, messagesInLocale);

// const isTestEnv = process.env.NODE_ENV === 'test';

// // Locale should not affect the tests. We ensure this by providing
// // messages with the key as the value of each message.
// const testMessages = mapValues(messages, (val, key) => key);
// const localeMessages = isTestEnv ? testMessages : messages;

// const setupLocale = () => {
//   if (isTestEnv) {
//     // Use english as a default locale in tests
//     // This affects app.test.js and app.node.test.js tests
//     config.locale = 'en';
//     return;
//   }

//   // Set the Moment locale globally
//   // See: http://momentjs.com/docs/#/i18n/changing-locale/
//   moment.locale(config.locale);
// };


const A = loadable(() => import('./letters/A'))
const B = loadable(() => import('./letters/B'))
const C = loadable(() => import(/* webpackPreload: true */ './letters/C'))
const D = loadable(() => import(/* webpackPrefetch: true */ './letters/D'))
const E = loadable(() => import('./letters/E'), { ssr: false })
const X = loadable(props => import(`./letters/${props.letter}`))
const Sub = loadable(props => import(`./letters/${props.letter}/file`))
const RootSub = loadable(props => import(`./${props.letter}/file`))

// Load the 'G' component twice: once in SSR and once fully client-side
const GClient = loadable(() => import('./letters/G'), {
  ssr: false,
  fallback: <span className="loading-state">ssr: false - Loading...</span>,
})
const GServer = loadable(() => import('./letters/G'), {
  ssr: true,
  fallback: <span className="loading-state">ssr: true - Loading...</span>,
})

// We keep some references to prevent uglify remove
A.C = C
A.D = D

// const Moment = loadable.lib(() => import('moment'), {
//   resolveComponent: moment => moment.default || moment,
// })

const App = () => (
  <div>
    <A />
    <br />
    <B />
    <br />
    <X letter="A" />
    <br />
    <X letter="F" />
    <br />
    <E />
    <br />
    <GClient prefix="ssr: false" />
    <br />
    <GServer prefix="ssr: true" />
    <br />
    <Sub letter="Z" />
    <br />
    <RootSub letter="Y" />
    <br />
  </div>
)

export const ClientApp = props => {
  return <App />;
}

export const ServerApp = props => {
  return <App />;
}

// export const ClientApp = props => {
//   const { store } = props;
//   setupLocale();
//   return (
//     <IntlProvider locale={config.locale} messages={localeMessages} textComponent="span">
//       <Provider store={store}>
//         <HelmetProvider>
//           <BrowserRouter>
//             <Routes routes={routeConfiguration()} />
//           </BrowserRouter>
//         </HelmetProvider>
//       </Provider>
//     </IntlProvider>
//   );
// };

// const { any, string } = PropTypes;

// ClientApp.propTypes = { store: any.isRequired };

// export const ServerApp = props => {
//   const { url, context, helmetContext, store } = props;
//   setupLocale();
//   HelmetProvider.canUseDOM = false;
//   return (
//     <IntlProvider locale={config.locale} messages={localeMessages} textComponent="span">
//       <Provider store={store}>
//         <HelmetProvider context={helmetContext}>
//           <StaticRouter location={url} context={context}>
//             <Routes routes={routeConfiguration()} />
//           </StaticRouter>
//         </HelmetProvider>
//       </Provider>
//     </IntlProvider>
//   );
// };

// ServerApp.propTypes = { url: string.isRequired, context: any.isRequired, store: any.isRequired };

/**
 * Render the given route.
 *
 * @param {String} url Path to render
 * @param {Object} serverContext Server rendering context from react-router
 *
 * @returns {Object} Object with keys:
 *  - {String} body: Rendered application body of the given route
 *  - {Object} head: Application head metadata from react-helmet
 */
export const renderApp = (url, serverContext, preloadedState, collectChunks) => {
  // Don't pass an SDK instance since we're only rendering the
  // component tree with the preloaded store state and components
  // shouldn't do any SDK calls in the (server) rendering lifecycle.
  const store = {};//TODO configureStore(preloadedState);

  const helmetContext = {};

  // const element = (
  //   <LoadableContext.Provider value={extractor}>
  //     {/* */}
  //   </LoadableContext.Provider>
  // );
  console.log('collectChunks() HOC next', collectChunks);
  const WithChunks = collectChunks(
      <ServerApp url={url} context={serverContext} helmetContext={helmetContext} store={store} />
  );
  const body = ReactDOMServer.renderToString(WithChunks);
  //const { helmet: head } = helmetContext;
  const head = {
    htmlAttributes: 'htmlAttributes',
    title: 'title',
    link: 'link',
    meta: 'meta',
    script: 'script',
  };

  return { head, body };
};

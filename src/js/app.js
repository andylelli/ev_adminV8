// Import Vue
import { createApp } from 'vue';

// Import Vuex
import { store } from '../vuex/store'

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faExclamation, faCloud, faCloudArrowUp, faCloudArrowDown, faDatabase, faWifi, faWifiSlash, faFilm, faTrophyAlt, faQuestion, faInfo, faMusicAlt, faSpeaker, faUtensils, faToiletPaperAlt, faLongArrowAltRight, faQrcode, faEyeSlash, faMegaphone, faLongArrowRight, faMoon, faStopCircle, faCloudDownloadAlt, faPoll, faTreasureChest, faMapMarkerTimes, faUserFriends, faMapMarked, faImage, faFileAlt, faCamera, faText, faUser, faUpload, faDownload, faClock, faCalendar, faSort, faPen, faTrash, faSync, faMapMarkerPlus, faCompass, faShoppingBag, faReceipt, faPodcast, faCrosshairs, faMapMarkerAlt, faPlus, faAward, faBook, faMap, faCog, faUsers, faTimes, faCheck } from '@fortawesome/pro-light-svg-icons'
import { faChevronLeft, faBars } from '@fortawesome/pro-regular-svg-icons'
import { faStar, faSquare } from '@fortawesome/pro-solid-svg-icons'

library.add(faCloud, faCloudArrowUp, faCloudArrowDown, faDatabase, faWifi, faWifiSlash, faFilm, faTrophyAlt, faQuestion, faInfo, faMusicAlt, faSpeaker, faUtensils, faToiletPaperAlt, faLongArrowAltRight, faExclamation, faQrcode, faEyeSlash, faMegaphone, faLongArrowRight, faMoon, faStopCircle, faCloudDownloadAlt, faPoll, faTreasureChest, faMapMarkerTimes, faUserFriends, faMapMarked, faImage, faFileAlt, faCamera, faText, faUser, faUpload, faDownload, faClock, faCalendar, faSort, faPen, faTrash, faCheck, faSync, faSquare, faMapMarkerPlus, faCompass, faChevronLeft, faBars, faShoppingBag, faReceipt, faPodcast, faCrosshairs, faMapMarkerAlt, faCompass, faPlus, faQuestion, faStar, faAward, faBook, faMap, faCog, faUsers, faTimes)


// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app); 

// Event Bus
const eventBus = new Framework7.Events();

// Mount the app
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store);
app.mount('#app');
app.provide('eventBus', eventBus);

import { Dom7 } from "framework7";

var $$ = Dom7;

$$(document).on('page:afterin', (e, page) => {
    page.$el.css('overflow', 'hidden');
    setTimeout(() => {
      page.$el.css('overflow', '');
    }, 0);
  });

  window.isUpdateAvailable = new Promise(function (resolve, reject) {
  // lazy way of disabling service workers while developing
  if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
    // register service worker file
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        reg.onupdatefound = () => {        
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // new update available
                  resolve(true);
                } else {
                  // no update available
                  resolve(false);
                }
                break;
            }
          };
        };
      })
      .catch(err => console.error('[SW ERROR]', err));
  }
});



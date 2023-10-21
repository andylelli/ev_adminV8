
import actions from "./actions.js";
import getters from "./getters.js";

import { createStore } from 'vuex'

export const store = createStore({
  state: {
    version: "v8 20231021_16",

    url: "https://www.evaria.io/public/",
    urlQR: "https://www.evaria.io/admin/index.html?",
    cache: "https://www.evaria.io/admin/",

    uniqueId: "",
    validate: true,
    initiated: false,
    timeout: 10000,
    os: null,
    autosync: "ok",
    working: "stopped",
    error: false,

    eventsList: [],
    eventName: null,

    userid: null,
    eventid: null,
    email: null,
    role: null,
    token: null,

    user: [],
    lookup: [],
    event: [],
    project: [],
    poll: [],
    pollitem: [],
    pollscore: [],
    scoreboard: [],
    scoreboardscore: [],
    pindrop: [],
    directory: [],
    directoryentry: [],
    shop: [],
    shopitem: [],
    hunt: [],
    huntitem: [],
    news: [],
    newsitem: [],
    schedule: [],    
    guest: [],
    qrcode: [],
    order: [],
    orderdetail: [],
    orderhistory: [],

    eventsList:[],

    marker: [],

    compass: {},
    sheetscheduleid: "",
    shopitempicker: [],
    shopcart: [],
    shoporder: [],

    messager: {
      title: "XXX",
      messages: [],
    },
    customcolours: [],

    pull: false,

    toolbar: {
      compass: false,
      map: false,
      nearest: false,
      nearestPlaces: false,
      onNow: false,

    },

    qrscanner: {}
  },
  actions: actions,
  getters: getters,
});

export default store;


import actions from "./actions.js";
import getters from "./getters.js";

import { createStore } from 'vuex'

var url = "https://www.evaria.io/";
//var url = "http://localhost/";
//var url = "https://phplaravel-1159228-4039624.cloudwaysapps.com/";

export const store = createStore({
  state: {
    version: "v8.3.2 20250411_02",
    url: url + "public/",
    cache: url + "admin/",
    urlQR: url + "admin/index.html?",

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
    myschedule: [], 
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


import _LoginPage from '../components/login/_loginPage.vue';
import _LeftViewPage from '../components/left/_leftViewPage.vue';
import _EventSettingsPage from '../components/event/_eventSettingsPage.vue';
import _EventSettingsBackupRestorePage from '../components/event/_eventSettingsBackupRestorePage.vue';
import _GuestPage from '../components/guest/_guestPage.vue';
import _GuestDetailPage from '../components/guest/_guestDetailPage.vue';
import _MainPage from '../components/project/_mainPage.vue';
import _PollPage from '../components/project/1-poll/_pollPage.vue';
import _PollSettingsPage from '../components/project/1-poll/_pollSettingsPage.vue';
import _ScoreboardPage from '../components/project/2-scoreboard/_scoreboardPage.vue';
import _ScoreboardSettingsPage from '../components/project/2-scoreboard/_scoreboardSettingsPage.vue';
import _MapPage from '../components/project/4-pindrop/_mapPage.vue';
import _MapSettingsPage from '../components/project/4-pindrop/_mapSettingsPage.vue';
import _DirectoryPage from '../components/project/5-directory/_directoryPage.vue';
import _DirectorySettingsPage from '../components/project/5-directory/_directorySettingsPage.vue';
import _ShopPage from '../components/project/6-shop/_shopPage.vue';
import _ShopSettingsPage from '../components/project/6-shop/_shopSettingsPage.vue';
import _HuntPage from '../components/project/7-hunt/_huntPage.vue';
import _HuntSettingsPage from '../components/project/7-hunt/_huntSettingsPage.vue';
import _NewsPage from '../components/project/8-news/_newsPage.vue';
import _NewsSettingsPage from '../components/project/8-news/_newsSettingsPage.vue';
import _SchedulePage from '../components/project/9-schedule/_schedulePage.vue';
import _ScheduleSettingsPage from '../components/project/9-schedule/_scheduleSettingsPage.vue';

import _PollitemPage from '../components/project/1-poll/_pollitemPage.vue';
import _DirectoryentryPage from '../components/project/5-directory/_directoryentryPage.vue';
import _ShopitemPage from '../components/project/6-shop/_shopitemPage.vue';
import _HuntitemPage from '../components/project/7-hunt/_huntitemPage.vue';
import _NewsitemPage from '../components/project/8-news/_newsitemPage.vue';

import _EditLongTextPage from '../components/editLongText/_editLongTextPage.vue';

import _EmptyPage from '../components/misc/_emptyPage.vue';
import _NotFoundPage from '../components/misc/_404.vue';

import localLoad from "../js/localLoad.js";

var routes = [
  {
    path: '/',
    async({ resolve, reject }) {
      if (parseInt(localStorage.admin_eventid) > 0) {
        //if (store.state.initiated === false) {
          var eventid = localStorage.admin_eventid;
          localLoad.initiateAppFromLocalDB(eventid);
          setTimeout(function () {
            resolve({
              component: _MainPage,
              reloadAll: true
            });
          }, 500);
        //}
      }
      else {
        resolve({
          component: _LoginPage,
          name: "login"
        });
      }
    }
  },
  {
    path: '/login/',
    component: _LoginPage,
  },
  {
    path: '/left-view/',
    component: _LeftViewPage,
  },
  {
    path: '/event-settings/',
    component: _EventSettingsPage,
  },
  {
    path: '/event-settings-backup-restore/',
    component: _EventSettingsBackupRestorePage,
  },
  {
    path: '/main/:eventId/',
    component: _MainPage,
  },
  {
    path: '/guest/',
    component: _GuestPage,
  },
  {
    path: '/guest-detail/:guestId/',
    component: _GuestDetailPage,
  },
  {
    path: '/poll/:projectId/',
    component: _PollPage,
  },
  {
    path: '/poll-settings/:projectId/',
    component: _PollSettingsPage,
  },
  {
    path: '/pollitem/:pollitemId/',
    component: _PollitemPage,
  },
  {
    path: '/scoreboard/:projectId/',
    component: _ScoreboardPage,
  },
  {
    path: '/scoreboard-settings/:projectId/',
    component: _ScoreboardSettingsPage,
  },
  {
    path: '/pindrop/:mapProjectId/:projectId/:directoryentryId/',
    component: _MapPage,
  },
  {
    path: '/pindrop-settings/:projectId/',
    component: _MapSettingsPage,
  },
  {
    path: '/directory/:projectId/',
    component: _DirectoryPage,
  },
  {
    path: '/directory-settings/:projectId/',
    component: _DirectorySettingsPage,
  },
  {
    path: '/directoryentry/:directoryentryId/',
    component: _DirectoryentryPage,
  },
  {
    path: '/shop/:projectId/',
    component: _ShopPage,
  },
  {
    path: '/shop-settings/:projectId/',
    component: _ShopSettingsPage,
  },
  {
    path: '/shopitem/:shopitemId/',
    component: _ShopitemPage,
  },
  {
    path: '/hunt/:projectId/',
    component: _HuntPage,
  },
  {
    path: '/hunt-settings/:projectId/',
    component: _HuntSettingsPage,
  },
  {
    path: '/huntitem/:huntitemId/',
    component: _HuntitemPage,
  },
  {
    path: '/news/:projectId/',
    component: _NewsPage,
  },
  {
    path: '/news-settings/:projectId/',
    component: _NewsSettingsPage,
  },
  {
    path: '/newsitem/update/:projectId/:newsitemId/',
    component: _NewsitemPage,
  },
  {
    path: '/newsitem/new/:projectId/',
    component: _NewsitemPage,
  },
  {
    path: '/schedule/:projectId/',
    component: _SchedulePage,
  },
  {
    path: '/schedule-settings/:projectId/',
    component: _ScheduleSettingsPage,
  },
  {
    path: '/edit-long-text/:table/:fieldname/:id/',
    component: _EditLongTextPage,
  },
  {
    path: '/empty/',
    component: _EmptyPage,
  },
  {
    path: '(.*)',
    component: _NotFoundPage,
  },
];

export default routes;

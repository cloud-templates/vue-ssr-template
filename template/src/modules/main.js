import Vue from 'vue';
import App from './App';
import * as filters from './filters';
import { sync } from 'vuex-router-sync';
import { createStore } from './store';
import { createRouter } from './router';
import title from './mixins/title';

Vue.mixin(title);

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = process.env.NODE_ENV === 'production';

export function createApp() {
  const router = createRouter();
  const store = createStore();

  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  });

  return { app, router, store };
}

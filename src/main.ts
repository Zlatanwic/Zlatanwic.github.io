import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Writing from './views/Writing.vue'
import Post from './views/Post.vue'
import Papers from './views/Papers.vue'
import Likes from './views/Likes.vue'
import 'katex/dist/katex.min.css'
import './styles/global.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { title: 'Home' } },
    { path: '/writing', name: 'writing', component: Writing, meta: { title: 'Writing' } },
    { path: '/writing/:slug', name: 'post', component: Post, meta: { title: 'Post' } },
    { path: '/papers', name: 'papers', component: Papers, meta: { title: 'Reading Papers' } },
    { path: '/likes', name: 'likes', component: Likes, meta: { title: 'Likes' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

createApp(App).use(router).mount('#app')

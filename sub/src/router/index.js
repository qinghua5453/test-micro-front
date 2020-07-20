const about = r => require.ensure([], () => r(require('@/pages/about')), 'about');

let routes = [
  { path: '/about', name: 'about', component: about },
]

export default routes
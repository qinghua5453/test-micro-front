const about = r => require.ensure([], () => r(require('@/pages/about')), 'about');
const testPicker = r => require.ensure([], () => r(require('@/pages/test-picker')), 'testPicker')

let routes = [
  { path: '/about', name: 'about', component: about },
  { path: '/testPicker', name: 'testPicker', component: testPicker}
]

export default routes
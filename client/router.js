import NewsList from './components/NewsList'

const DefaultComponent = NewsList

export default function (router) {
    router.map({
        '/': {
            component: DefaultComponent
        },
        '/newsList': {
            component: NewsList
        },
        '*': {
            component: require('./components/NotFound')
        }
    })
}
import TicTocElement from './tic_toc/tic_toc.element'

TicTocElement()

if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
        module.hot.accept();
    }
}
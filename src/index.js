import './tic_toc'

if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
        module.hot.accept();
    }
}
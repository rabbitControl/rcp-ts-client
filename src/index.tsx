import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
// import 'normalize.css/normalize.css'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ModeToggle from './ModeToggle';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ModeToggle/>
  </StrictMode>,
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css'
import './themes.scss';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const params = new URLSearchParams(window.location.search);
if (params.has("theme"))
{
    const theme_name = params.get("theme");
    if (theme_name === "g100" ||
        theme_name === "g90" ||
        theme_name === "g80" ||
        theme_name === "g10" ||
        theme_name === "white" ||
        theme_name === "v9")
    {
        document.body.classList.add(theme_name);
    }
    else
    {
        console.log("invalid theme: " + theme_name);                    
    }
}
else
{
    document.body.classList.add("g90");
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

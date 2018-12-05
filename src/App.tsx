import React, { Component } from 'react';
import './App.css';
import ConnectionDialog from './ConnectionDialog';

class App extends Component {

  static VERBOSE_LOG = false;

  render() {

    return (
      <section className={"bp3-dark"}>

<div className="App" style={{
          margin: "30px",
        }}>
        <ConnectionDialog/>

        </div>
      </section>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import ConnectionDialog from './ConnectionDialog';

/*
  use with local tcp-ts:
  $ npm link ../rcp-ts
*/

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

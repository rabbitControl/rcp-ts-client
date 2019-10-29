import React, { Component } from 'react';
import './App.css';
import ConnectionDialog from './ConnectionDialog';
import { Colors } from '@blueprintjs/core';

/*
  use with local tcp-ts:
  $ npm link ../rcp-ts

  unlink with:
  $ npm unlink rabbitcontrol
  $ npm install
*/


interface Props {
};

interface State {
  height: number;
};

class App extends React.Component<Props, State> {

  static VERBOSE_LOG = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      height: window.innerHeight,
    };
  }

  componentDidMount() {
    console.log("did mount!");    
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    this.setState({ height: window.innerHeight });
  }

  render() {

    return (
      <section className={"bp3-dark"}>

        <div className="App" 
          style={{
            margin: "30px",
            marginBottom: "-30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: this.state.height-40
        }}>

          <ConnectionDialog />

          <div style={{
            flex: 2
          }}></div>

          <div style={{
            marginBottom: 5,
            marginTop: 20,
            width: "100%",
            textAlign: "center",
            fontSize: "0.8em",
            color: Colors.GRAY1
          }}>
            written by&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://github.com/rabbitControl/rcp-ts-client" target="#">
              i-n-g-o
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://rabbitcontrol.github.io/" target="#">
              rabbitControl
            </a>
            <br/>
            uses&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://blueprintjs.com/">
              blueprintjs
            </a>
          </div>
        </div>

      </section>
    );
  }
}

export default App;

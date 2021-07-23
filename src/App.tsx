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

    console.log("rabbitcontrol web client - version: 0.1.4");
  }

  componentDidMount() 
  {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() 
  {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => 
  {
    this.setState({ height: window.innerHeight });
  }

  render() {

    return (
      <section className={"bp3-dark"}>

        <div className="App" 
          style={{            
            minHeight: this.state.height-40
        }}>

          <ConnectionDialog />

          <div style={{
            flex: 2
          }}></div>

          <div className="credits" 
              style={{            
                color: Colors.GRAY1
          }}>
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://github.com/rabbitcontrol/" target="#">
              rcp-ts-client
            </a>
              &nbsp;written by&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://ingorandolf.info/" target="#">
              i-n-g-o
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="http://rabbitcontrol.cc/" target="#">
              rabbitControl
            </a>
            <br/>
            uses&nbsp;
            <a style={{
              color: Colors.GRAY1,
              textDecoration: "underline"
            }}
              href="https://blueprintjs.com/" target="#">
              blueprintjs
            </a>
          </div>
        </div>

      </section>
    );
  }
}

export default App;

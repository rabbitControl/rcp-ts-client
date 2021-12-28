import React from 'react';
import './App.css';
import ConnectionDialog from './ConnectionDialog';
import { VERSION_STR } from './Globals';

/*      
  use with local tcp-ts:
  $ npm link ../rcp-ts

  unlink with:
  $ npm unlink rabbitcontrol
  $ npm install
*/

/**
 * problems with carbon:
 * 
 * - no RangeSlider
 * - nested accordion: folding does not work
 * - use colors from theme
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

    console.log(`rabbitcontrol web client - version: ${VERSION_STR}`);
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
      <div className="App"
        style={{
          minHeight: this.state.height - 40
        }}>

        <ConnectionDialog />

        <div style={{
          flex: 2
        }}></div>

        <div className="bx--label credits">
          <a
            className="aunderline"
            href="https://github.com/rabbitcontrol/" target="#">
            rcp-ts-client
          </a>
            &nbsp;written by&nbsp;
          <a
            className="aunderline"
            href="https://ingorandolf.info/" target="#">
            i-n-g-o
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="aunderline"
            href="http://rabbitcontrol.cc/" target="#">
            rabbitControl
          </a>            
        </div>
      </div>
    );
  }
}

export default App;

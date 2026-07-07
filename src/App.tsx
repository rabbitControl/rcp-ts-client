import React from 'react';
import './App.css';
import ConnectionDialog from './ConnectionDialog';
import { RCP_LIBRARY_VERSION, rcpLogVersion } from 'rabbitcontrol';
import { Box, Link, Stack, Typography } from '@mui/joy';

/*
  use with local tcp-ts:
  $ npm link ../rcp-ts
  $ npm install path-to-file

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
    
    console.log("rabbitcontrol web client - version: 0.1.12");
    console.log(`rcp library version: ${RCP_LIBRARY_VERSION}`);
  }

  componentDidMount() 
  {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() 
  {
    rcpLogVersion();
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => 
  {
    this.setState({ height: window.innerHeight });
  }


  render() {

    

    // const { mode, systemMode } = useColorScheme();
    // console.log(mode);
    // console.log(systemMode);

    return (

      <Box id="TEST">

        <Stack        
          direction="column"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            p: 0
          }}
        >

            <ConnectionDialog />

            <Stack direction="row">
              <Link underline='always'            
                href="https://github.com/rabbitcontrol/" target="#">
                rcp-ts-client
              </Link>
              <Typography>
                &nbsp;written by&nbsp;
              </Typography>
              <Link underline='always'
                href="https://ingorandolf.info/" target="#">
                i-n-g-o
              </Link>
              <Typography>
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </Typography>
              <Link underline='always'
                href="http://rabbitcontrol.cc/" target="#">
                rabbitControl
              </Link>
              <br/>
              <Typography>
                uses&nbsp;
              </Typography>
              <Link underline='always'
                href="https://v7.mui.com/joy-ui/getting-started/" target="#">
                mui
              </Link>
            </Stack>

            <br></br>
        </Stack>
      </Box>

    );
  }
}

export default App;

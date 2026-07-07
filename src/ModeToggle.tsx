import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import App from './App';

const theme = extendTheme({
  cssVarPrefix: 'mode-toggle',
});

export default function ModeToggle() {
  return (
    <CssVarsProvider

      // the props below are specific to this demo,
      // you might not need them in your app.
      //
      theme={theme}
      //
      // the local storage key to use.
      modeStorageKey="theme"
      //
      // set as root provider
      disableNestedContext
    >
      <App />
    </CssVarsProvider>
  );
}

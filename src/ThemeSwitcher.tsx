import * as React from 'react';
import { Switch, useColorScheme } from '@mui/joy';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';

export default function ThemeSwitcher() {

  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  document.body.classList.add(mode as string);

  return (
      <Switch
          color="neutral"
          checked={mode == "dark"}
          startDecorator={<LightModeOutlined />}
          endDecorator={<DarkModeOutlined />}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked)
            {
                setMode("dark");
                document.body.classList.remove("light");
                document.body.classList.add("dark");
            }
            else
            {
                setMode("light");
                document.body.classList.remove("dark");
                document.body.classList.add("light");
            }
          }}
      ></Switch>
  );

}
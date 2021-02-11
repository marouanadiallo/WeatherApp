import React from 'react';
import * as eva from '@eva-design/eva';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { StatusBar } from 'react-native';

import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { default as mytheme } from './custom-theme.json';
import { AppNavigator } from './src/navigation/Navigation.component.js';
import { ThemeContext } from './src/modules/theme-context.js';

export default () => {
  const styleTypes = ['default','dark-content', 'light-content'];
  const [theme, setTheme] = React.useState('light');
  const [styleStatusBar, setStyleStatusBar] = React.useState(styleTypes[0]);

  const toggleTheme = () => {
    if (theme === 'light') {
      const nextTheme = 'dark';
      setStyleStatusBar(styleTypes[1])
      setTheme(nextTheme);
    }
    else
    {
      const nextTheme = 'light';
      setStyleStatusBar(styleTypes[2])
      setTheme(nextTheme);
    }
  };
  

  return (
    <>
      <IconRegistry icons={EvaIconsPack}/>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={{...eva[theme],...mytheme}}> 
          <AppNavigator/>
        </ApplicationProvider>
        <StatusBar barStyle={styleStatusBar} backgroundColor={mytheme['color-primary-500']}/>
      </ThemeContext.Provider>
    </>
  );
}


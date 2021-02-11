import React from 'react';
import { Icon} from '@ui-kitten/components';

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const toogleThemeIconOutiline = (props) => (
  <Icon {...props} name='moon-outline'/>
);
export const toogleThemeIconFill = (props) => (
  <Icon {...props} name='moon'/>
);
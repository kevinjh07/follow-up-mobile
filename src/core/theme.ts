import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
  },
  displayMedium: {
    fontFamily: 'System',
  },
  displaySmall: {
    fontFamily: 'System',
  },
  headlineLarge: {
    fontFamily: 'System',
  },
  headlineMedium: {
    fontFamily: 'System',
  },
  headlineSmall: {
    fontFamily: 'System',
  },
  titleLarge: {
    fontFamily: 'System',
  },
  titleMedium: {
    fontFamily: 'System',
  },
  titleSmall: {
    fontFamily: 'System',
  },
  bodyLarge: {
    fontFamily: 'System',
  },
  bodyMedium: {
    fontFamily: 'System',
  },
  bodySmall: {
    fontFamily: 'System',
  },
  labelLarge: {
    fontFamily: 'System',
  },
  labelMedium: {
    fontFamily: 'System',
  },
  labelSmall: {
    fontFamily: 'System',
  },
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
};

export const theme = lightTheme;

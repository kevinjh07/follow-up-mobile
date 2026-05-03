import React from 'react';

export const TextInput = ({ placeholder, ...props }) => React.createElement('input', { 'data-placeholder': placeholder, ...props });
export const Button = ({ children, onPress, ...props }) => React.createElement('button', { onClick: onPress, ...props }, children);
export const Text = ({ children, ...props }) => React.createElement('span', props, children);
export const Title = ({ children, ...props }) => React.createElement('h1', props, children);
export const Paragraph = ({ children, ...props }) => React.createElement('p', props, children);

export const useTheme = () => ({
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#888888',
    error: '#b00020',
  },
});

export const ActivityIndicator = ({ ...props }) => React.createElement('div', props);
export const Provider = ({ children }) => React.createElement(React.Fragment, null, children);
export const DefaultTheme = {};
export const DarkTheme = {};
export const Appbar = { Header: 'Appbar.Header', Content: 'Appbar.Content', Action: 'Appbar.Action' };
export const BottomNavigation = 'BottomNavigation';
export const Menu = { Provider: ({ children }) => children, Item: 'Menu.Item' };
export const Dialog = { Title: 'Dialog.Title', Content: 'Dialog.Content', Actions: 'Dialog.Actions' };
export const Portal = ({ children }) => React.createElement(React.Fragment, null, children);
export const Snackbar = 'Snackbar';
export const FAB = 'FAB';
export const List = { Item: 'List.Item' };
export const Card = { Content: 'Card.Content' };

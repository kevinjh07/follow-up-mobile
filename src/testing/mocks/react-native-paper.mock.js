import React from 'react';

export const TextInput = React.forwardRef(({ label, placeholder, value, onChangeText, ...props }, ref) =>
  React.createElement('input', {
    'data-label': label,
    'data-placeholder': placeholder,
    'data-value': value,
    onChange: (e) => onChangeText?.(e.target.value),
    ref,
    ...props,
  })
);
TextInput.displayName = 'TextInput';

export const Button = ({ children, onPress, disabled, loading, accessibilityLabel, ...props }) =>
  React.createElement('button', {
    onClick: onPress,
    disabled: disabled || loading,
    'data-loading': loading ? 'true' : undefined,
    'aria-label': accessibilityLabel,
    ...props,
  }, children);
Button.displayName = 'Button';

export const Text = ({ children, style, ...props }) =>
  React.createElement('span', { style, ...props }, children);
Text.displayName = 'Text';

export const Title = ({ children, style, ...props }) =>
  React.createElement('h2', { style, ...props }, children);
Title.displayName = 'Title';

export const Paragraph = ({ children, style, ...props }) =>
  React.createElement('p', { style, ...props }, children);
Paragraph.displayName = 'Paragraph';

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

export const ActivityIndicator = ({ size, accessibilityLabel, ...props }) =>
  React.createElement('div', { 'aria-label': accessibilityLabel, 'data-size': size, ...props });
ActivityIndicator.displayName = 'ActivityIndicator';

export const Provider = ({ children }) => children;
Provider.displayName = 'Provider';

export const DefaultTheme = { colors: { primary: '#6200ee' } };
export const DarkTheme = { colors: { primary: '#BB86FC' } };

export const Appbar = ({ children, style, ...props }) =>
  React.createElement('header', { style, ...props }, children);
Appbar.Header = function AppbarHeader({ children, style }) {
  return React.createElement('div', { style }, children);
};
Appbar.Content = function AppbarContent({ title, subtitle }) {
  return React.createElement('div', null, [title, subtitle].filter(Boolean).join(' '));
};
Appbar.BackAction = function AppbarBackAction({ onPress, accessibilityLabel, ...props }) {
  return React.createElement('button', { onClick: onPress, 'aria-label': accessibilityLabel, ...props }, '←');
};
Appbar.Action = function AppbarAction({ icon, onPress, accessibilityLabel, ...props }) {
  return React.createElement('button', { onClick: onPress, 'aria-label': accessibilityLabel, ...props }, icon);
};

export const Menu = { Provider: function MenuProvider({ children }) { return children; } };

export const Dialog = {
  Title: function DialogTitle({ children }) { return React.createElement('h3', null, children); },
  Content: function DialogContent({ children }) { return React.createElement('div', null, children); },
  Actions: function DialogActions({ children }) { return React.createElement('div', null, children); },
};

export const Portal = function Portal({ children }) { return children; };

export const Snackbar = function Snackbar({ message, visible, onDismiss }) {
  return visible ? React.createElement('div', { onClick: onDismiss }, message) : null;
};

export const FAB = function FAB({ icon, onPress, accessibilityLabel, style, label, ...props }) {
  return React.createElement('button', {
    onClick: onPress,
    'aria-label': accessibilityLabel || label,
    'data-icon': icon,
    style: { position: 'absolute', ...style },
    ...props,
  }, label || icon);
};
FAB.displayName = 'FAB';

export const List = {
  Item: function ListItem({ title, description, right, accessibilityRole, accessibilityLabel, onPress, ...props }) {
    return React.createElement('div', {
      role: accessibilityRole || 'button',
      'aria-label': accessibilityLabel,
      onClick: onPress,
      ...props,
    }, [
      React.createElement('span', { key: 'title' }, title),
      description && React.createElement('span', { key: 'desc' }, description),
      right && React.createElement('span', { key: 'right' }, typeof right === 'function' ? right() : right),
    ].filter(Boolean));
  },
};

export const Card = function Card({ children, style, onPress, ...props }) {
  return React.createElement('div', { style, onClick: onPress, ...props }, children);
};
Card.Content = function CardContent({ children }) { return React.createElement('div', null, children); };

export const Chip = function Chip({ children, style, ...props }) {
  return React.createElement('span', { style, ...props }, children);
};

export const RefreshControl = function RefreshControl({ refreshing, onRefresh }) {
  return React.createElement('div', { 'data-refreshing': refreshing, onClick: onRefresh });
};

export const ScrollView = function ScrollView({ children, style, contentContainerStyle, ...props }) {
  return React.createElement('div', { style: { ...style, ...contentContainerStyle }, ...props }, children);
};

export const View = function View({ children, style, ...props }) {
  return React.createElement('div', { style, ...props }, children);
};

export const FlatList = function FlatList({ data, renderItem, keyExtractor, testID, refreshControl, contentContainerStyle, style, ...props }) {
  const items = data || [];
  return React.createElement('div', {
    'data-testid': testID,
    style: { ...style, ...contentContainerStyle },
    ...props,
  }, items.map((item, index) => {
    const key = keyExtractor ? keyExtractor(item, index) : String(index);
    return renderItem ? React.createElement(React.Fragment, { key }, renderItem({ item, index })) : null;
  }));
};
FlatList.displayName = 'FlatList';
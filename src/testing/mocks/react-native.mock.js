// Mock completo do react-native para testes
module.exports = {
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Button: 'Button',
  Image: 'Image',
  ScrollView: 'ScrollView',
  FlatList: ({ data, renderItem, keyExtractor, testID, refreshControl, contentContainerStyle, style }) => {
    const items = data || [];
    return {
      type: 'FlatList',
      props: { testID, refreshControl },
      children: items.map((item, index) => {
        const RenderItem = renderItem;
        return RenderItem ? RenderItem({ item, index }) : null;
      }),
    };
  },
  SectionList: 'SectionList',
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  ActivityIndicator: 'ActivityIndicator',
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios,
    Version: '14.0',
  },
  StyleSheet: {
    create: (styles) => ({ ...styles }),
    flatten: (style) => style,
    absoluteFill: {},
    absoluteFillObject: {},
    hairlineWidth: 1,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  StatusBar: {
    currentHeight: 20,
    setBarStyle: jest.fn(),
    setBackgroundColor: jest.fn(),
  },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  SafeAreaView: 'SafeAreaView',
  useColorScheme: () => 'light',
  Appearance: {
    getColorScheme: () => 'light',
    addChangeListener: jest.fn(),
  },
  AccessibilityInfo: {
    fetch: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  NativeModules: {
    I18nManager: { isRTL: false, doLeftAndRightSwapInRTL: false },
  },
  I18nManager: {
    isRTL: false,
    doLeftAndRightSwapInRTL: false,
  },
  UIManager: {
    getViewManagerConfig: jest.fn(),
  },
  findNodeHandle: jest.fn(),
  Animated: {
    timing: jest.fn(),
    spring: jest.fn(),
    decay: jest.fn(),
    parallel: jest.fn(),
    sequence: jest.fn(),
    Value: jest.fn(),
    View: 'Animated.View',
    Text: 'Animated.Text',
    Image: 'Animated.Image',
    createAnimatedComponent: (component) => component,
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
  InteractionManager: {
    runAfterInteractions: jest.fn((cb) => cb()),
  },
};

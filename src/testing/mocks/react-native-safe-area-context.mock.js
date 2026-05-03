module.exports = {
  SafeAreaProvider: 'SafeAreaProvider',
  SafeAreaConsumer: 'SafeAreaConsumer',
  SafeAreaView: 'SafeAreaView',
  useSafeArea: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  initialWindowMetrics: {
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
    frame: { x: 0, y: 0, width: 375, height: 812 },
  },
};

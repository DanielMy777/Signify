import React, {useMemo, useState, useEffect} from 'react';
import {
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import Animated, {EasingNode, stopClock} from 'react-native-reanimated';

const imageSize = {
  width: 198,
  height: 2409,
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const animatedWidth = screenWidth + imageSize.width;
const animatedHeight = screenHeight + imageSize.height;

const {
  useCode,
  block,
  set,
  Value,
  Clock,
  eq,
  clockRunning,
  not,
  cond,
  startClock,
  timing,
  interpolateNode,
  and,
} = Animated;

const runTiming = clock => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 20000,
    toValue: 1,
    easing: EasingNode.inOut(EasingNode.linear),
  };

  return block([
    // we run the step here that is going to update position
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config),
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

export const AnimatedBackground = () => {
  const [play, setPlay] = useState(true);
  const {progress, clock, isPlaying} = useMemo(
    () => ({
      progress: new Value(0),
      isPlaying: new Value(play),
      clock: new Clock(),
    }),
    [],
  );

  useEffect(() => {
    isPlaying.setValue(play ? 1 : 0);
  }, [play]);

  useCode(
    () =>
      block([
        cond(
          and(not(clockRunning(clock)), eq(isPlaying, 1)),
          startClock(clock),
        ),
        cond(and(clockRunning(clock), eq(isPlaying, 0)), stopClock(clock)),
        set(progress, runTiming(clock)),
      ]),
    [progress, clock],
  );

  const translateX = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, imageSize.height * 2],
  });

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => setPlay(!play)}>
      <Animated.View
        style={[styles.image, {transform: [{translateY: translateX}]}]}>
        <Image
          style={styles.image}
          source={require('../../../resources/images/SignifyScreen.jpg')}
          resizeMode="stretch"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    top: -imageSize.height,
    width: '100%',
    height: animatedHeight + imageSize.height,
  },
});

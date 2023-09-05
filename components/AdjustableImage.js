import React from 'react';
import { Image, View, StyleSheet, PanResponder } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Value, event, block, cond, set, eq, add, sub } from 'react-native-reanimated';

const AdjustableImage = ({ source: { uri }, style }) => {

  const imageWidth = 100; // Set the initial image width
  const imageHeight = 100; // Set the initial image height

  const scale = new Value(1);
  const lastScale = new Value(1);
  const offsetX = new Value(0);
  const offsetY = new Value(0);

  const gestureState = new Value(State.UNDETERMINED);

  const onGestureEvent = event([
    {
      nativeEvent: {
        scale,
        state: gestureState,
      },
    },
  ]);

  const onPinchGestureEvent = event([
    {
      nativeEvent: {
        scale,
        state: gestureState,
      },
    },
  ]);

  const onPinchHandlerStateChange = event([
    {
      nativeEvent: {
        state: gestureState,
      },
    },
  ]);

  const onZoomHandlerStateChange = event([
    {
      nativeEvent: {
        state: gestureState,
      },
    },
  ]);

  const translateX = new Value(0);
  const translateY = new Value(0);

  const gestureHandlers = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Handle panning here if needed
    },
    onPanResponderRelease: () => {
      // Handle panning release if needed
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Animated.View style={{ flex: 1, backgroundColor: 'blue' }}>
          <Animated.Image
            source={{ uri }}
            resizeMode={'contain'}
            style={[
              { flex: 1, backgroundColor: 'red' },
              // {
              //   transform: [
              //     { translateX },
              //     { translateY },
              //     {
              //       scale: cond(
              //       gestureState,
              //       block([
              //         cond(
              //           eq(gestureState, State.ACTIVE),
              //           [
              //             set(
              //               translateX,
              //               cond(
              //                 eq(lastScale, 1),
              //                 add(translateX, sub(scale, 1)),
              //                 add(translateX, sub(scale, lastScale)),
              //               ),
              //             ),
              //             set(
              //               translateY,
              //               cond(
              //                 eq(lastScale, 1),
              //                 add(translateY, sub(scale, 1)),
              //                 add(translateY, sub(scale, lastScale)),
              //               ),
              //             ),
              //             set(lastScale, scale),
              //           ],
              //           [set(lastScale, 1)],
              //         ),
              //       ]),
              //     )},
              //   ],
              // },
            ]}
          />
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  image: {
    // width: imageWidth, // Set the initial image width
    // height: imageHeight, // Set the initial image height
  },
});

// const AdjustableImage = ({ style, source }) => {
//   return (
//     <View style={style}>
//       <Image
//         style={{ flex: 1, width: null, height: null }}
//         source={source}
//         resizeMode="contain"
//       />
//     </View>
//   )
// }

export default AdjustableImage;

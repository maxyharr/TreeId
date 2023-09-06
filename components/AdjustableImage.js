import React from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { Value, event, block, cond, set, eq, add, sub } from 'react-native-reanimated';
import Animated, {
  runOnJS, useAnimatedStyle,
  useSharedValue, withTiming,
  withSpring,
} from 'react-native-reanimated';

const AdjustableImage = ({ media, onChange }) => {
  const isPressed = useSharedValue(false);

  const minimumScale = media.height > media.width ? media.height / media.width : media.width / media.height;
  const initialScale = useSharedValue(minimumScale);
  const scale = useSharedValue(minimumScale);

  const initialFocal = useSharedValue({ x: 0, y: 0 });
  const translate = useSharedValue({ x: 0, y: 0 });

  const initialPan = useSharedValue({ x: 0, y: 0 });

  const emitChanges = () => {
    const resize = {
      width: 1 / scale.value,
      height: 1 / scale.value
    }

    const crop = {
      originX: -translate.value.x / scale.value,
      originY: -translate.value.y / scale.value,
      width: media.width / scale.value,
      height: media.height / scale.value,
    }

    const changes = {
      crop,
      resize
    }

    onChange(changes);
  }

  const pinchGesture = //React.useMemo(() => {
    Gesture.Pinch()
      .onBegin((e) => {
        isPressed.value = true;
        initialScale.value = scale.value;
        initialFocal.value = { x: e.focalX - translate.value.x, y: e.focalY - translate.value.y };
      })
      .onUpdate((e) => {
        if (e.numberOfPointers != 2) return;

        const focalDelta = {
          x: e.focalX - initialFocal.value.x,
          y: e.focalY - initialFocal.value.y,
        };

        translate.value = {
          x: focalDelta.x,
          y: focalDelta.y,
        };

        scale.value = initialScale.value * e.scale;
      })
      .onFinalize(() => {
        if (scale.value < minimumScale) {
          scale.value = withSpring(minimumScale, { damping: 10 });
        }

        isPressed.value = false;
        runOnJS(emitChanges)();
      });
  // }, [ isPressed, initialScale, scale, initialFocal, translate ])

  const panGesture = //React.useMemo(() => {
    Gesture.Pan()
      .onBegin((e) => {
        isPressed.value = true;
        initialPan.value = { x: e.x - translate.value.x, y: e.y - translate.value.y };
      })
      .onTouchesMove((e) => {
        const panDelta = {
          x: e.allTouches[0].x - initialPan.value.x,
          y: e.allTouches[0].y - initialPan.value.y,
        };

        translate.value = {
          x: panDelta.x,
          y: panDelta.y,
        };
      })
      .onFinalize(() => {
        isPressed.value = false;
        runOnJS(emitChanges)();
      });
  // }, [ isPressed, initialPan, translate ])

  const imageAnimatedStyles = useAnimatedStyle(() => {

    return {
      transform: [
        {
          scale: scale.value
        },
        {
          translate: [ translate.value.x, translate.value.y ]
        },
      ],
    };
  });

  const gridAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: isPressed.value ? withTiming(1, { duration: 200 }) : withTiming(0, { duration: 200 }),
    };
  });

  const imageLayoutLoaded = (e) => {
    const { width, height } = e.nativeEvent.layout;
    console.log('Image Component Height: ', height);
    console.log('media height: ', media.height);
    console.log('media width: ', media.width);
    // const imageAspectRatio = width / height;
    // const deviceAspectRatio = deviceWidth / deviceHeight;

    // const initialScale = imageAspectRatio > deviceAspectRatio
    //   ? deviceWidth / width
    //   : deviceHeight / height;

    // scale.value = initialScale;
  }

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={Gesture.Exclusive(pinchGesture, panGesture)}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.Image
            onLayout={(e) => imageLayoutLoaded(e)}
            source={{ uri: media.uri }}
            resizeMode={'contain'}
            style={[
              { flex: 1 },
              imageAnimatedStyles
            ]}
          />
          {/* Position absolute grid overlay */}
          <Animated.View style={[
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
            gridAnimatedStyles,
          ]}>
            <Animated.View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />

              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />

              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
              <Animated.View style={{ width: '33.3%', height: '33.3%', borderWidth: 0.3, borderColor: 'lightgray' }} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default AdjustableImage;

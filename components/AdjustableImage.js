import React from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { Value, event, block, cond, set, eq, add, sub } from 'react-native-reanimated';
import Animated, {
  runOnJS, useAnimatedStyle,
  useSharedValue, withTiming,
  withSpring,
  runOnUI,
} from 'react-native-reanimated';

const AdjustableImage = ({ media, onChange }) => {
  // TODO: Handle case where AdjustableImage component doesn't take up the full screen width
  const viewWidth = Dimensions.get('window').width;

  const mediaIsPortrait = (media) => {
    return media.height > media.width;
  }

  const scaledToScreenPixels = (media, mediaProperty, scaleTo) => {
    // imagePixels will be something like 3000 (the width of the image)
    // Want to return something like 300 (width of the view)
    const mediaPixels = media[mediaProperty];
    const useWidthToNormalize = mediaIsPortrait(media);
    const scaleNumerator = scaleTo;
    const scaleDemoninator = useWidthToNormalize ? media.width : media.height;
    const scale = scaleNumerator / scaleDemoninator;

    const scaled = mediaPixels * scale;

    return Math.trunc(scaled);
  }

  const getInitialScale = (media) => {
    return mediaIsPortrait(media) ? media.height / media.width : media.width / media.height;
  }

  const getInitialTranslateX = (media, scaledMediaWidth, viewWidth, scale) => {
    return mediaIsPortrait(media) ? 0 : ((scaledMediaWidth - viewWidth) / 2) / scale
  }

  const getInitialTranslateY = (media, scaledMediaHeight, viewWidth, scale) => {
    return mediaIsPortrait(media) ? ((scaledMediaHeight - viewWidth) / 2) / scale : 0;
  }

  const scale = useSharedValue(1);

  const touchDownX = useSharedValue(0);
  const touchDownY = useSharedValue(0);

  const translateStartX = useSharedValue(0);
  const translateStartY = useSharedValue(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const isPressed = useSharedValue(false);

  const scaledMediaWidth = scaledToScreenPixels(media, 'width', viewWidth);
  const scaledMediaHeight = scaledToScreenPixels(media, 'height', viewWidth);
  const initialScale = getInitialScale(media);
  const initialTranslateX = getInitialTranslateX(media, scaledMediaWidth, viewWidth, initialScale);
  const initialTranslateY = getInitialTranslateY(media, scaledMediaHeight, viewWidth, initialScale);

  scale.value = initialScale;
  translateX.value = initialTranslateX;
  translateY.value = initialTranslateY;

  const emitChanges = () => {
    const crop = {
      originX: translateX.value - initialTranslateX,
      originY: translateY.value - initialTranslateY,
      width: media.width,
      height: media.width,
    }

    const changes = {
      crop,
    }

    onChange(changes);
  }

  const panGesture = React.useMemo(() => Gesture.Pan()
    .onBegin((e) => {
      isPressed.value = true;
      const x = e.x;
      const y = e.y;

      touchDownX.value = x;
      touchDownY.value = y;

      translateStartX.value = translateX.value;
      translateStartY.value = translateY.value;
    })
    .onTouchesMove((e) => {
      const x = e.changedTouches[0].x;
      const y = e.changedTouches[0].y;

      const deltaX = x - touchDownX.value;
      const deltaY = y - touchDownY.value;

      let translateXTo = translateStartX.value + deltaX;
      let translateYTo = translateStartY.value + deltaY;

      if (translateXTo != 0) {
        translateXTo = 0;
      }

      if (translateYTo > initialTranslateY) {
        translateYTo = initialTranslateY;
      } else if (translateYTo < -initialTranslateY) {
        translateYTo = -initialTranslateY;
      }

      translateX.value = translateXTo;
      translateY.value = translateYTo;
    })
    .onEnd((e) => {
      isPressed.value = false;
      runOnJS(emitChanges)();
    })
  , [isPressed, touchDownX, touchDownY, translateStartX, translateStartY, translateX, translateY, initialTranslateY, emitChanges]);

  const gridAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: isPressed.value ? withTiming(1, { duration: 200 }) : withTiming(0, { duration: 200 }),
    };
  });

  React.useEffect(() => {
    emitChanges();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={Gesture.Exclusive(/*pinchGesture,*/ panGesture)}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.Image
            source={{ uri: media.uri }}
            resizeMode={'contain'}
            style={[
              { flex: 1 },
              {
                transform: [
                  {
                    scale: scale
                  },
                  {
                    translateX: translateX
                  },
                  {
                    translateY: translateY
                  }
                ],
              }
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

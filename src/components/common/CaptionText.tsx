import React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { useColors } from '../../hook/useColors';

interface CaptionTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  backgroundColor?: string;
  useOverlay?: boolean;
  overlayOpacity?: number;
  textShadow?: boolean;
  shadowIntensity?: 'light' | 'medium' | 'strong';
  adaptiveColor?: boolean; // New prop for adaptive coloring
}

export const CaptionText: React.FC<CaptionTextProps> = ({
  children,
  style,
  backgroundColor,
  useOverlay = true,
  overlayOpacity = 0.6,
  textShadow = true,
  shadowIntensity = 'medium',
  adaptiveColor = false,
}) => {
  const C = useColors();

  // Shadow configurations with theme-aware colors
  const shadowConfigs = {
    light: {
      textShadowColor: C.captionOverlay,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    medium: {
      textShadowColor: C.captionOverlay,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    strong: {
      textShadowColor: C.captionOverlay,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
  };

  const shadowStyle = textShadow ? shadowConfigs[shadowIntensity] : {};

  const textStyle: TextStyle = {
    color: adaptiveColor ? C.textPrimary : '#ffffff', // Adaptive or always white for maximum contrast on images
    fontWeight: '600',
    textAlign: 'center',
    ...shadowStyle,
    ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
  };

  if (useOverlay) {
    return (
      <View
        style={{
          backgroundColor: backgroundColor || C.captionOverlay,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  }

  return <Text style={textStyle}>{children}</Text>;
};

// Preset components for common use cases
export const CaptionOverlay: React.FC<{
  text: string;
  style?: TextStyle | TextStyle[];
  containerStyle?: any;
}> = ({ text, style, containerStyle }) => (
  <View
    style={[
      {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        alignItems: 'center',
      },
      containerStyle,
    ]}
  >
    <CaptionText
      style={[{ fontSize: 16 }, ...(Array.isArray(style) ? style : style ? [style] : [])]}
      useOverlay={true}
      overlayOpacity={0.7}
      shadowIntensity="strong"
    >
      {text}
    </CaptionText>
  </View>
);

export const FloatingCaption: React.FC<{
  text: string;
  position?: 'top' | 'center' | 'bottom';
  style?: TextStyle | TextStyle[];
}> = ({ text, position = 'bottom', style }) => {
  const positionStyle = {
    top: { top: 20 },
    center: { top: '50%' as const, transform: [{ translateY: -12 }] },
    bottom: { bottom: 20 },
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: 16,
          right: 16,
          alignItems: 'center',
        },
        positionStyle[position],
      ]}
    >
      <CaptionText
        style={[{ fontSize: 14 }, ...(Array.isArray(style) ? style : style ? [style] : [])]}
        useOverlay={false}
        textShadow={true}
        shadowIntensity="strong"
      >
        {text}
      </CaptionText>
    </View>
  );
};
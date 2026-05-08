import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../hook/useColors';
import { useTheme } from '../../context/ThemeContext';

interface SafeContainerProps {
  children: React.ReactNode;
  useGradient?: boolean;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
}

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  useGradient = true,
  backgroundColor,
  edges = ['top', 'bottom'],
  statusBarStyle,
}) => {
  const C = useColors();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const statusBar = statusBarStyle || (isDark ? 'light-content' : 'dark-content');
  const bgColor = backgroundColor || C.bg;

  if (useGradient) {
    return (
      <>
        <StatusBar 
          barStyle={statusBar} 
          translucent 
          backgroundColor="transparent" 
        />
        <LinearGradient colors={C.bgGradient} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }} edges={edges}>
            {children}
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle={statusBar} 
        translucent 
        backgroundColor="transparent" 
      />
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <SafeAreaView style={{ flex: 1 }} edges={edges}>
          {children}
        </SafeAreaView>
      </View>
    </>
  );
};

// Manual safe area component for custom layouts
export const ManualSafeArea: React.FC<{
  children: React.ReactNode;
  useGradient?: boolean;
  backgroundColor?: string;
}> = ({ children, useGradient = true, backgroundColor }) => {
  const C = useColors();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const statusBar = isDark ? 'light-content' : 'dark-content';
  const bgColor = backgroundColor || C.bg;

  if (useGradient) {
    return (
      <>
        <StatusBar 
          barStyle={statusBar} 
          translucent 
          backgroundColor="transparent" 
        />
        <LinearGradient colors={C.bgGradient} style={{ flex: 1 }}>
          {/* Top safe area */}
          <View style={{ height: insets.top, backgroundColor: C.bgGradient[0] }} />
          <View style={{ flex: 1 }}>
            {children}
          </View>
          {/* Bottom safe area */}
          <View style={{ height: insets.bottom, backgroundColor: C.bgGradient[2] }} />
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle={statusBar} 
        translucent 
        backgroundColor="transparent" 
      />
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        {/* Top safe area */}
        <View style={{ height: insets.top, backgroundColor: bgColor }} />
        <View style={{ flex: 1 }}>
          {children}
        </View>
        {/* Bottom safe area */}
        <View style={{ height: insets.bottom, backgroundColor: bgColor }} />
      </View>
    </>
  );
};
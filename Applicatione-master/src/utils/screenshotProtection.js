import { useEffect } from 'react';
import { Platform } from 'react-native';
import ScreenshotPrevent from 'react-native-screenshot-prevent';
import FlagSecureAndroid from 'react-native-flag-secure-android';

/**
 * Enable screenshot prevention across the entire app
 * This function disables screenshots on both Android and iOS
 */
export const enableScreenshotProtection = async () => {
  try {
    if (Platform.OS === 'android') {
      // Enable FLAG_SECURE on Android using both libraries for maximum protection
      ScreenshotPrevent.enableSecureView();
      FlagSecureAndroid.activate();
      console.log('Screenshot protection enabled on Android');
    } else if (Platform.OS === 'ios') {
      // Enable privacy screen on iOS
      ScreenshotPrevent.enableSecureView();
      console.log('Screenshot protection enabled on iOS');
    }
    console.log('Screenshot protection enabled globally');
  } catch (error) {
    console.error('Failed to enable screenshot protection:', error);
  }
};

/**
 * Disable screenshot prevention (use carefully)
 */
export const disableScreenshotProtection = async () => {
  try {
    if (Platform.OS === 'android') {
      ScreenshotPrevent.disableSecureView();
      FlagSecureAndroid.deactivate();
      console.log('Screenshot protection disabled on Android');
    } else if (Platform.OS === 'ios') {
      ScreenshotPrevent.disableSecureView();
      console.log('Screenshot protection disabled on iOS');
    }
    console.log('Screenshot protection disabled');
  } catch (error) {
    console.error('Failed to disable screenshot protection:', error);
  }
};

/**
 * Hook to enable screenshot protection
 * Use this in your main App component
 */
export const useScreenshotProtection = (enabled = true) => {
  useEffect(() => {
    if (enabled) {
      enableScreenshotProtection();
    }
    
    return () => {
      // Optionally disable on unmount if needed
      // disableScreenshotProtection();
    };
  }, [enabled]);
};

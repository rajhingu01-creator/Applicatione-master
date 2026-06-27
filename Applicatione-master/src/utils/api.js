import Constants from "expo-constants";
import { Platform } from "react-native";

const getDevBackendHost = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.expoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest2?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:5000`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }

  return "http://localhost:5000";
};

export const BASE_URL = getDevBackendHost();
export const API_URL = `${BASE_URL}/api`;

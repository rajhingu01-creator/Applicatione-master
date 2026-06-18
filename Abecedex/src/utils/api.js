import Constants from 'expo-constants';

const getDevBackendHost = () => {
  const debuggerHost = Constants.manifest?.debuggerHost || Constants.manifest2?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:5000`;
  }
  return 'http://192.168.1.3:5000';
};

export const BASE_URL = getDevBackendHost();
export const API_URL = `${BASE_URL}/api`;

type EnvShape = {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID: string;
};

function readEnv(key: keyof EnvShape) {
  const value = (import.meta as any).env[key];
  if (!value) {
    if ((import.meta as any).env.DEV) {
      console.warn(`Missing env var: ${key}. Using empty string for dev.`);
      return "";
    }
    throw new Error(`Missing env var: ${key}`);
  }
  return value as string;
}

export const env = {
  firebaseApiKey: readEnv("VITE_FIREBASE_API_KEY"),
  firebaseAuthDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  firebaseProjectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
  firebaseStorageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  firebaseMessagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  firebaseAppId: readEnv("VITE_FIREBASE_APP_ID"),
  firebaseMeasurementId: readEnv("VITE_FIREBASE_MEASUREMENT_ID")
};

import * as SecureStore from "expo-secure-store";

// save a key-value pair in the secure store (like localStorage on the web)
// key: string - saving access token and refresh token
export async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// get the value for a key from the secure store - get access token and refresh token
export async function getValueFor(key) {
  const result = await SecureStore.getItemAsync(key);
  return result ? result : null;
}

// delete the value for a key from the secure store - delete access token and refresh token
export async function deleteValueFor(key) {
  await SecureStore.deleteItemAsync(key);
}

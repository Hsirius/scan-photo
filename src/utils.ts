export const checkCamera = async () => {
  const navigator = window.navigator.mediaDevices;
  const device = await navigator.enumerateDevices();
  console.log(device);
};

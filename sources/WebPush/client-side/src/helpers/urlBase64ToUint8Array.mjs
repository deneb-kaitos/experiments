// https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6

export const urlBase64ToUint8Array = (pk = null) => {
  if (pk === null) {
    throw new ReferenceError('pk is undefined');
  }

  const padding = '='.repeat((4 - pk.length % 4) % 4);
  const base64 = (pk + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

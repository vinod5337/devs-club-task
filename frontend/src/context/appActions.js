export const TOKEN = 'TOKEN';

export const setUserToken = data => ({
    type: TOKEN,
    payload: data,
});

export const setToken = (token, hours) => {
    const now = new Date();
    const expiryTime = now.getTime() + hours * 60 * 60 * 1000;
    const tokenData = {
      value: token,
      expiry: expiryTime
    };
    localStorage.setItem('accessToken', JSON.stringify(tokenData));
  };
  
  export const getToken = () => {
    const tokenData = JSON.parse(localStorage.getItem('accessToken'));
    if (!tokenData) {
      return null;
    }
  
    const now = new Date();
    if (now.getTime() > tokenData.expiry) {
      localStorage.removeItem('accessToken');
      return null;
    }
    return tokenData.value;
  };
  
  export const removeToken = () => {
    localStorage.removeItem('accessToken');
  };
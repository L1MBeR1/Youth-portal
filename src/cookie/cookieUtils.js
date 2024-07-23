import Cookies from 'js-cookie';

export const setCookie = (name, value, hours=2, options = {}) => {
  if (hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    Cookies.set(name, value, { ...options, expires: date });
  } else {
    Cookies.set(name, value, options);
  }
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};

export const updateCookie = (name, value, hours, options = {}) => {
  if (Cookies.get(name)) {
    setCookie(name, value, hours, options);
  }
};

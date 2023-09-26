/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'http://api-laravel-project/api/V1';

// returns a promise resolved after a given delay
function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}


function request(
  url,
  method = 'GET',
  data = null, // we can send any data to the server
) {
  const options = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }
  
  // we wait for testing purpose to see loaders
  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: (url) => request(url),
  post: (url, data) => request(url, 'POST', data),
  patch: (url, data) => request(url, 'PATCH', data),
  delete: (url) => request(url, 'DELETE'),
};

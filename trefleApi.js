const LAMBDA_URL = 'https://qlmo44yj2kp45mumk4aju22fxe0hgxbi.lambda-url.us-west-1.on.aws/';

const buildRequest = async ({url, method, body}) => {
  const response = await fetch(LAMBDA_URL, {
    method: 'POST',
    body: JSON.stringify({url, method, body, headers: { 'Content-Type': 'application/json' }})
  });
  const data = await response.json();
  return data;
}

const request = {
  get: async (url) => {
    return buildRequest({url, method: 'GET'});
  },
  post: async (url, body) => {
    return buildRequest({url, method: 'POST', body});
  },
  put: async (url, body) => {
    return buildRequest({url, method: 'PUT', body});
  },
  delete: async (url) => {
    return buildRequest({url, method: 'DELETE'});
  }
}

const trefleApi = {
  searchPlants: async (query) => {
    try {
      const response = await request.get(`https://trefle.io/api/v1/plants/search?token=ACCESS_TOKEN&q=${query}`);
      return {data: response.data, error: null};
    } catch (error) {
      console.error('Error searching plants: ', error);
      return {data: null, error};
    }
  }
}

export default trefleApi;

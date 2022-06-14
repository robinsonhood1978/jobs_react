import config from '../config'

const {baseURL} = config;
const axios = require('axios').create({
  baseURL,            
  timeout: 0,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  maxContentLength: 2000,
  transformResponse: [(data) => {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    return data;
  }]
});

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'

// get
export const _get = (req) => axios.get(req.url, {params: req.data});

// get with token
export const _gets = (req) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  }
  return axios.get(req.url, {headers});
}

// post
export const _post = (req) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  }
  return axios.post(req.url, req.data, {
    headers,
  });
}

// put
// export const _put = (req) => axios({method: 'put', url: `/${req.url}`, data: req.data});
export const _put = (req) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  }
  return axios.put(req.url, req.data, {
    headers,
  });
}

// delete
export const _delete = (req) => axios({method: 'delete', url: `/${req.url}`, data: req.data});

// export const _getNoWithCredentials = (url) => {
//     return axios({method: 'get', url: `/${url}`, withCredentials:false,proxyHeaders: false, credentials: false})
// };

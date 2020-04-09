import axios from 'axios';

const API_URL = process.env.VUE_APP_ROOT_API;
const Customer = 'api/v1/customer/';
const Driver = 'api/v1/driver/';

class AuthService {
  login(user) {
    let url;
    let body;
    if (user.type == "customer") {
      url = API_URL + Customer;
      body = {
        username: user.username,
        password: user.password
      };
    }
    else {
      url = API_URL + Driver;
      body = {
        phonenumber: user.phone_number,
        password: user.password
      };
    }
    return axios
      .post(url + 'login', body, {
        withCredentials: true
      })
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      });
  }

  logout(user) {
    let url;
    if (user.type == "customer") {
      url = API_URL + Customer;
    }
    else {
      url = API_URL + Driver;
    }
    return axios
      .post(url + 'logout', {}, {
        withCredentials: true
      })
      .then(() => {
        localStorage.removeItem('user');
      });
    
  }

  register(user) {
    let url;
    let body;
    if (user.type == "customer") {
      url = API_URL + Customer;
      body = {
        data: {
          attributes: {
            username: user.username,
            password: user.password
          }
        }
      };
    }
    else {
      url = API_URL + Driver;
      body = {
        data: {
          attributes: {
            phone_number: user.phone_number,
            password: user.password
          }
        }
      };
    }
    return axios
      .post(url, body, {
        withCredentials: true
      })
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      });
  }
}

export default new AuthService();

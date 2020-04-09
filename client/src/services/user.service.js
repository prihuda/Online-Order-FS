import axios from 'axios';

const API_URL = process.env.VUE_APP_ROOT_API;
const Customer = 'api/v1/customer/';
const Driver = 'api/v1/driver/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL);
  }

  getOrders(id) {
    return axios.get(API_URL + Driver + id + '/orders', { withCredentials: true });
  }

  getShortUrl() {
    return axios.get(API_URL + 'urls/new', { withCredentials: true });
  }

  /* getUrl(id) {
    return axios.get(API_URL + 'urls/' + id, { withCredentials: true });
  }

  searchDate(id, p1, p2) {
    return axios.get(API_URL + 'urls/' + id + '/search/', {
      params: {
        dates1: p1,
        dates2: p2
      },
      withCredentials: true 
    });
  } */

  /* addUrl(url) {
    return axios
      .post(API_URL + 'urls/new', {
        title: url.title,
        longURL: url.longUrl,
        shortURL: url.shortUrl
      }, {
        withCredentials: true
      });
  } */

  editProfile(user, id) {
    let url;
    let body;
    if (user.type == "customer") {
      url = API_URL + Customer;
      body = {
        data: {
          attributes: {
            full_name: user.full_name,
            email: user.email,
            phonenumber: user.phonenumber
          }
        }
        
      };
    }
    else {
      url = API_URL + Driver;
      body = {
        data: {
          attributes: {
            full_name: user.full_name,
            phone_number: user.phone_number
          }
        }
        
      };
    }
    return axios
      .put(url + id, body, {
        withCredentials: true
      });
  }

  setStatus(uid, id, status) {
    let url = API_URL + Driver;
    let body = {
      data: {
        attributes: {
          id: id,
          status: status
        }
      }
    };
    return axios
      .put(url + uid + '/status', body, {
        withCredentials: true
      });
  }
  
}

export default new UserService();

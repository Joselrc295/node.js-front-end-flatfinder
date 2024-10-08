import axios from "axios";

export default class Api {
  urlBase = "";
  token = "";

  constructor() {
    this.urlBase = process.env.REACT_APP_API_URL || "http://localhost:3000";
  
    this.token = localStorage.getItem("user_logged");
    if (this.token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
    }
  }

  post = (url, data) => {
    return axios.post(this.urlBase + url, data);
  };

  get = (url) => {
    return axios.get(this.urlBase + url);
  };

  patch = (url, data) => {
    return axios.patch(this.urlBase + url, data);
  };

  delete = (url) => {
    return axios.delete(this.urlBase + url);
  };
}

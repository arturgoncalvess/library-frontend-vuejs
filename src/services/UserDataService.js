import http from "./config.js";

class UserDataService {
  getAll() {
    return http.get("/User");
  }

  get(id) {
    return http.get(`/User/${id}`);
  }

  create(data) {
    return http.post("/User", data);
  }

  update(id, data) {
    return http.put(`/User/${id}`, data);
  }

  delete(id) {
    return http.delete(`/User/${id}`);
  }
}

export default new UserDataService();

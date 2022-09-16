import http from "./config.js";

class BookDataService {
  getAll() {
    return http.get("/Book");
  }

  get(id) {
    return http.get(`/Book/${id}`);
  }

  create(data) {
    return http.post("/Book", data);
  }

  update(id, data) {
    return http.put(`/Book/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Book/${id}`);
  }
}

export default new BookDataService();

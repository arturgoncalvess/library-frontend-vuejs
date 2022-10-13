import http from "./config.js";

class PublisherDataService {
  getAll() {
    return http.get("/Publisher");
  }

  get(id) {
    return http.get(`/Publisher/${id}`);
  }

  getByName(name) {
    return http.get(`/Publisher/?Name=${name}`);
  }

  create(data) {
    return http.post("/Publisher", data);
  }

  update(id, data) {
    return http.put(`/Publisher/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Publisher/${id}`);
  }
}

export default new PublisherDataService();

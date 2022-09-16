import http from "./config.js";

class RentalDataService {
  getAll() {
    return http.get("/Rental");
  }

  get(id) {
    return http.get(`/Rental/${id}`);
  }

  create(data) {
    return http.post("/Rental", data);
  }

  update(id, data) {
    return http.put(`/Rental/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Rental/${id}`);
  }
}

export default new RentalDataService();

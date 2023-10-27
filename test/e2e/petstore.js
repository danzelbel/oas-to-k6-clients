// Generator: oas-to-k6-clients

import http from "k6/http";
import { check } from "k6";

export class PetClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  updatePet(pet, params = undefined) {
    const body = JSON.stringify(pet);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.put(`${this.baseUrl}/pet`, body, params);
    check(res, {
      "PetClient.updatePet 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  addPet(pet, params = undefined) {
    const body = JSON.stringify(pet);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.post(`${this.baseUrl}/pet`, body, params);
    check(res, {
      "PetClient.addPet 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  findPetsByStatus(status = "available", params = undefined) {
    const qs = `status=${status}`;
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/pet/findByStatus?${qs}`, params);
    check(res, {
      "PetClient.findPetsByStatus 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  findPetsByTags(tags, params = undefined) {
    const qs = `tags=${tags.join("&tags=")}`;
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/pet/findByTags?${qs}`, params);
    check(res, {
      "PetClient.findPetsByTags 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  getPetById(petId, params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/pet/${petId}`, params);
    check(res, {
      "PetClient.getPetById 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  updatePetWithForm(petId, name, status, params = undefined) {
    const qs = `name=${name}&status=${status}`;
    const body = undefined;
    params = Object.assign({}, this.params, params);
    const res = http.post(`${this.baseUrl}/pet/${petId}?${qs}`, body, params);
    check(res, {
      "PetClient.updatePetWithForm 405": r => r.status === 405
    });
  }

  deletePet(petId, params = undefined) {
    const body = undefined;
    params = Object.assign({}, this.params, params);
    const res = http.del(`${this.baseUrl}/pet/${petId}`, body, params);
    check(res, {
      "PetClient.deletePet 400": r => r.status === 400
    });
  }

  uploadFile(petId, additionalMetadata, binFile, params = undefined) {
    const qs = `additionalMetadata=${additionalMetadata}`;
    const body = {
      file: http.file(binFile, undefined, "application/octet-stream")
    };
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/octet-stream" });
    const res = http.post(`${this.baseUrl}/pet/${petId}/uploadImage?${qs}`, body, params);
    check(res, {
      "PetClient.uploadFile 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }
}

export class StoreClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  getInventory(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/store/inventory`, params);
    check(res, {
      "StoreClient.getInventory 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  placeOrder(order, params = undefined) {
    const body = JSON.stringify(order);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.post(`${this.baseUrl}/store/order`, body, params);
    check(res, {
      "StoreClient.placeOrder 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  getOrderById(orderId, params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/store/order/${orderId}`, params);
    check(res, {
      "StoreClient.getOrderById 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  deleteOrder(orderId, params = undefined) {
    const body = undefined;
    params = Object.assign({}, this.params, params);
    const res = http.del(`${this.baseUrl}/store/order/${orderId}`, body, params);
    check(res, {
      "StoreClient.deleteOrder 400": r => r.status === 400
    });
  }
}

export class UserClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  createUser(user, params = undefined) {
    const body = JSON.stringify(user);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.post(`${this.baseUrl}/user`, body, params);
    check(res, {
    });
    return { res, json: () => res.json() };
  }

  createUsersWithListInput(payload, params = undefined) {
    const body = JSON.stringify(payload);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.post(`${this.baseUrl}/user/createWithList`, body, params);
    check(res, {
      "UserClient.createUsersWithListInput 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  loginUser(username, password, params = undefined) {
    const qs = `username=${username}&password=${password}`;
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/user/login?${qs}`, params);
    check(res, {
      "UserClient.loginUser 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  logoutUser(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/user/logout`, params);
    check(res, {
    });
  }

  getUserByName(username, params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/user/${username}`, params);
    check(res, {
      "UserClient.getUserByName 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  updateUser(username, user, params = undefined) {
    const body = JSON.stringify(user);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.put(`${this.baseUrl}/user/${username}`, body, params);
    check(res, {
    });
  }

  deleteUser(username, params = undefined) {
    const body = undefined;
    params = Object.assign({}, this.params, params);
    const res = http.del(`${this.baseUrl}/user/${username}`, body, params);
    check(res, {
      "UserClient.deleteUser 400": r => r.status === 400
    });
  }
}
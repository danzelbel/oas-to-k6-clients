// Generator: oas-to-k6-clients

import http from "k6/http";
import { check } from "k6";

export class BeerClient {
  constructor(baseUrl, defaultParams = undefined) {
    this.baseUrl = baseUrl;
    this.params = defaultParams || {};
  }

  options(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.options(`${this.baseUrl}/beer`, params);
  }

  head(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.head(`${this.baseUrl}/beer`, params);
    check(res, {
      "BeerClient.head(params = undefined) 200": r => r.status === 200
    });
  }

  getBeers(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/beer`, params);
    check(res, {
      "BeerClient.getBeers(params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  addBeer(beer, params = undefined) {
    const body = JSON.stringify(beer);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.post(`${this.baseUrl}/beer`, body, params);
    check(res, {
      "BeerClient.addBeer(beer, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  beerCount(params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/beer/count`, params);
    check(res, {
      "BeerClient.beerCount(params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  searchBeers(style, params = undefined) {
    const qs = `style=${style.join("&style=")}`;
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/beer/search?${qs}`, params);
    check(res, {
      "BeerClient.searchBeers(style, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  getBeer(id, params = undefined) {
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/beer/${id}`, params);
    check(res, {
      "BeerClient.getBeer(id, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  uploadFile(binFile, params = undefined) {
    const body = {
      file: http.file(binFile, undefined, "application/octet-stream")
    };
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/octet-stream" });
    const res = http.post(`${this.baseUrl}/beer/${id}/upload`, body, params);
    check(res, {
      "BeerClient.uploadFile(binFile, params = undefined) 200": r => r.status === 200
    });
  }

  getBeerStyles(take, params = undefined) {
    const qs = `take=${take}`;
    params = Object.assign({}, this.params, params);
    const res = http.get(`${this.baseUrl}/beer/style?${qs}`, params);
    check(res, {
      "BeerClient.getBeerStyles(take, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }

  getBeerStyle(id, beerStyle, apiVersion, params = undefined) {
    const qs = `api-version=${apiVersion}`;
    const body = JSON.stringify(beerStyle);
    params = Object.assign({}, this.params, params);
    params.headers = Object.assign({}, params.headers, { "Content-Type": "application/json" });
    const res = http.put(`${this.baseUrl}/beer/style/${id}?${qs}`, body, params);
    check(res, {
      "BeerClient.getBeerStyle(id, beerStyle, apiVersion, params = undefined) 200": r => r.status === 200
    });
    return { res, json: () => res.json() };
  }
}
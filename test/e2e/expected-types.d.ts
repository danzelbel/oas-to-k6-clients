// Generator: oas-to-k6-clients

import { RefinedParams, ResponseType, RefinedResponse } from "k6/http";

export class BeerClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * OPTIONS /beer
   * @param [params=undefined] Request parameters.
   * @returns No response status check
   */
  options<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);

  /**
   * HEAD /beer
   * @param [params=undefined] Request parameters.
   * @returns Returns nothing
   */
  head<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);

  /**
   * GET /beer
   * @param [params=undefined] Request parameters.
   * @returns Returns an array of beer reference
   */
  getBeers<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Beer[] };

  /**
   * POST /beer
   * @param [params=undefined] Request parameters.
   * @returns Returns a beer reference
   */
  addBeer<RT extends ResponseType | undefined>(beer: Beer, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Beer };

  /**
   * GET /beer/count
   * @param [params=undefined] Request parameters.
   * @returns Returns number
   */
  beerCount<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): number };

  /**
   * GET /beer/search
   * @param [params=undefined] Request parameters.
   */
  searchBeers<RT extends ResponseType | undefined>(style: string[], params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Beer[] };

  /**
   * GET /beer/{id}
   * @param [params=undefined] Request parameters.
   */
  getBeer<RT extends ResponseType | undefined>(id: number, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Beer };

  /**
   * POST /beer/{id}/upload
   * @param binFile body is application/octet-stream
   * @param [params=undefined] Request parameters.
   */
  uploadFile<RT extends ResponseType | undefined>(binFile: ArrayBuffer, params?: RefinedParams<RT> | null);

  /**
   * GET /beer/style
   * @param [params=undefined] Request parameters.
   */
  getBeerStyles<RT extends ResponseType | undefined>(take: number, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): BeerStyle[] };

  /**
   * PUT /beer/style/{id}
   * @param [params=undefined] Request parameters.
   */
  getBeerStyle<RT extends ResponseType | undefined>(id: number, beerStyle: BeerStyle, apiVersion?: string, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): BeerStyle };
}

export interface Beer {
  id?: number;
}

export interface BeerStyle {
  id?: number;
}
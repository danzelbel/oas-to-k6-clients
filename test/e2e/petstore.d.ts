// Generator: oas-to-k6-clients

import { RefinedParams, ResponseType, RefinedResponse } from "k6/http";

export class PetClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * PUT /pet
   * @summary Update an existing pet
   * @description Update an existing pet by Id
   * @param pet Update an existent pet in the store
   * @param [params=undefined] Request parameters.
   * @returns Successful operation
   */
  updatePet<RT extends ResponseType | undefined>(pet: Pet, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Pet };

  /**
   * POST /pet
   * @summary Add a new pet to the store
   * @description Add a new pet to the store
   * @param pet Create a new pet in the store
   * @param [params=undefined] Request parameters.
   * @returns Successful operation
   */
  addPet<RT extends ResponseType | undefined>(pet: Pet, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Pet };

  /**
   * GET /pet/findByStatus
   * @summary Finds Pets by status
   * @description Multiple status values can be provided with comma separated strings
   * @param [status="available"] Status values that need to be considered for filter
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  findPetsByStatus<RT extends ResponseType | undefined>(status?: string, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Pet[] };

  /**
   * GET /pet/findByTags
   * @summary Finds Pets by tags
   * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   * @param tags Tags to filter by
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  findPetsByTags<RT extends ResponseType | undefined>(tags?: string[], params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Pet[] };

  /**
   * GET /pet/{petId}
   * @summary Find pet by ID
   * @description Returns a single pet
   * @param petId ID of pet to return
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  getPetById<RT extends ResponseType | undefined>(petId: number, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Pet };

  /**
   * POST /pet/{petId}
   * @summary Updates a pet in the store with form data
   * @param petId ID of pet that needs to be updated
   * @param name Name of pet that needs to be updated
   * @param status Status of pet that needs to be updated
   * @param [params=undefined] Request parameters.
   */
  updatePetWithForm<RT extends ResponseType | undefined>(petId: number, name?: string, status?: string, params?: RefinedParams<RT> | null);

  /**
   * DELETE /pet/{petId}
   * @summary Deletes a pet
   * @description delete a pet
   * @param petId Pet id to delete
   * @param [params=undefined] Request parameters.
   */
  deletePet<RT extends ResponseType | undefined>(petId: number, params?: RefinedParams<RT> | null);

  /**
   * POST /pet/{petId}/uploadImage
   * @summary uploads an image
   * @param petId ID of pet to update
   * @param additionalMetadata Additional Metadata
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  uploadFile<RT extends ResponseType | undefined>(petId: number, additionalMetadata?: string, binFile: ArrayBuffer, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): ApiResponse };
}

export class StoreClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * GET /store/inventory
   * @summary Returns pet inventories by status
   * @description Returns a map of status codes to quantities
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  getInventory<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): any };

  /**
   * POST /store/order
   * @summary Place an order for a pet
   * @description Place a new order in the store
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  placeOrder<RT extends ResponseType | undefined>(order: Order, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Order };

  /**
   * GET /store/order/{orderId}
   * @summary Find purchase order by ID
   * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
   * @param orderId ID of order that needs to be fetched
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  getOrderById<RT extends ResponseType | undefined>(orderId: number, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): Order };

  /**
   * DELETE /store/order/{orderId}
   * @summary Delete purchase order by ID
   * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
   * @param orderId ID of the order that needs to be deleted
   * @param [params=undefined] Request parameters.
   */
  deleteOrder<RT extends ResponseType | undefined>(orderId: number, params?: RefinedParams<RT> | null);
}

export class UserClient {
  /**
   * @param baseUrl The base url of the path.
   * @param [params=undefined] The default request parameters.
   */
  constructor(baseUrl: string, params?: RefinedParams<ResponseType | undefined> | null);

  /**
   * POST /user
   * @summary Create user
   * @description This can only be done by the logged in user.
   * @param user Created user object
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  createUser<RT extends ResponseType | undefined>(user: User, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): User };

  /**
   * POST /user/createWithList
   * @summary Creates list of users with given input array
   * @description Creates list of users with given input array
   * @param [params=undefined] Request parameters.
   * @returns Successful operation
   */
  createUsersWithListInput<RT extends ResponseType | undefined>(payload: User[], params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): User };

  /**
   * GET /user/login
   * @summary Logs user into the system
   * @param username The user name for login
   * @param password The password for login in clear text
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  loginUser<RT extends ResponseType | undefined>(username?: string, password?: string, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): string };

  /**
   * GET /user/logout
   * @summary Logs out current logged in user session
   * @param [params=undefined] Request parameters.
   */
  logoutUser<RT extends ResponseType | undefined>(params?: RefinedParams<RT> | null);

  /**
   * GET /user/{username}
   * @summary Get user by user name
   * @param username The name that needs to be fetched. Use user1 for testing.
   * @param [params=undefined] Request parameters.
   * @returns successful operation
   */
  getUserByName<RT extends ResponseType | undefined>(username: string, params?: RefinedParams<RT> | null): { res: RefinedResponse<ResponseType | undefined>, json(): User };

  /**
   * PUT /user/{username}
   * @summary Update user
   * @description This can only be done by the logged in user.
   * @param username name that need to be deleted
   * @param user Update an existent user in the store
   * @param [params=undefined] Request parameters.
   */
  updateUser<RT extends ResponseType | undefined>(username: string, user: User, params?: RefinedParams<RT> | null);

  /**
   * DELETE /user/{username}
   * @summary Delete user
   * @description This can only be done by the logged in user.
   * @param username The name that needs to be deleted
   * @param [params=undefined] Request parameters.
   */
  deleteUser<RT extends ResponseType | undefined>(username: string, params?: RefinedParams<RT> | null);
}

export interface Order {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  status?: string;
  complete?: boolean;
}

export interface Customer {
  id?: number;
  username?: string;
  address?: Address[];
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Category {
  id?: number;
  name?: string;
}

export interface User {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  userStatus?: number;
}

export interface Tag {
  id?: number;
  name?: string;
}

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  status?: string;
}

export interface ApiResponse {
  code?: number;
  type?: string;
  message?: string;
}
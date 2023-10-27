declare module "oas-to-k6-clients" {
  /**
   * @param api An OpenApi Object, or the file path or URL of your OpenApi doc.
   * @returns The types source and clients source.
   */
  export function oasToK6Client(api: string | OpenAPI.Document): Promise<{ typesSource: string, clientsSource: string }>;

  /**
   * Validates an OpenAPI doc
   *
   * @param api An OpenApi Object, or the file path or URL of your OpenApi doc.
   * @throws {Error}
   */
  export function validate(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
}
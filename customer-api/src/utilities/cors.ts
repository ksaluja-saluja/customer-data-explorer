export class CorsUti {
  private static readonly ALLOWED_ORIGINS: string[] = process.env.CORS_ALLOWED_ORIGINS ?
    process.env.CORS_ALLOWED_ORIGINS.split(',') :
    ['http://localhost:3000']; // Default allowed origin

    static getCorsHeaders(origin: string): { [key: string]: string } | null {
      if (this.ALLOWED_ORIGINS.includes(origin)) {
        return {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        };
      }
      return null; // No CORS headers if origin is not allowed
    }
}
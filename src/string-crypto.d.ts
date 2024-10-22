declare module 'string-crypto' {
    export class StringCrypto {
        constructor();
      encrypt(text: string, key: string): string;
      decrypt(cipherText: string, key: string): string;
    }
  }
  
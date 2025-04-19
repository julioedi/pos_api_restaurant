const key = process.env?.ENCODE_PSW ?? "base64";

class Core {
  
    // Método encode
    encode(input: string | any[]): string {
      let string = typeof input === 'string' ? input : JSON.stringify(input);
      let encoded = '';
  
      for (let i = 0; i < string.length; i++) {
        encoded += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
  
      // Base64 encoding to make the result readable
      return btoa(encoded);
    }
  
    // Método decode
    decode(encodedString: string): string | any {
      const decoded = atob(encodedString);
      let decodedString = '';
  
      for (let i = 0; i < decoded.length; i++) {
        decodedString += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
  
      if (this.isSerialized(decodedString)) {
        return JSON.parse(decodedString); // JSON parse for unserialize
      }
  
      return decodedString;
    }
  
    // Método isSerialized
    isSerialized(value: string): boolean {
      // Check if it's a string and not empty
      if (typeof value !== 'string' || value === '') {
        return false;
      }
  
      // Check if the value starts with a valid serialized string pattern (JSON-like structure)
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  const Encoder = new Core();

  export {Encoder}
  export default Encoder;
  
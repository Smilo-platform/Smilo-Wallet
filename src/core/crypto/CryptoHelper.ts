declare const sjcl: any;

export class CryptoHelper {
    private md256;
    private md512;
    private isInitialized: boolean = false;

    private initialize() {
        this.md256 = new sjcl.hash.sha256();
        this.md512 = new sjcl.hash.sha512();
    }

    sha512(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md512.update(data);

        let hashedData = this.md512.finalize();

        this.md512.reset();

        return sjcl.codec.base64.fromBits(hashedData);
    }

    sha256Short(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        return this.sha256(data).substr(0, 16);
    }

    sha256Binary(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        // Javascript does not have proper big integer support.
        // We therefore convert the hash to individual bytes and manually
        // convert to a bit string.
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        let bytes = sjcl.codec.bytes.fromBits(hashedData);

        let bitString = "";

        for(let byte of bytes) {
            bitString += byte.toString(2);
        }

        return bitString;
    }

    sha256(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base64.fromBits(hashedData);
    }

    sha256Hex(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.hex.fromBits(hashedData);
    }

    sha256ReturnBase32(data: string): string {
        if(!this.isInitialized)
            this.initialize();

        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base32.fromBits(hashedData).substr(0, 32);
    }
}
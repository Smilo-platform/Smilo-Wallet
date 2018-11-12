/**
 * Based on the SHA1PRNG algorithm developed by Sun.
 */
var SHA1PRNG = /** @class */ (function () {
    function SHA1PRNG(seed) {
        this.DIGEST_SIZE = 20;
        this.remCount = 0;
        if (seed)
            this.setSeed(seed);
    }
    SHA1PRNG.prototype.setSeed = function (value) {
        if (value instanceof Uint8Array) {
            // Convert int arrays back to a normal number array
            var convertedValue = [];
            for (var i = 0; i < value.length; i++) {
                convertedValue[i] = value[i];
            }
            value = convertedValue;
        }
        else if (value instanceof Int8Array) {
            // Convert int arrays back to a normal number array
            var convertedValue = [];
            for (var i = 0; i < value.length; i++) {
                convertedValue[i] = this.toUnsigned(value[i]);
            }
            value = convertedValue;
        }
        // If we get an array encode it to an SJCL word array
        if (Array.isArray(value))
            value = sjcl.codec.bytes.toBits(value);
        this.md1 = new sjcl.hash.sha1();
        this.md1.update(value);
        this.state = sjcl.codec.bytes.fromBits(this.md1.finalize());
    };
    SHA1PRNG.prototype.next = function (bits) {
        var numBytes = Math.floor((bits + 7) / 8);
        var next = 0;
        var bytes = this.getRandomBytes(numBytes);
        for (var i = 0; i < numBytes; i++) {
            next = (next << 8) + (bytes[i] & 0xFF);
        }
        return next >>> (numBytes * 8 - bits);
    };
    SHA1PRNG.prototype.nextSingle = function () {
        // Grab one byte and then divide it by its max value.
        // Effectively this will clamp the byte between 0 and 1.
        return this.toUnsigned(this.getRandomBytes(1)[0]) / 0xFF;
    };
    SHA1PRNG.prototype.nextInt = function (bound) {
        var r = this.next(31);
        var m = bound - 1;
        if ((bound & m) == 0) {
            r = ((bound * r) >> 31);
        }
        else {
            for (var u = r; u - (r = u % bound) + m < 0; u = this.next(31)) {
                // Do nothing
            }
        }
        return r;
    };
    SHA1PRNG.prototype.getRandomBytes = function (count) {
        var result = new Int8Array(count);
        var index = 0;
        var todo;
        var output = this.remainder;
        // Use remainder from last time
        var r = this.remCount;
        if (r > 0) {
            // How many bytes?
            todo = (result.length - index) < (this.DIGEST_SIZE - r) ?
                (result.length - index) : (this.DIGEST_SIZE - r);
            // Copy the bytes, zero the buffer
            for (var i = 0; i < todo; i++) {
                result[i] = output[r];
                output[r++] = 0;
            }
            this.remCount += todo;
            index += todo;
        }
        // If we need more bytes, make them.
        while (index < result.length) {
            // Step the state
            this.md1.update(sjcl.codec.bytes.toBits(this.state));
            output = sjcl.codec.bytes.fromBits(this.md1.finalize());
            this.updateState(this.state, output);
            // How many bytes?
            todo = (result.length - index) > this.DIGEST_SIZE ?
                this.DIGEST_SIZE : result.length - index;
            // Copy the bytes, zero the buffer
            for (var i = 0; i < todo; i++) {
                result[index++] = output[i];
                output[i] = 0;
            }
            this.remCount += todo;
        }
        // Store remainder for next time
        this.remainder = output;
        this.remCount %= this.DIGEST_SIZE;
        return result;
    };
    SHA1PRNG.prototype.updateState = function (state, output) {
        var last = 1;
        var v;
        var t;
        var zf = false;
        // state(n + 1) = (state(n) + output(n) + 1) % 2^160;
        for (var i = 0; i < state.length; i++) {
            var stateByte = this.toSigned(state[i]);
            var outputByte = this.toSigned(output[i]);
            // Add two bytes
            v = stateByte + outputByte + last;
            // Result is lower 8 bits
            t = v & 0xFF;
            // Store result. Check for state collision.
            zf = zf || (stateByte != t);
            state[i] = this.toUnsigned(t);
            // High 8 bits are carry. Store for next iteration.
            last = v >> 8;
        }
        // Make sure at least one bit changes!
        if (!zf) {
            state[0]++;
            // Ensure state remains a byte value
            state[0] %= 0xFF;
        }
    };
    SHA1PRNG.prototype.toSigned = function (byte) {
        return (byte > 0x7F) ? byte - 0x100 : byte;
        // return byte - 255;
        // return (new Int8Array([byte]))[0];
    };
    SHA1PRNG.prototype.toUnsigned = function (byte) {
        return byte & 255;
        // return (new Uint8Array([byte]))[0];
    };
    return SHA1PRNG;
}());
//# sourceMappingURL=SHA1PRNG.js.map

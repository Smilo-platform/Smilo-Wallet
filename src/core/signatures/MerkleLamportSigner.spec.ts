import { MerkleLamportSigner } from "./MerkleLamportSigner";
import { MerkleTree } from "../merkle/MerkleTree";

interface IMerkleLamportSignerTestVector {
    name: string;
    input: {
        bitCount: number;
        lamportPrivateKeys: string[][];
        merkleTree: MerkleTree;
        message: string;
        privateKey: string;
        index: number;
    };
    output: {
        signature: string;
    };
}

describe("MerkleLamportSigner", () => {
    let signer: MerkleLamportSigner;

    // ALl tests assume a 4 bit message. Real world uses 100 bits but
    // the algorithm remains the same. 
    // The generated lamport private keys are mocked.
    let testVectors: IMerkleLamportSignerTestVector[] = [
        {
            name: "basic",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    [
                        "i0p1", "i0p2", "i0p3", "i0p4",
                        "i0p5", "i0p6", "i0p7", "i0p8"
                    ],
                    [
                        "i1p1", "i1p2", "i1p3", "i1p4",
                        "i1p5", "i1p6", "i1p7", "i1p8"
                    ],
                    [
                        "i2p1", "i2p2", "i2p3", "i2p4",
                        "i2p5", "i2p6", "i2p7", "i2p8"
                    ],
                    [
                        "i3p1", "i3p2", "i3p3", "i3p4",
                        "i3p5", "i3p6", "i3p7", "i3p8"
                    ],
                    [
                        "i4p1", "i4p2", "i4p3", "i4p4",
                        "i4p5", "i4p6", "i4p7", "i4p8"
                    ],
                    [
                        "i5p1", "i5p2", "i5p3", "i5p4",
                        "i5p5", "i5p6", "i5p7", "i5p8"
                    ],
                    [
                        "i6p1", "i6p2", "i6p3", "i6p4",
                        "i6p5", "i6p6", "i6p7", "i6p8"
                    ],
                    [
                        "i7p1", "i7p2", "i7p3", "i7p4",
                        "i7p5", "i7p6", "i7p7", "i7p8"
                    ]
                ],
                merkleTree: new MerkleTree([
                    [
                        "h5Y8vedTt03whfNJYmUDM00bExRkrIuZVMxbGLNYDSM=",
                        "/pCTcDOekWzE9YZwQ4xHC83JUbbNMOfNkG25dQ/yoZI=", 
                        "OfDChClZSy/N15Y31IKY9RZrQO3tzA/cw229amW0JXE=", 
                        "o62odfgggADqujiYRMIjBfFqMmp0HPVHLYfBpeQfGTQ=", 
                        "wHpuLagMalhAX+owv5o8i0E40VlMPRTiLiMIl5cMOnk=", 
                        "gMu2UOcb9zbEL1b+djuY3YTJgRmHDlnx0DN4rVxd3qY=", 
                        "jABXSFbX0AwgJ9rflJFwu0kHxK3luWr3FJCpKyndllw=", 
                        "bUchNU+IBG8RZ2ddlq7+7AmwlIXLpNoOce+Qfq9KVKI="
                    ],
                    [
                        "8adjx5y3fXOlkqzLvb/LTSb8S5Htnzs6ITfbmoKz3Zs=",
                        "hT3Ksf3Uzf6uzqE/oqZFMxI27pZ67CRg+o8rBrAYUHk=",
                        "7Ss4sPbCPt1QpyUVgpHgjbb4bOErgZX4j6/o4361GHQ=",
                        "Bi6wCoITshy8jY8JoN/eYIPk95qx1L8x2lBsFITCwNw="
                    ],
                    [
                        "WSkLXusmgdkfgjl/pfKauq2PWNDODrmQrbs6TmpvSl8=",
                        "xW9LYp4FVYwqkMuREDN+y1+wlb83BtvVJgnR0PTEVlE="
                    ],
                    [
                        "0DbVwOouMaiGebP74WdVkLlrW95NdWIVbkwztkPxqG0="
                    ]
                ]),
                message: "hello world", // 1011
                privateKey: "PRIVATE_KEY",
                index: 0
            },
            output: {
                signature: "Zkr6ceBStsK/jY1R:i0p2::i0p3:yFvfFWOHDl5IV8ci::FLkoqREiltsnt0Ys:i0p6::m5lOjM+LbdPcUp+fImJcGP37+D770pepFXFg6noqr2BhVw0M+arvg5Uqr/DK+ZqgXf5jvHHklll/4Zi+vsTZZw==:i0p8,/pCTcDOekWzE9YZwQ4xHC83JUbbNMOfNkG25dQ/yoZI=:hT3Ksf3Uzf6uzqE/oqZFMxI27pZ67CRg+o8rBrAYUHk=:xW9LYp4FVYwqkMuREDN+y1+wlb83BtvVJgnR0PTEVlE="
            }
        },
        // Same as above but with different index
        {
            name: "basic-different-index",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    [
                        "i0p1", "i0p2", "i0p3", "i0p4",
                        "i0p5", "i0p6", "i0p7", "i0p8"
                    ],
                    [
                        "i1p1", "i1p2", "i1p3", "i1p4",
                        "i1p5", "i1p6", "i1p7", "i1p8"
                    ],
                    [
                        "i2p1", "i2p2", "i2p3", "i2p4",
                        "i2p5", "i2p6", "i2p7", "i2p8"
                    ],
                    [
                        "i3p1", "i3p2", "i3p3", "i3p4",
                        "i3p5", "i3p6", "i3p7", "i3p8"
                    ],
                    [
                        "i4p1", "i4p2", "i4p3", "i4p4",
                        "i4p5", "i4p6", "i4p7", "i4p8"
                    ],
                    [
                        "i5p1", "i5p2", "i5p3", "i5p4",
                        "i5p5", "i5p6", "i5p7", "i5p8"
                    ],
                    [
                        "i6p1", "i6p2", "i6p3", "i6p4",
                        "i6p5", "i6p6", "i6p7", "i6p8"
                    ],
                    [
                        "i7p1", "i7p2", "i7p3", "i7p4",
                        "i7p5", "i7p6", "i7p7", "i7p8"
                    ]
                ],
                merkleTree: new MerkleTree([
                    [
                        "h5Y8vedTt03whfNJYmUDM00bExRkrIuZVMxbGLNYDSM=",
                        "/pCTcDOekWzE9YZwQ4xHC83JUbbNMOfNkG25dQ/yoZI=", 
                        "OfDChClZSy/N15Y31IKY9RZrQO3tzA/cw229amW0JXE=", 
                        "o62odfgggADqujiYRMIjBfFqMmp0HPVHLYfBpeQfGTQ=", 
                        "wHpuLagMalhAX+owv5o8i0E40VlMPRTiLiMIl5cMOnk=", 
                        "gMu2UOcb9zbEL1b+djuY3YTJgRmHDlnx0DN4rVxd3qY=", 
                        "jABXSFbX0AwgJ9rflJFwu0kHxK3luWr3FJCpKyndllw=", 
                        "bUchNU+IBG8RZ2ddlq7+7AmwlIXLpNoOce+Qfq9KVKI="
                    ],
                    [
                        "8adjx5y3fXOlkqzLvb/LTSb8S5Htnzs6ITfbmoKz3Zs=",
                        "hT3Ksf3Uzf6uzqE/oqZFMxI27pZ67CRg+o8rBrAYUHk=",
                        "7Ss4sPbCPt1QpyUVgpHgjbb4bOErgZX4j6/o4361GHQ=",
                        "Bi6wCoITshy8jY8JoN/eYIPk95qx1L8x2lBsFITCwNw="
                    ],
                    [
                        "WSkLXusmgdkfgjl/pfKauq2PWNDODrmQrbs6TmpvSl8=",
                        "xW9LYp4FVYwqkMuREDN+y1+wlb83BtvVJgnR0PTEVlE="
                    ],
                    [
                        "0DbVwOouMaiGebP74WdVkLlrW95NdWIVbkwztkPxqG0="
                    ]
                ]),
                message: "hello world", // 1011
                privateKey: "PRIVATE_KEY",
                index: 4
            },
            output: {
                signature: "8JXWdDRRGpAyquix:i4p2::i4p3:7bNwxEvpsYenDTIB::e+e1oV/Pi+i8IZD6:i4p6::Zg+mVsWZMFwO5IY4jCKzrgk3XdIf1/JytNzna2AAxSPBPUmcl6alEVOL+x4ouHh3ffKDGysPBAkFlj1GlctEEQ==:i4p8,gMu2UOcb9zbEL1b+djuY3YTJgRmHDlnx0DN4rVxd3qY=:Bi6wCoITshy8jY8JoN/eYIPk95qx1L8x2lBsFITCwNw=:WSkLXusmgdkfgjl/pfKauq2PWNDODrmQrbs6TmpvSl8="
            }
        }
    ];

    beforeEach(() => {
        signer = new MerkleLamportSigner();
    });

    it("should create correct signatures", () => {
        // We must mock the generated private keys
        let testVectorIndex = 0;
        let testVectorSubIndex = 0;
        
        spyOn((<any>signer), "getLamportPrivateKeys").and.callFake(() => {
            return testVectors[testVectorIndex].input.lamportPrivateKeys[testVectorSubIndex];
        });

        for(let testVector of testVectors) {
            testVectorSubIndex = testVector.input.index;

            let signature = signer.getSignature(
                testVector.input.merkleTree,
                testVector.input.message,
                testVector.input.privateKey,
                testVector.input.index,
                testVector.input.bitCount
            );

            expect(signature).toBe(testVector.output.signature, testVector.name + " failed");

            testVectorIndex++;
        }
    });
});
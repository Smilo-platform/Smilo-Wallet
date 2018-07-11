import { MerkleLamportSigner } from "./MerkleLamportSigner";
import { MerkleTree } from "../merkle/MerkleTree";

interface IMerkleLamportSignerTestVector {
    name: string;
    input: {
        bitCount: number;
        lamportPrivateKeys: string[];
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
                    "p1-1", "p1-2", "p2-1", "p2-2",
                    "p3-1", "p3-2", "p4-1", "p4-2"
                ],
                merkleTree: new MerkleTree([
                    [
                        "1", "2", "3", "4", "5", "6", "7", "8"
                    ],
                    [
                        "a1HUMd9dfxQcvs7M957fPdhhw7QGnwsRZho+76y7qRg=",
                        "huUBSWWGYTEqngs1VY2E9sbT2nl/VSqWV/4FWMpAze8=",
                        "doi271JVWWLQCP/4lCI1gsSEUXzqfaSe5ngArcf8iGY=",
                        "NJxBIBti24URkmZcUEs1D/mMa0X7YqiiFh94tlNNjek="
                    ],
                    [
                        "YmKvb8Ccw3BpXV3DyDkDDcCmE1FXOnuHvYa1J1gi1es=",
                        "FTUPLddiAestCC4o7GPJhTSkDJSaawReXFo8XnsuzIc="
                    ],
                    [
                        "idsOrW2kkzmGKyZ4lDt9M9ryXMLAnnC4JjF88tLyKRw="
                    ]
                ]),
                message: "hello world", // 1011
                privateKey: "PRIVATE_KEY",
                index: 0
            },
            output: {
                signature: "u66w4gBAZbjcseTg:p1-2::p2-1:cd47u2FchVCX2F/4::6tTzGUW8Cy2d6OuB:p3-2::Eo57J2kXu71I6xSeiXG961xJc0vy4ZeIUTRUG9BF2zWjFjYhfB/G+rNj2+dN9WfVQ2kQNNzi6AdiS4srmOgC7g==:p4-2,2:huUBSWWGYTEqngs1VY2E9sbT2nl/VSqWV/4FWMpAze8=:FTUPLddiAestCC4o7GPJhTSkDJSaawReXFo8XnsuzIc="
            }
        },
        // Same as above except different index.
        // Authentication path should be different in this case.
        {
            name: "basic-different-index",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    "p1-1", "p1-2", "p2-1", "p2-2",
                    "p3-1", "p3-2", "p4-1", "p4-2"
                ],
                merkleTree: new MerkleTree([
                    [
                        "1", "2", "3", "4", "5", "6", "7", "8"
                    ],
                    [
                        "a1HUMd9dfxQcvs7M957fPdhhw7QGnwsRZho+76y7qRg=",
                        "huUBSWWGYTEqngs1VY2E9sbT2nl/VSqWV/4FWMpAze8=",
                        "doi271JVWWLQCP/4lCI1gsSEUXzqfaSe5ngArcf8iGY=",
                        "NJxBIBti24URkmZcUEs1D/mMa0X7YqiiFh94tlNNjek="
                    ],
                    [
                        "YmKvb8Ccw3BpXV3DyDkDDcCmE1FXOnuHvYa1J1gi1es=",
                        "FTUPLddiAestCC4o7GPJhTSkDJSaawReXFo8XnsuzIc="
                    ],
                    [
                        "idsOrW2kkzmGKyZ4lDt9M9ryXMLAnnC4JjF88tLyKRw="
                    ]
                ]),
                message: "hello world", // binary first 4 bits = 1011
                privateKey: "PRIVATE_KEY",
                index: 4
            },
            output: {
                signature: "u66w4gBAZbjcseTg:p1-2::p2-1:cd47u2FchVCX2F/4::6tTzGUW8Cy2d6OuB:p3-2::Eo57J2kXu71I6xSeiXG961xJc0vy4ZeIUTRUG9BF2zWjFjYhfB/G+rNj2+dN9WfVQ2kQNNzi6AdiS4srmOgC7g==:p4-2,6:NJxBIBti24URkmZcUEs1D/mMa0X7YqiiFh94tlNNjek=:YmKvb8Ccw3BpXV3DyDkDDcCmE1FXOnuHvYa1J1gi1es="
            }
        },
        // Different values
        {
            name: "different-values",
            input: {
                bitCount: 4,
                lamportPrivateKeys: [
                    "P1", "P2", "P3", "P4",
                    "P5", "P6", "P7", "P8"
                ],
                merkleTree: new MerkleTree([
                    [
                        "A", "B", "C", "D", "E", "F", "G", "H"
                    ],
                    [
                        "OBZPvRdgPXP2lri01yZk1zW7anyIV3aH/SrjP9aWQVM=",
                        "kOxYEn7Ecv+34/kMPuMg+LsdxrxkpIFD5tkffZpt4jY=",
                        "Ok207h5ZzhoKG59WvW1VBtjCBOLx1QG3o6QCHmNl6Ns=",
                        "p3cMbaqkvcIttg4q0tYfipSxS4jkKGWpMmdGmrtMw2U="
                    ],
                    [
                        "oGqueaKBduEiiv2corYo7YVGDlZJ8/M9RUGfVdyDAVQ=",
                        "ZE3vKRywK0TitkILIIufHlKbslb++5ZR+/PgKCN8/WU="
                    ],
                    [
                        "KsZEbXtnBZ5V27aZNRDRJ2vCDbIjJCVVashfVRJM3Vs="
                    ]
                ]),
                message: "bbyou bbyou bbme", // binary first 4 bits = 1000
                privateKey: "OTHER_PRIVATE_KEY",
                index: 7
            },
            output: {
                signature: "++rnwYZntph1GPOu:P2::P3:4FGEwfWAEqvuzAOT::P5:dx2gTBS8hGID8Er6::P7:jljIrAB5EOeB9fOFgTRntllR0REqR4oKxfMrN66mEL7KJQuNJnAkD+Dgg3gUraX4vmqlbbwTLu73jexUkzIdPg==,G:Ok207h5ZzhoKG59WvW1VBtjCBOLx1QG3o6QCHmNl6Ns=:oGqueaKBduEiiv2corYo7YVGDlZJ8/M9RUGfVdyDAVQ="
            }
        }
    ];

    beforeEach(() => {
        signer = new MerkleLamportSigner();
    });

    it("should create correct signatures", () => {
        // We must mock the generated private keys
        let testVectorIndex = 0;
        
        spyOn((<any>signer), "getLamportPrivateKeys").and.callFake(() => {
            return testVectors[testVectorIndex].input.lamportPrivateKeys;
        });

        for(let testVector of testVectors) {
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
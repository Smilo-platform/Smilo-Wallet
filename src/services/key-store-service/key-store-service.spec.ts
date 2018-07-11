import { KeyStoreService, KEY_NUM_ITERATIONS, KEY_SIZE } from "./key-store-service";

describe("KeyStoreService", () => {
    let service: KeyStoreService;
    let forge: any;

    let templateKeyStores = [
        {
            data: "Hello World",
            password: "pass123",
            keyStore: {"cipher":"AES-CTR","cipherParams":{"iv":":IÍ0a\u001fFÚÔ/\u000b\u0004µjJÚ\u0016\u00119ßÖ)½2k\rþú6\n2"},"cipherText":"WêÌ­8\f\u0000\u000f","keyParams":{"salt":"\fâÝcÄ==KÝàÊA\u001aþ·^ÃK¨­ÿ,O\u0004÷w5\u0014 ¡\u0003ôò\u0014ÀL¤u÷!tôfþãl¸Q¨ÑÇë\u0004ÿ\u001eÔ\u0018©^9@`\t\t³¨Q¤\riâ$\bÝ3m3÷\u0012\u0016^dï`ö±¬º¥_¤\u00192·\u0019ÐßG³%ïç\u0010\u0002î8H;ì*\u000b9(M\u001bµ¦Õ\u0017Í1\u000bãØÂ+634I+4B)Hß=\r\u001bfZHÞ\u0015sp 0.\u0014!\u0002Ð[ºÉÒlV¯\u0014Þ \u0017²Ö\tI\\hCÐãk±Ï(Ñ\u0006Î\u001c0Åò\u0006}¾çÌlµn,iV¹zC\u000fYÎ[Â+CíûB\u0018HgS\u0016XÜ\u000bp«©i/^Î~Ö ","iterations":10000,"keySize":32},"controlHash":"d099ead558dc269aeea9d2a77e36842c89ab4b42abb9d836c20643b31bd3145d"}

        },
        {
            data: "Goodbye Cruel World",
            password: "321ssap",
            keyStore: {"cipher":"AES-CTR","cipherParams":{"iv":"ÆÄ0Á\u0010%ji¦Lµ\u0006\",]:ëFøÒ|Ýù\u0012¨Kgì\u0019e"},"cipherText":"\f\u0001F\u0000\u0006l¯.8.÷¥gMÆ\u0010","keyParams":{"salt":"Ò¤ÿW¼CÔ\u0011­]ÀÚEº>ÔÕ-°\bnHÂëJ'N'Ú>VëG\"\u0015ð¯R\n\u0006ä§R´©µV\u001fè°crbLeô©\\óú®ñ\b2-èx_Ï\"iw²LW1Ø®!`ÚêÚ <¼.°¬}\rh§\u001e,¡´úìsÌ·\rZlWºü¸¯XÐr\\4\u0013³ìÆe)\u0014ç>ûâ<\u0016Á5SÝAA$ä\u001bÄ®ÚPòãz|\f\t¨¦ß\u000fÞY]\u0014\u000bx^Ó·Aÿ%\u0016Ô¦ìvPUADõXåâvÜóôîjxá6©kõi\u0011,XãþÎ&\u0002MíÁÏ>nìªÆnkÃÞ|òé`Ý,\u0006ôµU","iterations":10000,"keySize":32},"controlHash":"1938b216ea6f481f4787100457c0318a7a2d7265b9a1e38721a8e532e4e52c68"}

        },
        {
            data: "Dubedubedaba",
            password: "1337",
            keyStore: {"cipher":"AES-CTR","cipherParams":{"iv":"[ñÄ\u0018ÚþP\u0003\u0007Ì#:\u0010|_â\fyÛÓ&V%&\u0012û^Ë0õ"},"cipherText":"¦\u0004¹Þ~ay\u0018~4\u0006","keyParams":{"salt":"\u000eEú\u001fúE<°KïæÅ\u0013ÞÓ¢£­ð­Ë\u0001üm¼D1*&ÅãqðX²a=C\"ÎPIsñ>5LÏÅ\u0010æ\u001dk\n»¾A¿\u0005\u000fí.\u00048V#C¿äièX{øÈÝÞ8@bç[ôÂR®/\u001b·¥àØ_\u0012+»:gâ:±3¥!½e\u0001õG¨G¯ý#å^«Z\u000b\t¥\r\\ù¡sÐú;à¢\u0004¾·mBL¯NÉíp÷Á\u0012*\u0019Ñ\u0014ø\bt\tinöøëéùd\u0018çØÇ\u001aaÍ,n5éNúøôx¦Â\tÒÓ½[Ç¡Æ'ó\u001fú3\u0001Õ_¸ÈSÁEöÏÍ¨×CRcnD ÿNasÐ.\\ô(»ßV&\u0013¡×\náp¼ÄH","iterations":10000,"keySize":32},"controlHash":"4ccba27fcaea8f03d75b78690b887402eee12f4992abbd742d8c72245af7d506"}
        }
    ];

    beforeEach(() => {
        service = new KeyStoreService();

        // We can only retrieve the global variable forge this way.
        forge = (<any>window).forge;
    });

    it("should return a correct initialisation vector", () => {
        for(let i = 0; i < 10; i++) {
            expect(service.getInitialisationVector().length).toBe(32, "An initialisation vector should be 32 characters long");
        }
    });

    it("should return a correct salt", () => {
        for(let i = 0; i < 10; i++) {
            expect(service.getSalt().length).toBe(256, "A salt should be 256 characters long");
        }
    });

    it("should return a correctly generated key", () => {
        // We test if the parameters are correctly passed to forge.
        // We do not check validness of the key itself.
        spyOn(forge.pkcs5, "pbkdf2");

        service.generateKey("pass123", "salt");

        expect(forge.pkcs5.pbkdf2).toHaveBeenCalledWith("pass123", "salt", KEY_NUM_ITERATIONS, KEY_SIZE);

        service.generateKey("pass123", "salt", 10);

        expect(forge.pkcs5.pbkdf2).toHaveBeenCalledWith("pass123", "salt", 10, KEY_SIZE);

        service.generateKey("pass123", "salt", 10, 10);

        expect(forge.pkcs5.pbkdf2).toHaveBeenCalledWith("pass123", "salt", 10, 10);
    });

    it("should return a correct control hash", () => {
        let controlHashTemplates = [
            {
                password: "pass123",
                cipherText: "ENCRYPTED_TEXT_1",
                expectedControlHash: "5C6EC42A06ECDE1C56756ABBE223E4AF0D7DCED88603B5171A00A228D7382F75".toLowerCase()
            },
            {
                password: "blablabla",
                cipherText: "ENCRYPTED_TEXT_2",
                expectedControlHash: "D59A9B890BFB628E2943F85FC5569B996DF9ABF097942773D9EADBF3102AB93E".toLowerCase()
            },
            {
                password: "DUBBA DUBBA DUBBA",
                cipherText: "ENCRYPTED_TEXT_3",
                expectedControlHash: "C233C06D67AADF4A3CF38CA0E959C799A2F69A12C0FFF0BCDEB4071538EAE7DF".toLowerCase()
            }
        ];

        for(let controlHashTemplate of controlHashTemplates) {
            let hash = service.getControlHash(controlHashTemplate.password, controlHashTemplate.cipherText);

            expect(hash).toEqual(controlHashTemplate.expectedControlHash);
        }
    });

    it("should correctly create a key store", () => {
        let mockedData = {
            salt: "",
            iv: ""
        };

        spyOn(service, "getSalt").and.callFake(() => mockedData.salt);
        spyOn(service, "getInitialisationVector").and.callFake(() => mockedData.iv);

        // Test the template key stores
        for(let templateKeyStore of templateKeyStores) {
            mockedData.salt = templateKeyStore.keyStore.keyParams.salt;
            mockedData.iv = templateKeyStore.keyStore.cipherParams.iv;

            let keyStore = service.createKeyStore(templateKeyStore.data, templateKeyStore.password);

            expect(keyStore).toEqual(<any>templateKeyStore.keyStore);
        }
    });

    it("should correctly decrypt a key store", () => {
        // Test the template key stores
        for(let templateKeyStore of templateKeyStores) {
            let data = service.decryptKeyStore(<any>templateKeyStore.keyStore, templateKeyStore.password);

            expect(data).toEqual(templateKeyStore.data);
        }
    });

    it("should return null because the control hash does not equal", () => {
        spyOn(service, "generateKey");
        spyOn(service, "getControlHash").and.returnValue("differenthash");

        let result = service.decryptKeyStore(<any>{controlHash: "hash", cipherText: "text"}, "pass");

        expect(result).toBeNull();
        expect(service.generateKey).not.toHaveBeenCalled();
    });

    it("should return null because the control hash does not equal", () => {
        let decipher: any = {
            start: () => {},
            update: () => {},
            finish: () => {},
            output: () => {}
        };
        spyOn(service, "generateKey");
        spyOn(forge.cipher, "createDecipher").and.returnValue(decipher);
        spyOn(decipher, "start");
        spyOn(decipher, "output");
        spyOn(service, "getControlHash").and.returnValue("correct");

        let result = service.decryptKeyStore(<any>{controlHash: "correct", cipherText: "text", keyParams:{salt: "salt", iterations: 0, keysize: 0}, cipherParams: {iv: "iv"}}, "pass");

        expect(result).toBeNull();
        expect(service.generateKey).toHaveBeenCalled();
        expect(decipher.output).not.toHaveBeenCalled();
    });
});
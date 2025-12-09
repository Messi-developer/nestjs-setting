import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
    createCipheriv,
    createDecipheriv,
    createHmac,
    randomBytes
} from 'crypto';
import { SystemConfigRepository } from '../system-config/repositories/system-config.repository'

export type TPayloadData = {
    value: string;
    iv: string;
    mac: string;
};

@Injectable()
export class BillingCryptionService {
    private readonly encryptKey;
    private readonly algorithm = 'aes-256-cbc';

    constructor(
        private readonly systemConfigRepository: SystemConfigRepository
    ) {
        this.encryptKey = this.getSecretKey();
    }

    private async getSecretKey() {
        const config = await this.systemConfigRepository.getKindByData({
            kind: 'SECRET_KEY'
        });

        if (config.DATA_JSON === '') return '';

        const parse = JSON.parse(config.DATA_JSON);

        const secret = await this.secretDecrypt({
            cryption: process.env.BILLING_SECRET_KEY
        });

        const res = secret.replace(`:${parse.search}`, '');
        return Buffer.from(String(res), 'base64');
    }

    async encrypt(plainText) {
        const iv = randomBytes(16); // 백터 생성

        const cipher = createCipheriv(
            this.algorithm,
            await this.encryptKey,
            iv
        ); // 암호화 객체 생성

        const encryptedValue = Buffer.concat([
            cipher.update(plainText),
            cipher.final()
        ]); // 암호화

        const encryptedValueString = encryptedValue.toString('base64'), // 암호화 된 값 base64로 인코딩
            ivString = iv.toString('base64'); // 백터 base64로 인코딩

        return Buffer.from(
            JSON.stringify(<TPayloadData>{
                value: encryptedValueString, // 암호화 된 값
                iv: ivString, // 백터
                mac: await this.makeMac(ivString + encryptedValueString) // 유효성 검증을 위한 sha256 해시값
            })
        ).toString('base64');
    }

    async decrypt(encryptedData) {
        const payloadData = JSON.parse(
            Buffer.from(encryptedData, 'base64').toString()
        ); // base64 디코딩 후 json 파싱

        this.validationToMac(payloadData); // 유효성 검증 (기존 mac과 payloadData로 만든 mac이 같은지 비교)

        const decipher = createDecipheriv(
            this.algorithm,
            await this.encryptKey,
            Buffer.from(payloadData.iv, 'base64')
        ); // 복호화 객체 생성

        const decryptedResult = Buffer.concat([
            decipher.update(Buffer.from(payloadData.value, 'base64')),
            decipher.final()
        ]); // 복호화

        return decryptedResult.toString();
    }

    async secretDecrypt(params: { cryption: string }) {
        const payloadData = JSON.parse(
            Buffer.from(params.cryption, 'base64').toString()
        );

        const config = await this.systemConfigRepository.getKindByData({
            kind: 'SECRET_KEY'
        });

        const parse = JSON.parse(config.DATA_JSON);

        createHmac('sha256', parse.cryption)
            .update(payloadData.iv + payloadData.value)
            .digest('hex');

        const decipher = createDecipheriv(
            this.algorithm,
            parse.cryption,
            Buffer.from(payloadData.iv, 'base64')
        );

        const decryptedResult = Buffer.concat([
            decipher.update(Buffer.from(payloadData.value, 'base64')),
            decipher.final()
        ]);

        return decryptedResult.toString();
    }

    private async makeMac(data: string): Promise<string> {
        return createHmac('sha256', await this.encryptKey)
            .update(data)
            .digest('hex');
    }

    private async validationToMac(payloadData: TPayloadData): Promise<void> {
        if (
            payloadData.mac !=
            (await this.makeMac(payloadData.iv + payloadData.value))
        ) {
            throw new InternalServerErrorException(9907, 'The MAC is invalid.');
        }
    }
}

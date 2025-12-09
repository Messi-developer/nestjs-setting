import { Injectable } from '@nestjs/common'
import { Cipher, createCipheriv, createDecipheriv, createHmac, Decipher, randomBytes } from 'crypto'
import { SystemConfigRepository } from '../system-config/repositories/system-config.repository'

@Injectable()
export class CommonCryptionService {
    private cryption: string

    private algorithm: string

    private iv: Buffer

    public constructor(
        private readonly systemConfigRepository: SystemConfigRepository,
    ) {
        this.algorithm = 'aes-256-cbc'
        this.iv = Buffer.from(process.env.CRYPTION_IV_KEY.toString(), 'hex')
    }

    private async getSecretKey() {
        const config = await this.systemConfigRepository.getKindByData({ kind: 'SECRET_KEY' })

        if (!config) return ''

        const parse = JSON.parse(config.DATA_JSON)
        this.cryption = parse.cryption

        const secret = await this.secretDecrypt({ cryption: process.env.CRYPTION_SECRET_KEY })

        const res = secret.replace(`:${parse.search}`, '')
        return Buffer.from(String(res), 'base64')
    }

    private async secretDecrypt(params: { cryption: string }) {
        const payloadData = JSON.parse(Buffer.from(params.cryption, 'base64').toString())

        createHmac('sha256', this.cryption)
            .update(payloadData.iv + payloadData.value)
            .digest('hex')

        const decipher = createDecipheriv(this.algorithm, this.cryption, Buffer.from(payloadData.iv, 'base64'))

        const decryptedResult = Buffer.concat([
            decipher.update(Buffer.from(payloadData.value, 'base64')),
            decipher.final(),
        ])

        return decryptedResult.toString()
    }

    public async encrypt(text: string): Promise<string> {
        const encryptKey = await this.getSecretKey()

        if (!text) return null

        const cipher: Cipher = createCipheriv(this.algorithm, encryptKey, this.iv)
        let encrypted: string = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')

        return encrypted
    }

    public async decrypt(encrypted: string) {
        if (!encrypted) return null

        const encryptKey = await this.getSecretKey()

        try {
            const decipher: Decipher = createDecipheriv(this.algorithm, encryptKey, this.iv)

            let decrypted: string = decipher.update(encrypted, 'hex', 'utf8')
            decrypted += decipher.final('utf8')

            return decrypted
        } catch (error) {
            return encrypted
        }
    }
}
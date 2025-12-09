import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { TeamsWebHookService } from '../../web-hook/teams-web-hook.service'
import axios from 'axios'
import * as crypto from 'crypto'
import * as dayjs from 'dayjs'

export enum EPayNowType {
    CARD = 'card',
    CASH = 'cash',
}

export type apiRequest = {
    url: string
    method: string
    data: object
}

@Injectable()
export class PayNowApiService {
    private token: string

    private defaultHeaders = {}

    private req: apiRequest

    private isOldPaynow: boolean

    public constructor(private readonly teamsWebHookService: TeamsWebHookService) {
        this.token = ``
    }

    public async intApiRequest(req: apiRequest, isOldPaynow) {
        this.isOldPaynow = isOldPaynow

        const requestDate = await this.requestFormatting(req)

        await this.convertRequestInfo(req)

        return await this.sendRequest(req, requestDate)
    }

    private async requestFormatting(req: apiRequest) {        
        Object.assign(req.data, {
            certkey: await this.getClientKey(),
            reqid: dayjs().format('YYYYMMDDHHmmssSSS'),
            type: EPayNowType.CARD,
        })

        const requestData = JSON.stringify(req.data)
        return await this.encrypt(requestData)
    }

    private async convertRequestInfo(req: apiRequest) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(req.method)) {
            throw new InternalServerErrorException(`특정 헤더 Method 만 허용 합니다.`) // 500 Error
        }

        switch (req.method) {
            case 'get':
                const queryString = new URLSearchParams(Object.entries(req.data)).toString()
                req.url = `${req.url}?${queryString}`
                break
            default:
                this.defaultHeaders['Content-Type'] = 'application/json'
                break
        }
    }

    private async sendRequest(req: apiRequest, requestDate: string) {
        const baseUrl = this.isOldPaynow ? process.env.PAYNOW_OLD_BASE_URL : process.env.PAYNOW_BASE_URL
        
        try {
            let response
            switch (req.method) {
                case 'get':
                    response = await axios.get(`${baseUrl}/${req.url}?data=${requestDate}`, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
                default:
                    response = await axios.post(`${baseUrl}/${req.url}?data=${requestDate}`, {}, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
            }
            return response.data
        } catch (error) {
            await this.teamsWebHookService.sendMessage({
                path: `${baseUrl}/${req.url}`,
                response: {
                    status: +200,
                    message: `RestAPI Request Error!!`,
                    error: `test`,
                    data: JSON.stringify({ error }),
                    createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                },
            })
            throw new InternalServerErrorException(error.message) // 500 Error
        }
    }

    private async getClientKey() {
        return this.isOldPaynow ? process.env.PAYNOW_OLD_CLIENT_KEY : process.env.PAYNOW_CLIENT_KEY
    }

    private async encrypt(data: string): Promise<string> {
        const iv = Buffer.alloc(16, 0)
        const secretKey = this.isOldPaynow ? process.env.PAYNOW_OLD_SECRET_KEY : process.env.PAYNOW_SECRET_KEY
        const keyBuffer = Buffer.from(secretKey, 'utf8')
        const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv)

        let ciphertext = cipher.update(data, 'utf8', 'base64')
        ciphertext += cipher.final('base64')

        return encodeURIComponent(ciphertext)
    }
}

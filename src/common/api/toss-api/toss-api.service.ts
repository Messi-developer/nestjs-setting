import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { TeamsWebHookService } from '../../web-hook/teams-web-hook.service'
import { EPayMethodGbn } from '../../../pay/unified/dto/unified-process.dto'
import axios from 'axios'
import * as dayjs from 'dayjs'

export type apiRequest = {
    url: string
    method: string
    data: object
}

@Injectable()
export class TossApiService {
    private token: string

    private defaultHeaders = {}

    private req: apiRequest

    public constructor(private readonly teamsWebHookService: TeamsWebHookService) {
        this.token = ``
    }

    public async intApiRequest(req: apiRequest, params: { isTest: boolean, paymentMethod: string }) {
        await this.convertRequestInfo(req)

        await this.getHeadersInfo(params)

        return await this.sendRequest(req)
    }

    private async convertRequestInfo(req: apiRequest) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(req.method)) {
            throw new InternalServerErrorException(`특정 헤더 Method 만 허용 합니다.`) // 500 Error
        }

        switch (req.method) {
            case 'get':
                if (Object.keys(req.data).length > 0) {
                    const queryString = new URLSearchParams(Object.entries(req.data)).toString()
                    req.url = `${req.url}?${queryString}`
                }
                break
            default:
                this.defaultHeaders['Content-Type'] = 'application/json'
                break
        }
    }

    private async getHeadersInfo(params: { isTest: boolean, paymentMethod: string }) {
        const isTest = process.env.NODE_ENV === 'production' && params.isTest

        switch (params.paymentMethod) {
            case EPayMethodGbn.THE_BIZ_CARD:
                this.token = process.env.TOSS_GENERAL_SECRET_KEY

                if (isTest) this.token = process.env.TOSS_TEST_GENERAL_SECRET_KEY
                break
            case EPayMethodGbn.THE_BIZ_CARD_AUTO:
                this.token = process.env.TOSS_SECRET_KEY

                if (isTest) this.token = process.env.TOSS_TEST_SECRET_KEY
                break
            case EPayMethodGbn.CARD_AUTO:
                this.token = process.env.TOSS_SECRET_KEY

                if (isTest) this.token = process.env.TOSS_TEST_SECRET_KEY
                break
            case EPayMethodGbn.CARD:
                this.token = process.env.TOSS_GENERAL_SECRET_KEY

                if (isTest) this.token = process.env.TOSS_TEST_GENERAL_SECRET_KEY
                break
        }
        
        const token = Buffer.from(this.token + ':', 'utf8').toString('base64')
        this.defaultHeaders['Authorization'] = `Basic ${token}`
    }

    private async sendRequest(req: apiRequest) {
        try {
            let response
            switch (req.method) {
                case 'get':
                    response = await axios.get(`${process.env.TOSS_BASE_URL}/${req.url}`, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
                default:
                    response = await axios.post(`${process.env.TOSS_BASE_URL}/${req.url}`, req.data, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
            }

            return response.data
        } catch (error) {
            await this.teamsWebHookService.sendMessage({
                path: `${process.env.TOSS_BASE_URL}/${req.url}`,
                response: {
                    status: +200,
                    message: `RestAPI Request Error!!`,
                    error: `test`,
                    data: JSON.stringify({ error: error.response.data }),
                    createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                },
            })
            throw new InternalServerErrorException(error.response.data.message) // 500 Error
        }
    }
}

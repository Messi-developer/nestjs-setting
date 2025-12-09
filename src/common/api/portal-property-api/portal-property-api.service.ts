import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { TeamsWebHookService } from '../../web-hook/teams-web-hook.service'
import axios from 'axios'
import * as dayjs from 'dayjs'

export type apiRequest = {
    url: string
    method: string
    data: object
}

@Injectable()
export class PortalPropertyApiService {
    private defaultHeaders = {
        Version: '1.0.0',
        Authorization: 'Bearer ' + process.env.PROPERTY_API_KEY,
    }

    private req: apiRequest

    public constructor(private readonly teamsWebHookService: TeamsWebHookService) {}

    public async intApiRequest(req: apiRequest) {
        await this.convertRequestInfo(req)

        return await this.sendRequest(req)
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

    private async sendRequest(req: apiRequest) {
        try {
            let response
            switch (req.method) {
                case 'get':
                    response = await axios.get(`${process.env.INT_API_URL}/property/${req.url}`, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
                default:
                    response = await axios.post(`${process.env.INT_API_URL}/property/${req.url}`, req.data, {
                        headers: this.defaultHeaders,
                        responseType: 'json',
                        timeout: 3000,
                    })
                    break
            }
            return response.data
        } catch (error) {
            await this.teamsWebHookService.sendMessage({
                path: `${process.env.INT_API_URL}/property/${req.url}`,
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
}

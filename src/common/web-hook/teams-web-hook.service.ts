import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class TeamsWebHookService {
    public constructor() {}

    public async sendMessage(params) {
        const message = {
            type: 'message',
            attachments: [
                {
                    contentType: 'application/vnd.microsoft.card.adaptive',
                    content: {
                        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                        type: 'AdaptiveCard',
                        version: '1.3',
                        body: [
                            {
                                type: 'TextBlock',
                                size: 'Medium',
                                weight: 'Bolder',
                                text: `🚨 portal-int-api-bill 에러 발생`,
                            },
                            {
                                type: 'ColumnSet',
                                columns: [
                                    {
                                        type: 'Column',
                                        items: [
                                            {
                                                type: 'TextBlock',
                                                weight: 'Bolder',
                                                color: 'Attention',
                                                text: `${params.title ?? ``} (${process.env.NODE_ENV})`,
                                                wrap: true,
                                            },
                                        ],
                                        width: 'auto',
                                    },
                                ],
                            },
                            {
                                type: 'TextBlock',
                                text: `Path: ${params.path ?? ''}`,
                                wrap: true,
                            },
                            {
                                type: 'TextBlock',
                                text: `Message: ${params.response.message ?? ''}`,
                                wrap: true,
                            },
                            {
                                type: 'Container',
                                items: [
                                    {
                                        type: 'FactSet',
                                        facts: params.response
                                            ? Object.keys(params.response).map((key) => ({
                                                  title: key,
                                                  value: params.response[key],
                                              }))
                                            : [],
                                    },
                                ],
                                style: 'emphasis',
                                height: 'stretch',
                                maxHeight: '300px',
                            },
                        ],
                    },
                },
            ],
        }

        try {
            const res = await axios.post(process.env.BILL_TEAMS_WEBHOOK_URL, message, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            console.error('ErrorMessage:', error)
        }
    }
}

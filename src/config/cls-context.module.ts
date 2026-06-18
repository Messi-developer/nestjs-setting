import { Module, Global } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Global()
@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                setup: (cls, req, res) => {
                    const requestId = req.headers['x-request-id'] || uuidv4();
                    cls.set('x-request-id', requestId);

                    cls.set('x-request-path', req.path || req.url);
                    cls.set('x-request-method', req.method);
                    cls.set('x-request-query', req.query);
                    cls.set('x-request-body', req.body);

                    if (res.setHeader && !res.headersSent) {
                        res.setHeader('x-request-id', requestId);
                    }
                },
            },
        }),
    ],
    exports: [ClsModule], // Service 등에서 ClsService를 주입받을 수 있도록 내보냄
})
export class ClsContextModule {}

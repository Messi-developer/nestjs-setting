import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class FileLoaderService {
    public constructor() {}

    public async readFileOfExtension(fileName: string, extension: string) {
        try {
            const filePath = path.join(process.cwd(), `${fileName}.${extension}`);

            // 파일 읽기 (인코딩을 설정해야 string으로 반환됨)
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            throw new Error('파일을 읽는 중 오류가 발생했습니다.', { cause: error });
        }
    }
}

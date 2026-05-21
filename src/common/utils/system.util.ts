import * as os from 'node:os';

export class SystemUtil {
    static getServerIp = () => {
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            const iface = interfaces[devName];

            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                // IPv4이면서, 루프백(127.0.0.1)이 아닌 첫 번째 주소를 반환
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return '0.0.0.0';
    };
}

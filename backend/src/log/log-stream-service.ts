import { env } from "cloudflare:workers";
import { FRONTEND_URL } from "../constants";
import { ProcessLogManager } from "../manager/process-log-manager";

export interface LogData {
    status: 'info' | 'success' | 'warning' | 'error';
    message: string;
    service?: string;
    operation?: string;
}

export class LogService {
    private logs: LogData[] = [];
    private processLogManager: ProcessLogManager;

    constructor(processLogManager: ProcessLogManager) {
        this.processLogManager = processLogManager;
    }

    async addLog(status: LogData['status'], message: string, service?: string, operation?: string) {
        const logData: LogData = {
            status,
            message,
            service,
            operation
        };

        await this.processLogManager.addLog({
            status,
            message,
            service,
            operation
        });

        this.logs.push(logData);
        console.log(`[${status.toUpperCase()}] ${service ? `[${service}] ` : ''}${operation ? `[${operation}] ` : ''}${message}`);
    }

    async flushLogs() {
        if (this.logs.length === 0) return;

        const logsToSend = [...this.logs];
        this.logs = [];

        try {
            await fetch(`${FRONTEND_URL}/api/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logsToSend),
            });
        } catch (error) {
            console.error('로그 전송 실패:', error);
            // 실패한 로그들을 다시 큐에 추가 (선택사항)
            // this.logs.unshift(...logsToSend);
        }
    }

    // 인스턴스 종료 시 남은 로그들을 전송
    async shutdown() {
        await this.flushLogs();
    }
}

// 전역 LogService 인스턴스 (지연 초기화)
let logService: LogService | null = null;

function getLogService(): LogService {
    if (!logService) {
        logService = new LogService(new ProcessLogManager(env.DB));
    }
    return logService;
}

export async function sendLog(status: LogData['status'], message: string, service?: string, operation?: string) {
    // 배치 로그 서비스를 사용하여 로그 추가
    await getLogService().addLog(status, message, service, operation);
}

// 즉시 전송이 필요한 경우를 위한 함수
export async function sendLogImmediate(status: LogData['status'], message: string, service?: string, operation?: string) {
    const logData: LogData = {
        status,
        message,
        service,
        operation
    };

    console.log(`[${status.toUpperCase()}] ${service ? `[${service}] ` : ''}${operation ? `[${operation}] ` : ''}${message}`);

    try {
        await fetch(`http://localhost:3000/api/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([logData]),
        });
    } catch (error) {
        console.error('즉시 로그 전송 실패:', error);
    }
}

// 배치에 남은 로그들을 강제로 전송
export async function flushLogs() {
    await getLogService().flushLogs();
}

// 편의 함수들
export async function logInfo(message: string, service?: string, operation?: string) {
    await sendLog('info', message, service, operation);
}

export async function logSuccess(message: string, service?: string, operation?: string) {
    await sendLog('success', message, service, operation);
}

export async function logWarning(message: string, service?: string, operation?: string) {
    await sendLog('warning', message, service, operation);
}

export async function logError(message: string, service?: string, operation?: string) {
    await sendLog('error', message, service, operation);
}

export async function getLogs(db: D1Database, limit: number = 100) {
    const processLogManager = new ProcessLogManager(db);
    return await processLogManager.getLogs(limit);
}

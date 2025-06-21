// Server-Sent Events를 사용한 실시간 로그 스트리밍

import { BACKEND_URL } from "@/app/constants";
import { takeoffFetch } from "@/utils/fetch";

interface LogMessage {
    status: string;
    message: string;
    timestamp: string;
    service?: string;
    operation?: string;
}

// 메모리에 최근 로그 저장 (최대 500개)
let recentLogs: LogMessage[] = [];
const MAX_LOGS = 500;

// 연결된 클라이언트들을 관리
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(request: Request) {
    // 로그 조회
    const logs = await takeoffFetch(`${BACKEND_URL}/api/logs?limit=100`);
    const logsData = await logs.json();

    // 로그 데이터를 최근 로그 배열에 추가
    recentLogs = logsData.map((log: any) => ({
        status: log.status,
        message: log.message,
        timestamp: log.createdAt,
        service: log.service,
        operation: log.operation
    }));

    // SSE 스트림 생성
    const stream = new ReadableStream({
        start(controller) {
            // 클라이언트를 관리 목록에 추가
            clients.add(controller);

            // 연결 시 기존 로그 전송
            recentLogs.forEach(log => {
                try {
                    controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
                } catch (error) {
                    console.error('Failed to send existing log:', error);
                }
            });

            // 연결 성공 메시지
            const welcomeMessage: LogMessage = {
                status: 'info',
                message: 'Real-time log streaming connected',
                timestamp: new Date().toISOString()
            };
            
            try {
                controller.enqueue(`data: ${JSON.stringify(welcomeMessage)}\n\n`);
            } catch (error) {
                console.error('Failed to send welcome message:', error);
            }
        },
        cancel(controller) {
            // 클라이언트 연결 해제 시 관리 목록에서 제거
            clients.delete(controller);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(request: Request) {
    try {
        const logs = await request.json();
        
        // 로그 배열 형식인지 확인
        if (!Array.isArray(logs)) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Request body must be an array of log messages' 
            }), { 
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const processedLogs: LogMessage[] = [];
        const disconnectedClients: ReadableStreamDefaultController[] = [];

        // 모든 로그를 처리
        for (const log of logs) {
            const { status, message, service, operation } = log;
            const logMessage: LogMessage = {
                status,
                message,
                timestamp: new Date().toISOString(),
                service,
                operation
            };

            // 최근 로그에 추가 (최대 개수 유지)
            recentLogs.push(logMessage);
            processedLogs.push(logMessage);

            // 연결된 모든 클라이언트에게 브로드캐스트
            const data = `data: ${JSON.stringify(logMessage)}\n\n`;

            clients.forEach(controller => {
                try {
                    controller.enqueue(data);
                } catch (error) {
                    console.error('Failed to send log to client:', error);
                    disconnectedClients.push(controller);
                }
            });
        }

        // 최대 로그 개수 유지
        if (recentLogs.length > MAX_LOGS) {
            recentLogs.splice(0, recentLogs.length - MAX_LOGS);
        }

        // 연결이 끊어진 클라이언트 정리 (중복 제거)
        const uniqueDisconnectedClients = [...new Set(disconnectedClients)];
        uniqueDisconnectedClients.forEach(controller => {
            clients.delete(controller);
        });

        return new Response(JSON.stringify({ 
            success: true, 
            clientsCount: clients.size,
            processedLogsCount: processedLogs.length,
            message: `Successfully processed ${processedLogs.length} log messages`
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error) {
        console.error('Error in POST /api/log:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to process log messages' 
        }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
'use client';

import { useState, useEffect, useRef } from 'react';

interface LogMessage {
    status: string;
    message: string;
    timestamp: string;
    service?: string;
    operation?: string;
}

export default function LogPanel() {
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const logsContainerRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // 로그 스타일 결정
    const getLogStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'error':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'warn':
            case 'warning':
                return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'success':
                return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'info':
                return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            default:
                return 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
        }
    };

    // 시간 포맷팅
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // 자동 스크롤
    useEffect(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    // SSE 연결 설정
    useEffect(() => {
        const connectToLogs = () => {
            try {
                const eventSource = new EventSource('/api/log');
                eventSourceRef.current = eventSource;

                eventSource.onopen = () => {
                    setIsConnected(true);
                    console.log('로그 스트림에 연결되었습니다.');
                };

                eventSource.onmessage = (event) => {
                    try {
                        const logMessage: LogMessage = JSON.parse(event.data);
                        setLogs(prevLogs => {
                            const newLogs = [...prevLogs, logMessage];
                            // 최대 500개의 로그만 유지
                            return newLogs.slice(-500);
                        });
                    } catch (error) {
                        console.error('로그 메시지 파싱 오류:', error);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error('로그 스트림 연결 오류:', error);
                    setIsConnected(false);
                    
                    // 재연결 시도 (5초 후)
                    setTimeout(() => {
                        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
                            connectToLogs();
                        }
                    }, 5000);
                };

            } catch (error) {
                console.error('EventSource 생성 오류:', error);
                setIsConnected(false);
            }
        };

        connectToLogs();

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, []);

    // 로그 지우기
    const clearLogs = () => {
        setLogs([]);
    };

    // 연결 재시도
    const reconnect = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        
        // 잠시 후 재연결
        setTimeout(() => {
            const eventSource = new EventSource('/api/log');
            eventSourceRef.current = eventSource;
            
            eventSource.onopen = () => setIsConnected(true);
            eventSource.onerror = () => setIsConnected(false);
            eventSource.onmessage = (event) => {
                try {
                    const logMessage: LogMessage = JSON.parse(event.data);
                    setLogs(prevLogs => [...prevLogs, logMessage].slice(-500));
                } catch (error) {
                    console.error('로그 메시지 파싱 오류:', error);
                }
            };
        }, 1000);
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">실시간 로그</h2>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-medium ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isConnected ? '연결됨' : '연결 끊김'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <input
                            type="checkbox"
                            checked={autoScroll}
                            onChange={(e) => setAutoScroll(e.target.checked)}
                            className="w-4 h-4 text-zinc-600 bg-zinc-100 border-zinc-300 rounded focus:ring-zinc-500 dark:focus:ring-zinc-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <span>자동 스크롤</span>
                    </label>
                    <button
                        onClick={clearLogs}
                        className="px-3 py-1 text-xs bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors"
                    >
                        지우기
                    </button>
                    {!isConnected && (
                        <button
                            onClick={reconnect}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            재연결
                        </button>
                    )}
                </div>
            </div>

            {/* 로그 컨테이너 */}
            <div
                ref={logsContainerRef}
                className="h-96 overflow-y-auto bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-600 p-4 space-y-2"
            >
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-400 text-sm">
                        {isConnected ? '로그를 기다리는 중...' : '로그 스트림에 연결 중...'}
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-md border text-sm ${getLogStyle(log.status)}`}
                        >
                            <div className="flex items-start justify-between space-x-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium uppercase text-xs">
                                            {log.status}
                                        </span>
                                        {log.service && (
                                            <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded text-xs font-medium">
                                                {log.service}
                                            </span>
                                        )}
                                        {log.operation && (
                                            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded text-xs">
                                                {log.operation}
                                            </span>
                                        )}
                                        <span className="text-xs opacity-75">
                                            {formatTime(log.timestamp)}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap break-words">
                                        {log.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 하단 정보 */}
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>총 {logs.length}개의 로그</span>
                <span>최대 500개까지 표시</span>
            </div>
        </div>
    );
} 
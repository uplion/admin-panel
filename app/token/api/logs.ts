'use server';

export type Log = {
    id: number
    tokenID: number
    date: string
    path: string
    cf: string
    success: boolean,
    reason?: string
    ip: string
}

export async function fetchLogs(tokenID: string, page: number = 1): Promise<{
    data: Log[],
    count: number
}> {
    const db = null
    const [rows, count] = await Promise.all([
        db.prepare('SELECT * FROM logs WHERE tokenID = ? ORDER BY date DESC LIMIT 20 OFFSET ?')
            .bind(tokenID, (page - 1) * 20)
            .all<Log>(),
        db.prepare('SELECT COUNT(*) FROM logs WHERE tokenID = ?')
            .bind(tokenID)
            .first<{ 'COUNT(*)': number }>()
    ])


    if (rows.success) {
        return {
            data: rows.results,
            count: count!['COUNT(*)']
        }
    }

    throw new Error("Failed to fetch logs: " + (rows.error || '').toString())
}

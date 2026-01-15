import { neon } from '@netlify/neon';

export async function handler(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    try {
        const sql = neon(); // 자동으로 NETLIFY_DATABASE_URL 사용
        const budgetConfig = JSON.parse(event.body);

        // 새 예산 설정 저장
        await sql`
      INSERT INTO budget_config (config, updated_at)
      VALUES (${JSON.stringify(budgetConfig)}, NOW())
    `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: '예산이 저장되었습니다.'
            })
        };

    } catch (error) {
        console.error('DB Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
}

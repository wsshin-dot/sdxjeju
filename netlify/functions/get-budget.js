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

    try {
        const sql = neon(); // 자동으로 NETLIFY_DATABASE_URL 사용

        // 최신 예산 설정 조회
        const result = await sql`
      SELECT config FROM budget_config 
      ORDER BY updated_at DESC 
      LIMIT 1
    `;

        if (result.length === 0) {
            // 기본값 반환
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: {
                        totalBudgetPerPerson: 350000,
                        costs: {
                            flight: 100000,
                            rent: 40000,
                            day1Dinner: 50000,
                            whiskey: 20000,
                            day2Lunch: 24000,
                            park981: 37000,
                            day2Cafe: 8000,
                            day2Dinner: 40000
                        }
                    }
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: result[0].config
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

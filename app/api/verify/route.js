import { verifyLandRecord } from '@/lib/verify';
import { messages } from '@/lib/messages';

export const dynamic = 'force-dynamic';

/**
 * GET /api/verify?q=...
 * Public verification endpoint for land deeds and dags.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return Response.json(
        {
          found: false,
          message: messages.NOT_FOUND,
        },
        { status: 200 }
      );
    }

    const result = await verifyLandRecord(q);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('API /api/verify handler error:', error);
    return Response.json(
      {
        found: false,
        message: messages.ERROR_GENERIC,
      },
      { status: 200 }
    );
  }
}

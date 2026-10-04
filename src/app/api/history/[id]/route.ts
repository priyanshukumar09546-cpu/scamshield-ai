import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const record = await db.analysisRecord.findUnique({
      where: { id: params.id },
    });

    if (!record) {
      return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
    }

    // Security check: if record belongs to a user, ensure the caller is that user
    if (record.userId && (!user || user.id !== record.userId)) {
      return NextResponse.json({ error: 'Unauthorized to delete this record.' }, { status: 403 });
    }

    await db.analysisRecord.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, id: params.id });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete record.', details: error?.message }, { status: 500 });
  }
}

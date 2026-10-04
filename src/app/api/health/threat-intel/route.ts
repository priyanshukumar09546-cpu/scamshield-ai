import { NextResponse } from 'next/server';

export async function GET() {
  const vtConfigured = Boolean(process.env.VIRUSTOTAL_API_KEY && process.env.VIRUSTOTAL_API_KEY.trim() !== '');
  const wrConfigured = Boolean(process.env.GOOGLE_WEB_RISK_API_KEY && process.env.GOOGLE_WEB_RISK_API_KEY.trim() !== '');

  return NextResponse.json({
    status: 'OPERATIONAL',
    providers: {
      virusTotal: {
        configured: vtConfigured,
        status: vtConfigured ? 'CONNECTED' : 'KEY_NOT_CONFIGURED',
        notice: vtConfigured ? 'Real-time multi-scanner reputation active.' : 'Threat intelligence unavailable — unable to verify this signal.',
      },
      googleWebRisk: {
        configured: wrConfigured,
        status: wrConfigured ? 'CONNECTED' : 'KEY_NOT_CONFIGURED',
        notice: wrConfigured ? 'Google Web Risk protection active.' : 'Threat intelligence unavailable — unable to verify this signal.',
      },
      internalSSRFProtector: {
        status: 'ENFORCED',
        loopbackBlocked: true,
        privateIpRangesBlocked: true,
      },
    },
  });
}

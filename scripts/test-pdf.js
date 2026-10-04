const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

async function testPdf() {
  const sampleData = {
    id: 'cmutzgi2a000kuaakb5o96r46',
    inputType: 'SCREENSHOT',
    riskScore: 82,
    riskLevel: 'HIGH',
    confidence: 0.92,
    category: 'Fraudulent High-Yield Investment Scam',
    explanation: 'The analyzed content exhibits multiple critical fraud signals characteristic of financial investment scams or phishing traps. It promises guaranteed returns forbidden by SEBI regulations and creates artificial high-pressure urgency.',
    uncertainty: 'Assessment represents an automated technical evaluation of visible signals. It does not replace formal regulatory audits.',
    detectedRedFlags: [
      'Guaranteed Returns Promise',
      'Unrealistic ROI Multiplier',
      'High Pressure Urgency Tactics'
    ],
    evidenceItems: [
      { title: 'Guaranteed Returns Promise', details: 'Promised guaranteed returns: "Guaranteed ₹25,000 return"', severity: 'CRITICAL' },
      { title: 'Unrealistic ROI Multiplier', details: 'Unrealistic return multiplier: "25,000 return from ₹5,000"', severity: 'CRITICAL' },
      { title: 'High Pressure Urgency Tactics', details: 'High pressure urgency cue: "Limited time"', severity: 'HIGH' }
    ],
    safeActions: [
      'Do NOT transfer any money or make advance deposits.',
      'Never share OTP, UPI PIN, ATM PIN, or banking passwords.',
      'Do NOT click unknown links or install APK / screen-sharing software (e.g. AnyDesk).',
      'Cross-verify through official regulatory portals (sebi.gov.in / rbi.org.in).',
      'If victimized, immediately call National Cyber Crime Helpline 1930 within the golden hour.'
    ],
    trustedSources: [
      {
        id: 'SEBI-CIR-2024-03',
        title: 'Advisory on Fraudulent Schemes Promising Assured Returns and Unregistered Advisory Services',
        publisher: 'SEBI',
        sourceUrl: 'https://www.sebi.gov.in/',
        summary: 'SEBI cautions investors against dealing with entities offering guaranteed/assured returns on stock market investments.'
      },
      {
        id: 'RBI-SACHET-2024-09',
        title: 'Public Warning on Unregistered Financial Entities & Fake Trading Applications',
        publisher: 'RBI SACHET',
        sourceUrl: 'https://sachet.rbi.org.in/',
        summary: 'Advisory alerting public to verify entity registration under SACHET portal before depositing funds.'
      }
    ],
    piiRedacted: true,
    createdAt: new Date().toISOString()
  };

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let currentY = 14;

  // Header Banner
  doc.setFillColor(11, 19, 43);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCAMSHIELD AI — THREAT & FRAUD AUDIT REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Track A: Digital Fraud Resilience | "Before You Trust It, Verify It."', margin, 18);
  doc.text('Statutory Verification Authority: SEBI | RBI SACHET | CERT-In | 1930 Helpline', margin, 23);

  currentY = 36;

  // Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('REPORT REFERENCE:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(sampleData.id, margin + 42, currentY + 6);

  // Risk Score Badge
  const badgeWidth = 54;
  const badgeX = pageWidth - margin - badgeWidth - 4;
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(badgeX, currentY + 3, badgeWidth, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${sampleData.riskLevel} RISK`, badgeX + badgeWidth / 2, currentY + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`SCORE: ${sampleData.riskScore} / 100`, badgeX + badgeWidth / 2, currentY + 16, { align: 'center' });

  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync('docs/sample-report.pdf', buffer);
  console.log('Sample PDF successfully generated at docs/sample-report.pdf, size:', buffer.length, 'bytes');
}

testPdf().catch(console.error);

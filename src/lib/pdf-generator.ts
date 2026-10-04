import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from '@/lib/analysis-service';

export function generateScamShieldPDF(data: AnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 14;

  // Primary palette: Dark Navy (#0B132B), Cyan (#06B6D4), Red (#DC2626), Amber (#EA580C), Green (#16A34A), Neutral Dark (#1E293B)
  const isHigh = data.riskLevel === 'HIGH';
  const isMedium = data.riskLevel === 'MEDIUM';
  const accentColor: [number, number, number] = isHigh
    ? [220, 38, 38] // Red
    : isMedium
    ? [234, 88, 12] // Orange
    : [22, 163, 74]; // Green

  // ==================== HEADER ====================
  // Dark navy background banner
  doc.setFillColor(11, 19, 43);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Cyan bottom accent border
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCAMSHIELD AI — THREAT & FRAUD AUDIT REPORT', margin, 12);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Track A: Digital Fraud Resilience | "Before You Trust It, Verify It."', margin, 18);
  doc.text('Statutory Verification Authority: SEBI | RBI SACHET | CERT-In | 1930 Helpline', margin, 23);

  currentY = 36;

  // ==================== METADATA & RISK SUMMARY CARD ====================
  // Metadata box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('REPORT REFERENCE:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(data.id || 'SCAN-' + Date.now().toString(36).toUpperCase(), margin + 42, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('AUDIT DATE / TIME:', margin + 4, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(new Date(data.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST', margin + 42, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('INPUT MODALITY:', margin + 4, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${data.inputType || 'DIRECT_INPUT'} ${data.piiRedacted ? '(PII Scrubbed & Redacted)' : ''}`, margin + 42, currentY + 18);

  // Right side of metadata: Risk badge
  const badgeWidth = 54;
  const badgeX = pageWidth - margin - badgeWidth - 4;
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(badgeX, currentY + 3, badgeWidth, 18, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${data.riskLevel} RISK`, badgeX + badgeWidth / 2, currentY + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`SCORE: ${data.riskScore} / 100`, badgeX + badgeWidth / 2, currentY + 16, { align: 'center' });

  currentY += 28;

  // ==================== CATEGORY & EXPLANATION ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EVALUATION FINDING & CATEGORY', margin, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(data.category || 'General Risk Assessment', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const splitExplanation = doc.splitTextToSize(data.explanation || 'No detailed explanation generated.', pageWidth - margin * 2);
  doc.text(splitExplanation, margin, currentY);
  currentY += splitExplanation.length * 4.5 + 4;

  // ==================== DETECTED RED FLAGS TABLE ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETECTED STATUTORY RED FLAGS & EVIDENCE SIGNALS', margin, currentY);
  currentY += 2;

  const redFlagRows = (data.evidenceItems && data.evidenceItems.length > 0)
    ? data.evidenceItems.map(item => [item.severity || 'HIGH', item.title || 'Red Flag Signal', item.details || 'Detected in submitted communication.'])
    : (data.detectedRedFlags && data.detectedRedFlags.length > 0)
    ? data.detectedRedFlags.map(rf => ['HIGH', rf, 'Identified statutory violation under SEBI/RBI guidelines.'])
    : [['NONE', 'Zero Critical Red Flags Detected', 'The analyzed communication does not exhibit overt statutory scam markers.']];

  autoTable(doc, {
    startY: currentY,
    head: [['Severity', 'Violated Indicator / Signal', 'Extracted Evidence Detail']],
    body: redFlagRows,
    theme: 'grid',
    headStyles: {
      fillColor: [11, 19, 43],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 54, fontStyle: 'bold' },
      2: { cellWidth: 'auto' },
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: 'linebreak',
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.index === 0) {
        const val = String(hookData.cell.raw).toUpperCase();
        if (val.includes('CRITICAL')) hookData.cell.styles.textColor = [220, 38, 38];
        else if (val.includes('HIGH')) hookData.cell.styles.textColor = [234, 88, 12];
        else if (val.includes('NONE') || val.includes('LOW')) hookData.cell.styles.textColor = [22, 163, 74];
      }
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Check page overflow
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  // ==================== AUTHORITATIVE RAG SOURCES ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. AUTHORITATIVE REGULATORY CITATIONS & RAG GROUNDING', margin, currentY);
  currentY += 2;

  const ragRows = (data.trustedSources && data.trustedSources.length > 0)
    ? data.trustedSources.map(s => [
        s.publisher || 'Regulator',
        s.id || 'CIRCULAR',
        s.title || 'Official Advisory',
        s.summary || 'Statutory circular warning against financial fraud.'
      ])
    : [['SEBI / RBI', 'REGULATORY_REF', 'Statutory Financial Rules', 'Cross-referenced against SEBI Prohibition of Fraudulent and Unfair Trade Practices Regulations.']];

  autoTable(doc, {
    startY: currentY,
    head: [['Authority', 'Reference ID', 'Circular / Advisory Title', 'Statutory Summary']],
    body: ragRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 48, fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      overflow: 'linebreak',
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Check page overflow
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = 20;
  }

  // ==================== RECOMMENDED SAFE ACTIONS ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. MANDATORY SAFEGUARD ACTIONS (CITIZEN ADVISORY)', margin, currentY);
  currentY += 5;

  const actions = (data.safeActions && data.safeActions.length > 0)
    ? data.safeActions
    : [
        'Do NOT transfer any money, deposits, or advance fees.',
        'Never share OTPs, UPI PINs, passwords, or banking credentials with anyone.',
        'Do NOT install remote desktop applications (AnyDesk, TeamViewer, QuickSupport).',
        'Verify entity registration directly on official portal: sebi.gov.in or sachet.rbi.org.in.',
        'In case of financial fraud, immediately dial 1930 to freeze funds within the Golden Hour.'
      ];

  actions.forEach((act, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(6, 182, 212);
    doc.text(`[${idx + 1}]`, margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const splitAct = doc.splitTextToSize(act, pageWidth - margin * 2 - 10);
    doc.text(splitAct, margin + 8, currentY);
    currentY += splitAct.length * 4.2 + 2;
  });

  currentY += 4;
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }

  // ==================== EMERGENCY HELPLINE & STATUTORY DISCLAIMER ====================
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  doc.text('EMERGENCY CYBER RESPONSE (GOVERNMENT OF INDIA):', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(69, 10, 10);
  doc.text('• National Cyber Crime Reporting Portal: https://cybercrime.gov.in  |  Helpline: 1930 (Toll Free, 24x7)', margin + 3, currentY + 10);
  doc.text('• Statutory Disclaimer: ScamShield AI is an automated investor resilience audit tool. It does not provide financial advice.', margin + 3, currentY + 15);

  // ==================== PAGE FOOTERS ====================
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ScamShield AI Audit Reference: ${data.id || 'RECORD'} | Page ${i} of ${totalPages} | Generated via Authentic Multi-Agent Pipeline`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Save the PDF
  const cleanId = (data.id || 'latest').replace(/[^a-zA-Z0-9_-]/g, '');
  doc.save(`ScamShield_Report_${cleanId}.pdf`);
}

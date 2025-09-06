// utils/pdfGenerator.js
import { jsPDF } from "jspdf";

/**
 * downloadPDF(content, template, userName)
 * - content: full cover letter text (may include greeting & signature)
 * - template: "classic" | "modern" | "minimal"
 * - userName: shown as centered header on page 1
 */
export function downloadPDF(content, template, userName = "") {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  // Page metrics
  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // helpers to draw border & accents
  const drawBorder = () => {
    doc.setDrawColor(200);
    doc.setLineWidth(0.4);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  };

  const drawAccents = () => {
    if (template === "modern") {
      doc.setFillColor(25, 118, 210);
      doc.rect(12, 12, 3, pageHeight - 24, "F"); // left stripe
    } else if (template === "minimal") {
      doc.setFillColor(25, 118, 210);
      doc.rect(12, 12, pageWidth - 24, 4, "F"); // top stripe
    }
  };

  // initial border + accents
  drawBorder();
  drawAccents();

  // choose font
  if (template === "classic") {
    doc.setFont("times", "normal");
  } else if (template === "modern") {
    doc.setFont("helvetica", "normal");
  } else {
    doc.setFont("courier", "normal");
  }

  // Header: always render userName (if provided)
  const headerY = 24;
  const hasUserName = typeof userName === "string" && userName.trim().length > 0;
  if (hasUserName) {
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    // for modern template, use accent color
    if (template === "modern") doc.setTextColor(25, 118, 210);
    else doc.setTextColor(20, 20, 20);

    doc.text(userName.trim(), pageWidth / 2, headerY, { align: "center" });

    // reset
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
  }

  // Body text
  const textToUse = content && content.trim() ? content : "No content provided.";
  const lines = doc.splitTextToSize(textToUse, contentWidth);
  const lineHeight = 6.5; // mm

  // Start Y below header (if header present leave more space)
  let cursorY = hasUserName ? headerY + 10 : 28;

  // render loop with pagination
  const renderPageDecor = () => {
    drawBorder();
    drawAccents();
  };

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight - 20) {
      doc.addPage();
      renderPageDecor();
      // after new page, do not re-render centered header (only page 1)
      cursorY = 28;
    }
    doc.text(lines[i], marginLeft, cursorY);
    cursorY += lineHeight;
  }

  // Save file
  const safeTemplate = (template || "template").replace(/[^a-z0-9-_]/gi, "").toLowerCase();
  doc.save(`cover_letter_${safeTemplate}.pdf`);
}

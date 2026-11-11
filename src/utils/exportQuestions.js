import { jsPDF } from 'jspdf';

/**
 * Clean plain-text sanitizer for PDF generation (strips markdown asterisks, backticks, etc.)
 */
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, (match) => {
      // Keep code content inside backticks readable
      return match.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
    })
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .trim();
}

/**
 * Generates and downloads a clean, professional multi-page PDF report of the interview questions
 */
export function exportToPdf({ questions = [], topic = 'Technical', stats = {}, difficulty = 'Intermediate' }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  };

  // Header Banner
  doc.setFillColor(24, 24, 27); // Zinc 900
  doc.rect(margin, cursorY, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('JOBVASTADHI - INTERVIEW ASSESSMENT REPORT', margin + 6, cursorY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(161, 161, 170); // Zinc 400
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Topic: ${topic}  |  Level: ${difficulty}  |  Developed by Sharief  |  ${dateStr}`, margin + 6, cursorY + 17);

  cursorY += 28;

  // Score Summary Box if stats exist
  if (stats && stats.attempted > 0) {
    const accuracy = Math.round((stats.correct / stats.attempted) * 100);
    doc.setFillColor(244, 244, 245); // Zinc 100
    doc.setDrawColor(228, 228, 231); // Zinc 200
    doc.rect(margin, cursorY, contentWidth, 12, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(24, 24, 27);
    const summaryText = `Total Attempted: ${stats.attempted}   |   Score: ${stats.correct}/${stats.attempted}   |   Accuracy: ${accuracy}%   |   Best Streak: ${stats.bestStreak || stats.streak || 0}`;
    doc.text(summaryText, margin + 5, cursorY + 8);
    cursorY += 16;
  }

  // Iterate Questions
  questions.forEach((q, index) => {
    checkPageBreak(35);

    const questionNumber = index + 1;

    // Question Number & Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 27); // Zinc 900

    const cleanQuestionText = stripMarkdown(q.question);
    const questionLines = doc.splitTextToSize(`Q${questionNumber}. ${cleanQuestionText}`, contentWidth);
    doc.text(questionLines, margin, cursorY);
    cursorY += questionLines.length * 5 + 2;

    // Options (A, B, C, D)
    const optionLetters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, optIdx) => {
      checkPageBreak(8);

      const isChosen = q.selectedOption === optIdx;
      const isRight = q.correctIndex === optIdx;

      let prefix = `   ${optionLetters[optIdx]}. `;
      let optText = stripMarkdown(opt);

      doc.setFont('helvetica', isRight ? 'bold' : 'normal');

      if (isChosen && isRight) {
        doc.setTextColor(22, 101, 52); // Emerald 800
        optText += '  [Your Answer - Correct]';
      } else if (isChosen && !isRight) {
        doc.setTextColor(153, 27, 27); // Rose 800
        optText += '  [Your Answer - Incorrect]';
      } else if (isRight) {
        doc.setTextColor(22, 101, 52); // Emerald 800
        optText += '  [Correct Answer]';
      } else {
        doc.setTextColor(75, 85, 99); // Zinc 600
      }

      doc.setFontSize(9);
      const optLines = doc.splitTextToSize(`${prefix}${optText}`, contentWidth - 4);
      doc.text(optLines, margin, cursorY);
      cursorY += optLines.length * 4.5;
    });

    // Explanation / Rationale
    if (q.explanation) {
      checkPageBreak(16);
      cursorY += 1.5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text('Interview Rationale:', margin + 4, cursorY);
      cursorY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(82, 82, 91); // Zinc 600
      const cleanExpl = stripMarkdown(q.explanation);
      const explLines = doc.splitTextToSize(cleanExpl, contentWidth - 8);
      doc.text(explLines, margin + 4, cursorY);
      cursorY += explLines.length * 4 + 4;
    }

    // Divider Line
    checkPageBreak(6);
    doc.setDrawColor(228, 228, 231); // Zinc 200
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 6;
  });

  const fileName = `jobvastadhi-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-questions.pdf`;
  doc.save(fileName);
}

/**
 * Downloads a clean formatted Markdown (.md) document
 */
export function exportToMarkdown({ questions = [], topic = 'Technical', stats = {}, difficulty = 'Intermediate' }) {
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let md = `# jobVastadhi - ${topic} Interview Assessment Report\n\n`;
  md += `*Developed by Sharief*  \n`;
  md += `**Level:** ${difficulty}  |  **Date:** ${dateStr}  \n`;

  if (stats && stats.attempted > 0) {
    const accuracy = Math.round((stats.correct / stats.attempted) * 100);
    md += `**Score:** ${stats.correct}/${stats.attempted} (${accuracy}%) | **Best Streak:** ${stats.bestStreak || stats.streak || 0}\n\n`;
  }

  md += `---\n\n`;

  questions.forEach((q, idx) => {
    const num = idx + 1;
    md += `### Q${num}. ${q.question}\n\n`;

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, optIdx) => {
      const isChosen = q.selectedOption === optIdx;
      const isRight = q.correctIndex === optIdx;

      let suffix = '';
      if (isChosen && isRight) suffix = '  *(Your Pick - Correct)*';
      else if (isChosen && !isRight) suffix = '  *(Your Pick - Incorrect)*';
      else if (isRight) suffix = '  *(Correct Answer)*';

      md += `- **${letters[optIdx]}.** ${opt}${suffix}\n`;
    });

    if (q.explanation) {
      md += `\n> **Interview Rationale:** ${q.explanation}\n\n`;
    }

    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jobvastadhi-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-questions.md`;
  a.click();
  URL.revokeObjectURL(url);
}

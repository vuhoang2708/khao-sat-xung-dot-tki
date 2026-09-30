import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportReportToPDF(
  elementId: string,
  filename: string = 'Bao_Cao_Phong_Cach_Xung_Dot_TKI.pdf'
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Không tìm thấy phần tử HTML có id "${elementId}".`);
  }

  // Check if container contains dedicated multi-page elements
  const pageIds = ['pdf-page-1', 'pdf-page-2', 'pdf-page-3'];
  const pages = pageIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  if (pages.length > 0) {
    // Multi-page isolated capture: Each page corresponds exactly to one A4 sheet
    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x crisp resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#020617',
        windowWidth: 794,
        windowHeight: 1123,
      });

      // Use JPEG with 0.92 quality: high definition but compresses dark gradients ~10x better than PNG
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }
  } else {
    // Fallback if individual page IDs are not found
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#020617',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }
  }

  pdf.save(filename);
}

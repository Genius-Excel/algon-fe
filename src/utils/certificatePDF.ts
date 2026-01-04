import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Application } from "../Types/types";

export interface CertificateData {
  id: string;
  holderName: string;
  nin: string;
  dateOfBirth?: string;
  state: string;
  lga: string;
  village?: string;
  issueDate: string;
  certificateType: "indigene" | "digitized";
}

export const generateCertificatePDF = (data: CertificateData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Border
  doc.setLineWidth(2);
  doc.setDrawColor(34, 197, 94); // green-500
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94);
  doc.text("CERTIFICATE OF INDIGENE", pageWidth / 2, 30, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Local Government Certificate Issuance and Verification System",
    pageWidth / 2,
    38,
    { align: "center" }
  );

  // Decorative line
  doc.setLineWidth(0.5);
  doc.setDrawColor(34, 197, 94);
  doc.line(40, 45, pageWidth - 40, 45);

  // Certificate body
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  let yPos = 60;

  doc.text("This is to certify that:", 20, yPos);
  yPos += 15;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94);
  doc.text(data.holderName.toUpperCase(), pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 15;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const bodyText = [
    `with National Identification Number (NIN): ${data.nin}`,
    "",
    `is a bonafide indigene of ${data.village || ""} ${
      data.village ? "village," : ""
    } ${data.lga} Local Government Area,`,
    `${data.state} State, Federal Republic of Nigeria.`,
  ];

  bodyText.forEach((line) => {
    doc.text(line, pageWidth / 2, yPos, { align: "center" });
    yPos += 7;
  });

  yPos += 10;

  // Certificate details table
  autoTable(doc, {
    startY: yPos,
    head: [["Certificate Information", ""]],
    body: [
      ["Certificate ID", data.id],
      ["Issue Date", new Date(data.issueDate).toLocaleDateString("en-NG")],
      [
        "Certificate Type",
        data.certificateType === "digitized"
          ? "Digitized Certificate"
          : "Original Certificate",
      ],
      ["State", data.state],
      ["Local Government", data.lga],
    ],
    theme: "grid",
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  doc.line(30, finalY, 80, finalY);
  doc.text("Authorized Signature", 55, finalY + 7, { align: "center" });

  doc.line(pageWidth - 80, finalY, pageWidth - 30, finalY);
  doc.text("Official Stamp", pageWidth - 55, finalY + 7, { align: "center" });

  // QR Code placeholder
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Scan QR code to verify this certificate at " +
      window.location.origin +
      "/verify",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );

  // Save the PDF
  doc.save(
    `Certificate-${data.holderName.replace(/\s+/g, "_")}-${data.id.slice(
      0,
      8
    )}.pdf`
  );
};

export const downloadCertificate = (application: Application): void => {
  const certificateData: CertificateData = {
    id: application.id,
    holderName: application.name,
    nin: application.nin,
    state: application.state,
    lga: application.lga,
    village: application.village,
    issueDate: application.dateProcessed || new Date().toISOString(),
    certificateType: "indigene",
  };

  generateCertificatePDF(certificateData);
};

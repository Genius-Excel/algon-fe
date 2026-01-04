import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "./ui/card";

interface CertificateQRCodeProps {
  certificateId: string;
  holderName: string;
  nin: string;
  size?: number;
}

export function CertificateQRCode({
  certificateId,
  holderName,
  nin,
  size = 200,
}: CertificateQRCodeProps) {
  // Create verification URL with certificate data
  const verificationData = JSON.stringify({
    certificateId,
    holderName,
    nin,
    verifyUrl: `${window.location.origin}/verify?id=${certificateId}`,
  });

  return (
    <Card className="inline-flex flex-col items-center p-6 bg-white">
      <QRCodeSVG
        value={verificationData}
        size={size}
        level="H"
        includeMargin={true}
        imageSettings={{
          src: "/logo.png",
          height: size * 0.2,
          width: size * 0.2,
          excavate: true,
        }}
      />
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Scan to verify certificate
      </p>
      <p className="text-xs font-mono mt-1">{certificateId.slice(0, 12)}...</p>
    </Card>
  );
}

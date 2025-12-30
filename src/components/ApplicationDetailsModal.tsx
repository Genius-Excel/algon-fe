import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { StatusBadge } from "./StatusBadge";
import { CertificateQRCode } from "./CertificateQRCode";
import { downloadCertificate } from "../utils/certificatePDF";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  X,
  FileText,
} from "lucide-react";
import type { Application } from "../Types/types";

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
}: ApplicationDetailsModalProps) {
  if (!application) return null;

  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-foreground font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Application Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Application ID</p>
              <p className="font-mono text-sm">{application.id}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Personal Information</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <DetailRow
                icon={User}
                label="Full Name"
                value={application.name}
              />
              <DetailRow icon={FileText} label="NIN" value={application.nin} />
              <DetailRow
                icon={Mail}
                label="Email"
                value={application.email || "N/A"}
              />
              <DetailRow
                icon={Phone}
                label="Phone Number"
                value={application.phone || "N/A"}
              />
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Location</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <DetailRow
                icon={MapPin}
                label="State"
                value={application.state}
              />
              <DetailRow
                icon={MapPin}
                label="Local Government"
                value={application.lga}
              />
              <DetailRow
                icon={MapPin}
                label="Village"
                value={application.village || "N/A"}
              />
            </div>
          </div>

          {/* Application Timeline */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Timeline</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <DetailRow
                icon={Calendar}
                label="Date Applied"
                value={new Date(application.dateApplied).toLocaleDateString()}
              />
              <DetailRow
                icon={Calendar}
                label="Date Processed"
                value={
                  application.dateProcessed
                    ? new Date(application.dateProcessed).toLocaleDateString()
                    : "Pending"
                }
              />
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Payment</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <DetailRow
                icon={CreditCard}
                label="Payment Status"
                value={application.payment}
              />
            </div>
          </div>

          {/* QR Code for Approved Applications */}
          {application.status === "approved" && (
            <div>
              <h3 className="font-semibold mb-3 text-lg">
                Certificate QR Code
              </h3>
              <div className="flex justify-center">
                <CertificateQRCode
                  certificateId={application.id}
                  holderName={application.name}
                  nin={application.nin}
                  size={180}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {application.status === "approved" && (
              <Button
                className="flex-1"
                onClick={() => {
                  downloadCertificate(application);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

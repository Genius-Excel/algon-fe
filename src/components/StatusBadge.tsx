import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'under-review' | 'digitization';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    'under-review': { label: 'Under Review', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    'digitization': { label: 'Digitization', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' }
  };

  const variant = variants[status];

  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  );
}

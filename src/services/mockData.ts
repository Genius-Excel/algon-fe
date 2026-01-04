import type {
  Application,
  DigitizationRequest,
  DynamicField,
  LocalGovernment,
  AuditLogEntry,
  MonthlyData,
} from "../Types/types";

// ============================================================================
// MOCK APPLICATIONS
// ============================================================================

export const mockApplications: Application[] = [
  {
    id: "APP-2025-001",
    name: "John Oluwaseun Doe",
    nin: "12345678901",
    status: "approved",
    payment: "Paid",
    dateProcessed: "2025-10-15",
    dateApplied: "2025-10-01",
    village: "Agege",
    lga: "Ikeja",
    state: "Lagos",
    email: "john.doe@example.com",
    phone: "08012345678",
  },
  {
    id: "APP-2025-002",
    name: "Amina Bello Mohammed",
    nin: "98765432109",
    status: "under-review",
    payment: "Paid",
    dateProcessed: "2025-10-18",
    dateApplied: "2025-10-10",
    village: "Ikeja GRA",
    lga: "Ikeja",
    state: "Lagos",
    email: "amina.bello@example.com",
    phone: "08098765432",
  },
  {
    id: "APP-2025-003",
    name: "Chukwu Emeka Okafor",
    nin: "55566677788",
    status: "approved",
    payment: "Paid",
    dateProcessed: "2025-10-12",
    dateApplied: "2025-10-05",
    village: "Oshodi",
    lga: "Ikeja",
    state: "Lagos",
    email: "emeka.okafor@example.com",
    phone: "08055566777",
  },
  {
    id: "APP-2025-004",
    name: "Fatima Ibrahim Hassan",
    nin: "11122233344",
    status: "rejected",
    payment: "Paid",
    dateProcessed: "2025-10-14",
    dateApplied: "2025-10-08",
    village: "Mushin",
    lga: "Ikeja",
    state: "Lagos",
    email: "fatima.hassan@example.com",
    phone: "08011122233",
  },
  {
    id: "APP-2025-005",
    name: "Oluwaseun Adeyemi Williams",
    nin: "22233344455",
    status: "pending",
    payment: "Paid",
    dateProcessed: "-",
    dateApplied: "2025-10-20",
    village: "Surulere",
    lga: "Ikeja",
    state: "Lagos",
    email: "seun.williams@example.com",
    phone: "08022233344",
  },
  {
    id: "APP-2025-006",
    name: "Grace Onyinye Nwankwo",
    nin: "77788899900",
    status: "under-review",
    payment: "Paid",
    dateProcessed: "2025-10-19",
    dateApplied: "2025-10-15",
    village: "Yaba",
    lga: "Lagos Island",
    state: "Lagos",
    email: "grace.nwankwo@example.com",
    phone: "08077788899",
  },
  {
    id: "APP-2025-007",
    name: "Ibrahim Musa Yusuf",
    nin: "44455566677",
    status: "approved",
    payment: "Paid",
    dateProcessed: "2025-10-10",
    dateApplied: "2025-10-02",
    village: "Victoria Island",
    lga: "Eti-Osa",
    state: "Lagos",
    email: "ibrahim.yusuf@example.com",
    phone: "08044455566",
  },
  {
    id: "APP-2025-008",
    name: "Blessing Chidinma Okonkwo",
    nin: "33366699988",
    status: "approved",
    payment: "Paid",
    dateProcessed: "2025-10-16",
    dateApplied: "2025-10-11",
    village: "Lekki",
    lga: "Eti-Osa",
    state: "Lagos",
    email: "blessing.okonkwo@example.com",
    phone: "08033366699",
  },
];

// ============================================================================
// MOCK DIGITIZATION REQUESTS
// ============================================================================

export const mockDigitizationRequests: DigitizationRequest[] = [
  {
    id: "DIGI-2025-001",
    name: "Taiwo Adebayo Ogunleye",
    nin: "33344455566",
    status: "pending",
    payment: "Paid",
    date: "2025-10-20",
    certificateRef: "CERT-IKJ-2018-123",
    uploadPreview: "certificate_scan.pdf",
  },
  {
    id: "DIGI-2025-002",
    name: "Grace Onyinye Nwankwo",
    nin: "77788899900",
    status: "under-review",
    payment: "Paid",
    date: "2025-10-19",
    certificateRef: "",
    uploadPreview: "old_cert.jpg",
  },
  {
    id: "DIGI-2025-003",
    name: "Ibrahim Musa Yusuf",
    nin: "44455566677",
    status: "approved",
    payment: "Paid",
    date: "2025-10-16",
    certificateRef: "CERT-IKJ-2015-078",
    uploadPreview: "certificate.pdf",
  },
  {
    id: "DIGI-2025-004",
    name: "Adewale Johnson Akinola",
    nin: "66677788899",
    status: "digitization",
    payment: "Paid",
    date: "2025-10-18",
    certificateRef: "CERT-IKJ-2019-234",
    uploadPreview: "cert_copy.pdf",
  },
];

// ============================================================================
// MOCK DYNAMIC FIELDS
// ============================================================================

export const mockDynamicFields: DynamicField[] = [
  {
    id: "1",
    field_label: "Letter from Traditional Ruler",
    field_type: "file",
    is_required: true,
  },
  {
    id: "2",
    field_label: "Proof of Residence",
    field_type: "file",
    is_required: true,
  },
  {
    id: "3",
    field_label: "Community Leader Endorsement",
    field_type: "text",
    is_required: false,
  },
  {
    id: "4",
    field_label: "Years of Residence",
    field_type: "number",
    is_required: true,
  },
];

// ============================================================================
// MOCK ANALYTICS DATA
// ============================================================================

export const mockWeeklyData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 },
];

export const mockApprovalData = [
  { name: "Approved", value: 145, color: "#10b981" },
  { name: "Pending", value: 23, color: "#f59e0b" },
  { name: "Rejected", value: 12, color: "#ef4444" },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", applications: 1240, revenue: 6820000 },
  { month: "Feb", applications: 1580, revenue: 8690000 },
  { month: "Mar", applications: 1320, revenue: 7260000 },
  { month: "Apr", applications: 1690, revenue: 9295000 },
  { month: "May", applications: 1950, revenue: 10725000 },
  { month: "Jun", applications: 2100, revenue: 11550000 },
];

// ============================================================================
// MOCK LOCAL GOVERNMENTS
// ============================================================================

export const mockLocalGovernments: LocalGovernment[] = [
  {
    id: "1",
    name: "Ikeja",
    state: { name: "Lagos", id: "LA" },
    assigned_admin: {
      id: "admin-1",
      name: "Adeola Johnson",
      email: "adeola.johnson@ikeja.gov.ng"
    },
    certificates: { certificates: 145, digitization: 23 },
    revenue: 797500,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Lagos Island",
    state: { name: "Lagos", id: "LA" },
    assigned_admin: {
      id: "admin-2",
      name: "Chioma Nwankwo",
      email: "chioma.nwankwo@lagosisland.gov.ng"
    },
    certificates: { certificates: 198, digitization: 31 },
    revenue: 1089000,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: "3",
    name: "Surulere",
    state: { name: "Lagos", id: "LA" },
    assigned_admin: {
      id: "admin-3",
      name: "Ibrahim Musa",
      email: "ibrahim.musa@surulere.gov.ng"
    },
    certificates: { certificates: 132, digitization: 18 },
    revenue: 726000,
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z"
  },
  {
    id: "4",
    name: "Kano Municipal",
    state: { name: "Kano", id: "KN" },
    assigned_admin: {
      id: "admin-4",
      name: "Fatima Hassan",
      email: "fatima.hassan@kanomunicipal.gov.ng"
    },
    certificates: { certificates: 256, digitization: 42 },
    revenue: 1408000,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z"
  },
  {
    id: "5",
    name: "Port Harcourt",
    state: { name: "Rivers", id: "RI" },
    assigned_admin: {
      id: "admin-5",
      name: "Emmanuel Okon",
      email: "emmanuel.okon@portharcourt.gov.ng"
    },
    certificates: { certificates: 189, digitization: 27 },
    revenue: 1039500,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z"
  },
  {
    id: "6",
    name: "Kaduna North",
    state: { name: "Kaduna", id: "KD" },
    assigned_admin: {
      id: "admin-6",
      name: "Aisha Bello",
      email: "aisha.bello@kadunanorth.gov.ng"
    },
    certificates: { certificates: 0, digitization: 0 },
    revenue: 0,
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z"
  },
  {
    id: "7",
    name: "Eti-Osa",
    state: { name: "Lagos", id: "LA" },
    assigned_admin: {
      id: "admin-7",
      name: "Tunde Adeyemi",
      email: "tunde.adeyemi@etiosa.gov.ng"
    },
    certificates: { certificates: 178, digitization: 25 },
    revenue: 979000,
    created_at: "2024-04-05T00:00:00Z",
    updated_at: "2024-04-05T00:00:00Z"
  },
  {
    id: "8",
    name: "Alimosho",
    state: { name: "Lagos", id: "LA" },
    assigned_admin: {
      id: "admin-8",
      name: "Grace Okafor",
      email: "grace.okafor@alimosho.gov.ng"
    },
    certificates: { certificates: 312, digitization: 48 },
    revenue: 1716000,
    created_at: "2024-04-12T00:00:00Z",
    updated_at: "2024-04-12T00:00:00Z"
  },
  {
    id: "9",
    name: "Gwagwalada",
    state: { name: "FCT", id: "FC" },
    assigned_admin: {
      id: "admin-9",
      name: "Mohammed Yusuf",
      email: "mohammed.yusuf@gwagwalada.gov.ng"
    },
    certificates: { certificates: 95, digitization: 14 },
    revenue: 522500,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z"
  },
  {
    id: "10",
    name: "Abuja Municipal",
    state: { name: "FCT", id: "FC" },
    assigned_admin: {
      id: "admin-10",
      name: "Patricia Eze",
      email: "patricia.eze@abujamunicipal.gov.ng"
    },
    certificates: { certificates: 267, digitization: 39 },
    revenue: 1468500,
    created_at: "2024-05-10T00:00:00Z",
    updated_at: "2024-05-10T00:00:00Z"
  },
  {
    id: "11",
    name: "Ibadan North",
    state: { name: "Oyo", id: "OY" },
    assigned_admin: {
      id: "admin-11",
      name: "Oluwaseun Ajayi",
      email: "oluwaseun.ajayi@ibadannorth.gov.ng"
    },
    certificates: { certificates: 156, digitization: 22 },
    revenue: 858000,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z"
  },
  {
    id: "12",
    name: "Enugu North",
    state: { name: "Enugu", id: "EN" },
    assigned_admin: {
      id: "admin-12",
      name: "Chinedu Okonkwo",
      email: "chinedu.okonkwo@enugunorth.gov.ng"
    },
    certificates: { certificates: 124, digitization: 17 },
    revenue: 682000,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2024-06-15T00:00:00Z"
  },
  {
    id: "13",
    name: "Aba North",
    state: { name: "Abia", id: "AB" },
    assigned_admin: {
      id: "admin-13",
      name: "Ngozi Obi",
      email: "ngozi.obi@abanorth.gov.ng"
    },
    certificates: { certificates: 143, digitization: 20 },
    revenue: 786500,
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z"
  },
  {
    id: "14",
    name: "Benin City",
    state: { name: "Edo", id: "ED" },
    assigned_admin: {
      id: "admin-14",
      name: "Osaze Omoregie",
      email: "osaze.omoregie@benincity.gov.ng"
    },
    certificates: { certificates: 201, digitization: 29 },
    revenue: 1105500,
    created_at: "2024-07-20T00:00:00Z",
    updated_at: "2024-07-20T00:00:00Z"
  },
  {
    id: "15",
    name: "Jos North",
    state: { name: "Plateau", id: "PL" },
    assigned_admin: {
      id: "admin-15",
      name: "Daniel Pwajok",
      email: "daniel.pwajok@josnorth.gov.ng"
    },
    certificates: { certificates: 87, digitization: 12 },
    revenue: 478500,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z"
  },
  {
    id: "16",
    name: "Maiduguri",
    state: { name: "Borno", id: "BO" },
    assigned_admin: {
      id: "admin-16",
      name: "Zainab Ali",
      email: "zainab.ali@maiduguri.gov.ng"
    },
    certificates: { certificates: 0, digitization: 0 },
    revenue: 0,
    created_at: "2024-08-15T00:00:00Z",
    updated_at: "2024-08-15T00:00:00Z"
  },
  {
    id: "17",
    name: "Calabar Municipal",
    state: { name: "Cross River", id: "CR" },
    assigned_admin: {
      id: "admin-17",
      name: "Ekaette Bassey",
      email: "ekaette.bassey@calabar.gov.ng"
    },
    certificates: { certificates: 112, digitization: 16 },
    revenue: 616000,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z"
  },
  {
    id: "18",
    name: "Ilorin West",
    state: { name: "Kwara", id: "KW" },
    assigned_admin: {
      id: "admin-18",
      name: "Abdullahi Rahman",
      email: "abdullahi.rahman@ilorinwest.gov.ng"
    },
    certificates: { certificates: 134, digitization: 19 },
    revenue: 737000,
    created_at: "2024-09-15T00:00:00Z",
    updated_at: "2024-09-15T00:00:00Z"
  },
  {
    id: "19",
    name: "Sokoto North",
    state: { name: "Sokoto", id: "SO" },
    assigned_admin: {
      id: "admin-19",
      name: "Hauwa Usman",
      email: "hauwa.usman@sokotonorth.gov.ng"
    },
    certificates: { certificates: 98, digitization: 13 },
    revenue: 539000,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z"
  },
  {
    id: "20",
    name: "Bauchi",
    state: { name: "Bauchi", id: "BA" },
    assigned_admin: {
      id: "admin-20",
      name: "Yakubu Ibrahim",
      email: "yakubu.ibrahim@bauchi.gov.ng"
    },
    certificates: { certificates: 0, digitization: 0 },
    revenue: 0,
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z"
  },
];

// ============================================================================
// MOCK AUDIT LOG
// ============================================================================

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 1,
    action: "LG Admin approved 12 certificates",
    user: "Adeola Johnson (Ikeja)",
    timestamp: "2025-10-20 14:30",
    details: "Bulk approval of applications",
  },
  {
    id: 2,
    action: "New LGA added to system",
    user: "System Admin",
    timestamp: "2025-10-20 12:15",
    details: "Kaduna North LGA onboarded",
  },
  {
    id: 3,
    action: "Payment configuration updated",
    user: "Super Admin",
    timestamp: "2025-10-19 16:45",
    details: "Application fee changed from ₦4,500 to ₦5,000",
  },
  {
    id: 4,
    action: "LG Admin rejected 3 applications",
    user: "Chioma Nwankwo (Lagos Island)",
    timestamp: "2025-10-19 10:20",
    details: "Insufficient documentation",
  },
  {
    id: 5,
    action: "System backup completed",
    user: "System",
    timestamp: "2025-10-19 03:00",
    details: "Automated daily backup",
  },
  {
    id: 6,
    action: "Dynamic field added",
    user: "Ibrahim Musa (Surulere)",
    timestamp: "2025-10-18 15:30",
    details: "Added 'Community Leader Recommendation' field",
  },
];

// ============================================================================
// MOCK USER DATA
// ============================================================================

export const mockUsers = {
  applicant: {
    id: "user-001",
    email: "applicant@example.com",
    role: "applicant" as const,
    name: "John Doe",
    phone: "08012345678",
    nin: "12345678901",
  },
  lgAdmin: {
    id: "admin-001",
    email: "admin@ikeja.gov.ng",
    role: "lg-admin" as const,
    name: "Adeola Johnson",
    phone: "08098765432",
  },
  superAdmin: {
    id: "super-001",
    email: "superadmin@lgcivs.gov.ng",
    role: "super-admin" as const,
    name: "System Administrator",
    phone: "08011112222",
  },
};

// ============================================================================
// MOCK CERTIFICATE DATA
// ============================================================================

export const mockCertificateData = {
  holderName: "John Oluwaseun Doe",
  certificateId: "CERT-IKJ-2025-001",
  lga: "Ikeja LGA",
  state: "Lagos State",
  issueDate: "October 15, 2025",
  status: "Active",
  nin: "12345678901",
  expiryDate: "October 15, 2032",
};

// ============================================================================
// AUTH SERVICE MOCK
// ============================================================================

export const mockAuthService = {
  async login(credentials: any) {
    await delay(1000);

    const email = credentials.email.toLowerCase();

    // Determine role based on email
    let role: "applicant" | "lg_admin" | "super_admin" = "applicant";
    let user: any;

    // ✅ Check for super admin first (most specific)
    if (email.includes("superadmin")) {
      role = "super_admin";
      user = {
        id: 3,
        email: email,
        firstName: "Super",
        lastName: "Admin",
        role: "super_admin",
      };
    }
    // ✅ Then check for LG admin
    else if (email.includes("admin")) {
      role = "lg_admin";
      user = {
        id: 2,
        email: email,
        firstName: "LG",
        lastName: "Admin",
        role: "lg_admin",
        lg: "Ikeja",
      };
    }
    // ✅ Default to applicant
    else {
      role = "applicant";
      user = {
        id: 1,
        email: email,
        firstName: "John",
        lastName: "Doe",
        role: "applicant",
      };
    }

    console.log("Mock Login:", { email, role, user });

    return {
      access: "mock_access_token_" + Date.now(),
      refresh: "mock_refresh_token_" + Date.now(),
      user: user,
    };
  },

  async register(data: any) {
    await delay(1000);

    return {
      access: "mock_access_token_" + Date.now(),
      refresh: "mock_refresh_token_" + Date.now(),
      user: {
        id: Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "applicant",
      },
    };
  },

  async refreshToken(refresh: string) {
    await delay(500);

    return {
      access: "mock_access_token_" + Date.now(),
    };
  },

  async logout() {
    await delay(300);
    return { message: "Logged out successfully" };
  },

  async getCurrentUser() {
    await delay(300);

    // Return a default applicant user
    return {
      id: 1,
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "applicant",
    };
  },
};

function delay(arg0: number) {
  throw new Error("Function not implemented.");
}

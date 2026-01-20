# Developer Quick Reference: Certificate Application API

## 🚀 Quick Start

### Import the service

```typescript
import { applicationService } from "../services";
```

---

## 📌 Step 1: Submit Application

### Method

```typescript
applicationService.submitCertificateApplication(data);
```

### Parameters

```typescript
{
  date_of_birth: string;      // Format: "YYYY-MM-DD" (e.g., "1993-04-01")
  email: string;              // Valid email address
  full_name: string;          // Applicant's full name
  landmark: string;           // Notable landmark near residence
  local_government: string;   // LGA name (e.g., "Agege")
  phone_number: string;       // Format: "+234XXXXXXXXXX"
  state: string;              // State name (e.g., "Lagos")
  village: string;            // Village/town name
  nin: string;                // 11-digit NIN (e.g., "12845678901")
  nin_slip?: File;            // Optional: NIN slip image/PDF
  profile_photo?: File;       // Optional: Passport photo
}
```

### Response

```typescript
{
  message: "Application saved successfully",
  data: {
    user_data: { /* submitted data */ },
    extra_fields: [],
    application_id: "6a962ba9-7039-4237-9905-9ff6f54a359e"
  }
}
```

### Example Usage

```typescript
try {
  const response = await applicationService.submitCertificateApplication({
    date_of_birth: "1993-04-01",
    email: "user@example.com",
    full_name: "John Doe",
    landmark: "City Mall",
    local_government: "Ikeja",
    phone_number: "+2348012345678",
    state: "Lagos",
    village: "Allen",
    nin: "12345678901",
    nin_slip: ninSlipFile, // File object
    profile_photo: photoFile, // File object
  });

  const applicationId = response.data.application_id;
  console.log("Application submitted:", applicationId);
} catch (error) {
  // Handle errors (see error codes below)
}
```

---

## 📌 Step 2: Update Application

### Method

```typescript
applicationService.updateApplicationStep2(applicationId, data);
```

### Parameters

```typescript
applicationId: string;  // UUID from Step 1 response

data: {
  residential_address: string;  // Full residential address
  landmark: string;             // Landmark near residence
  extra_fields?: Array<{        // Optional dynamic fields
    field_name: string;
    field_value: string;
    field_id: string;
  }>;
  [key: string]: any;           // Additional file fields
}
```

### Response

```typescript
{
  message: "Additional requirements successfully updated",
  data: {
    fee: {
      application_fee: 5000,        // Amount in currency
      digitization_fee: null,
      regeneration_fee: null,
      currency: "NGN",
      local_government: null,
      last_updated_by: null
    },
    verification_fee: 1000,
    application_id: "68edb8c1-0a8c-4270-9a95-f1fa7fabee72"
  }
}
```

### Example Usage

```typescript
try {
  const response = await applicationService.updateApplicationStep2(
    applicationId,
    {
      residential_address: "17, Airport Road, Ikeja",
      landmark: "Near Airport",
      extra_fields: [
        {
          field_name: "Birth Certificate",
          field_value: "file",
          field_id: "59259b71-735d-4e12-8fbb-984df3609a3e",
        },
      ],
      "Birth Certificate": birthCertFile, // File for the dynamic field
    },
  );

  const applicationFee = response.data.fee.application_fee;
  console.log("Fee:", applicationFee);
} catch (error) {
  // Handle errors
}
```

---

## ⚠️ Error Handling

### HTTP Error Codes

| Code    | Meaning                               | Action                              |
| ------- | ------------------------------------- | ----------------------------------- |
| **400** | Bad Request - Invalid fields          | Check validation errors in response |
| **401** | Unauthorized - Invalid/expired token  | Redirect to login                   |
| **403** | Forbidden - No permission             | Show error message                  |
| **404** | Not Found - Application doesn't exist | Check application ID                |
| **409** | Conflict - Duplicate application      | User already has application        |
| **422** | Unprocessable - Validation failed     | Show field-specific errors          |
| **429** | Too Many Requests - Rate limited      | Ask user to wait                    |
| **500** | Internal Server Error                 | Retry or contact support            |

### Error Response Format

```typescript
{
  error: {
    email: ["This field is required."],
    nin: ["Invalid NIN format."]
  }
}
```

### Example Error Handler

```typescript
try {
  await applicationService.submitCertificateApplication(data);
} catch (error: any) {
  const status = error.response?.status;
  const errorData = error.response?.data;

  switch (status) {
    case 400:
    case 422:
      // Show validation errors
      if (errorData?.error) {
        Object.entries(errorData.error).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`);
        });
      }
      break;

    case 401:
      // Redirect to login
      navigate("/login");
      break;

    case 409:
      toast.error("You already have an application with this NIN");
      break;

    case 429:
      toast.error("Too many attempts. Please wait and try again.");
      break;

    default:
      toast.error("Something went wrong. Please try again.");
  }
}
```

---

## 🔐 Authentication

All requests automatically include the Bearer token via axios interceptor:

```typescript
Authorization: Bearer<access_token>;
```

No manual header configuration needed when using `applicationService`.

---

## 📄 File Upload Requirements

### NIN Slip

- **Max Size:** 5 MB
- **Formats:** JPEG, PNG, PDF
- **Field Name:** `nin_slip`

### Profile Photo

- **Max Size:** 2 MB
- **Formats:** JPEG, PNG
- **Field Name:** `profile_photo`
- **Recommended:** Compressed passport-style photo

### Dynamic Field Files

- Field name matches the `field_name` in `extra_fields`
- Automatically appended to FormData

---

## 🔄 Complete Flow Example

```typescript
async function submitCompleteApplication() {
  try {
    // Step 1: Submit basic info
    const step1Response = await applicationService.submitCertificateApplication(
      {
        date_of_birth: "1993-04-01",
        email: "user@example.com",
        full_name: "John Doe",
        landmark: "City Mall",
        local_government: "Ikeja",
        phone_number: "+2348012345678",
        state: "Lagos",
        village: "Allen",
        nin: "12345678901",
        nin_slip: ninSlipFile,
        profile_photo: photoFile,
      },
    );

    const appId = step1Response.data.application_id;

    // Step 2: Add address and extra fields
    const step2Response = await applicationService.updateApplicationStep2(
      appId,
      {
        residential_address: "17, Airport Road, Ikeja",
        landmark: "Near Airport",
      },
    );

    const fee = step2Response.data.fee.application_fee || 0;

    // Step 3: Verify NIN
    await applicationService.verifyNIN(appId, "certificate");

    // Step 4: Initialize payment
    const paymentResult = await applicationService.initiatePayment({
      payment_type: "certificate",
      application_id: appId,
    });

    // Open payment URL
    window.open(paymentResult.data.authorization_url, "_blank");
  } catch (error) {
    handleApplicationError(error);
  }
}
```

---

## 🧪 Testing Tips

### Local Testing

```bash
# Set environment variable
VITE_API_URL=http://localhost:8000/api

# Or in .env file
VITE_API_URL=http://localhost:8000/api
```

### Production

```bash
VITE_API_URL=https://api.yourdomain.com/api
```

### Mock Mode

Toggle mock data in service file:

```typescript
// In application.service.ts
const USE_MOCK = true; // Enable mock responses
```

---

## 📋 Validation Rules

| Field              | Rule                   | Example            |
| ------------------ | ---------------------- | ------------------ |
| `date_of_birth`    | Format: YYYY-MM-DD     | "1993-04-01"       |
| `email`            | Valid email format     | "user@example.com" |
| `phone_number`     | Format: +234XXXXXXXXXX | "+2348012345678"   |
| `nin`              | 11 digits              | "12345678901"      |
| `full_name`        | Non-empty string       | "John Doe"         |
| `state`            | Valid state name       | "Lagos"            |
| `local_government` | Valid LGA name         | "Ikeja"            |

---

## 🎯 Best Practices

1. **Always validate on client-side first** before API call
2. **Use loading states** to prevent double submissions
3. **Handle all error codes** with user-friendly messages
4. **Store application_id** for subsequent operations
5. **Show progress indicators** during file uploads
6. **Compress images** before upload to reduce size
7. **Verify file types** before allowing upload
8. **Clear sensitive data** from memory after submission

---

## 🔗 Related Endpoints

- `applicationService.verifyNIN(applicationId, 'certificate')` - Verify NIN
- `applicationService.initiatePayment(data)` - Start payment
- `applicationService.getMyApplications()` - View applications

---

## 📚 See Also

- [Full Implementation Details](./CERTIFICATE_APPLICATION_ENDPOINTS.md)
- [API Base Configuration](./src/services/api.ts)
- [Type Definitions](./src/Types/types.tsx)
- [Application Form Component](./src/pages/Application/applicationFormFunc.tsx)

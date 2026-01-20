# Certificate Application Flow - Updated Implementation

## ✅ Changes Made

The application flow has been **refactored** to send API requests at the appropriate step transitions instead of all at once during payment.

---

## 🔄 New Application Flow

### **Step 1 → Step 2 (Personal Info)**

**Trigger:** User clicks "Next" button on Step 1

**Action:** `handleStep1Next()` function executes

**API Call:**

```typescript
POST / certificates / applications / apply;
```

**Request Data:**

- Personal information (name, DOB, email, phone)
- Location (state, LGA, village)
- NIN number
- Files: profile_photo, nin_slip (optional)

**Response:**

- Returns `application_id` → Saved to state
- Shows success toast: "Application created successfully!"
- Moves to Step 2

**Error Handling:**

- ✅ 400/422: Validation errors
- ✅ 401: Session expired → Redirect to login
- ✅ 403: Permission denied
- ✅ 409: Duplicate application
- ✅ 429: Rate limit exceeded
- ✅ 500: Server error

---

### **Step 2 → Step 3 (Address Info)**

**Trigger:** User clicks "Next" button on Step 2

**Action:** `handleStep2Next()` function executes

**API Call:**

```typescript
PATCH / certificates / applications / apply / { application_id };
```

**Request Data:**

- Residential address
- Landmark
- Optional: extra_fields (dynamic fields)

**Response:**

- Returns fee information (`application_fee`, `verification_fee`)
- Saves `certificateAmount` to state
- Shows success toast: "Application updated successfully!"
- Moves to Step 3

**Error Handling:**

- ✅ 400/422: Validation errors
- ✅ 401: Session expired → Redirect to login
- ✅ 404: Application not found → Reset to Step 1
- ✅ 500: Server error

**Validation:**

- Checks if `applicationId` exists (from Step 1)
- If missing, shows error and resets to Step 1

---

### **Step 3 (Review & Payment)**

**Trigger:** User clicks "Proceed to Payment" button

**Action:** `handleProceedToPayment()` function executes

**API Calls (Sequential):**

#### 1. NIN Verification

```typescript
GET /verify-nin/{application_id}?type=certificate
```

**Response:**

- Verifies NIN information
- Shows success/warning toast

**Error Handling:**

- ✅ 400: Invalid verification request
- ✅ 401/403: Authentication failed
- ✅ 404: Application not found
- 🛑 **Blocks payment if verification fails**

#### 2. Payment Initialization

```typescript
POST / certificate / initiate - payment;
```

**Request Data:**

```json
{
  "payment_type": "certificate",
  "application_id": "{uuid}"
}
```

**Response:**

- Returns `authorization_url` (Paystack gateway)
- Returns `reference` → Saved to state
- Opens payment in new tab
- Moves to Step 4 (Review)

**Error Handling:**

- ✅ 401: Session expired
- ✅ 404: Application not found
- ✅ 500: Server error

---

## 📊 Comparison: Old vs New Flow

### **Old Flow (Before)**

```
User fills all steps → Clicks "Proceed to Payment" → ALL API calls happen at once:
  1. POST /certificates/applications/apply
  2. PATCH /certificates/applications/apply/{id}
  3. GET /verify-nin/{id}
  4. POST /certificate/initiate-payment
```

**Issues:**

- ❌ No feedback until final step
- ❌ If payment initialization fails, user loses all progress
- ❌ Cannot go back and edit after submission
- ❌ Long wait time at payment step

---

### **New Flow (After)**

```
Step 1: User fills personal info → Next → POST /apply → Gets application_id
       ↓
Step 2: User fills address → Next → PATCH /apply/{id} → Gets fees
       ↓
Step 3: User reviews → Proceed to Payment → Verify NIN + Initialize Payment
```

**Benefits:**

- ✅ Immediate feedback at each step
- ✅ Application saved progressively
- ✅ Can navigate back if needed (application already exists)
- ✅ Faster perceived performance
- ✅ Better error isolation
- ✅ Clearer user experience

---

## 🎯 User Experience Improvements

### **Progressive Saving**

- Application is saved after Step 1 (personal info)
- User has an `application_id` to track their progress
- Can resume later if needed

### **Clear Feedback**

- **Step 1:** "Application created successfully!"
- **Step 2:** "Application updated successfully!"
- **Step 3:** "NIN verified successfully!" + Payment window

### **Better Error Recovery**

- Errors show immediately at the relevant step
- User can fix issues without losing all progress
- Clear error messages for each step

### **Loading States**

- `isSubmitting` shown during Step 1 & 2 API calls
- `isInitializingPayment` shown during Step 3 operations
- User knows when to wait

---

## 🔧 Technical Implementation

### **State Management**

```typescript
const [applicationId, setApplicationId] = useState<string>("");
const [certificateAmount, setCertificateAmount] = useState<number>(0);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isInitializingPayment, setIsInitializingPayment] = useState(false);
```

### **Key Functions**

| Function                   | When Called                | API                                         | Next Step |
| -------------------------- | -------------------------- | ------------------------------------------- | --------- |
| `handleStep1Next()`        | Click "Next" on Step 1     | POST `/apply`                               | Step 2    |
| `handleStep2Next()`        | Click "Next" on Step 2     | PATCH `/apply/{id}`                         | Step 3    |
| `handleProceedToPayment()` | Click "Proceed to Payment" | GET `/verify-nin`, POST `/initiate-payment` | Step 4    |

### **Validation Flow**

```typescript
// Step 1: Before API call
- Validates all personal info fields
- Checks profile photo uploaded
- Checks NIN slip uploaded
- Validates state/LGA selection

// Step 2: Before API call
- Validates residential address
- Validates landmark
- Checks applicationId exists

// Step 3: Before API call
- Checks applicationId exists
- Verifies NIN first (blocking)
- Then initializes payment
```

---

## 📱 UI/UX Behavior

### **Navigation**

- User can use "Back" button to go to previous steps
- Application ID persists in state
- Form data remains populated

### **Error Display**

- Toast notifications for all errors
- Specific error messages per HTTP status code
- Auto-redirect to login on 401 errors

### **Loading Indicators**

- "Next" button shows loading spinner during `isSubmitting`
- "Proceed to Payment" button shows loading during `isInitializingPayment`
- Prevents double submissions

---

## 🧪 Testing Checklist

- [ ] Step 1: Submit personal info → Check application_id saved
- [ ] Step 1: Invalid data → Check error message displays
- [ ] Step 1: Duplicate NIN → Check 409 error handled
- [ ] Step 2: Update address → Check fee retrieved
- [ ] Step 2: Missing application_id → Check reset to Step 1
- [ ] Step 3: NIN verification fails → Check payment blocked
- [ ] Step 3: Payment initialization → Check new tab opens
- [ ] Error: Session expired → Check redirect to login
- [ ] Navigation: Back button → Check data persists

---

## 🚀 Next Steps

### **Potential Enhancements**

1. **Auto-save Draft**
   - Save form data to localStorage during Step 1
   - Restore on page refresh

2. **Progress Persistence**
   - Store `application_id` in localStorage
   - Allow user to resume application

3. **Back Button Safety**
   - Prevent re-submission if application exists
   - Show "Application already submitted" message

4. **Real-time Validation**
   - Validate NIN format before submission
   - Check email uniqueness before API call

---

## 📄 Files Modified

- **[applicationFormFunc.tsx](src/pages/Application/applicationFormFunc.tsx)**
  - `handleStep1Next()` - Lines 90-163 (API call added)
  - `handleStep2Next()` - Lines 165-241 (API call added)
  - `handleProceedToPayment()` - Lines 243-348 (simplified)

---

## ✅ Summary

The certificate application flow has been successfully refactored to provide:

- **Better user experience** with progressive feedback
- **Improved error handling** at each step
- **Faster perceived performance** with step-by-step API calls
- **Data persistence** via application_id
- **Clear loading states** for user awareness

All changes are **backward compatible** with the existing API endpoints and maintain the same data validation requirements.

# Security Specification - MNC Girls Hostel

## 1. Data Invariants
- A registration must have a valid name, phone, and email.
- A registration cannot be modified or deleted by the public once submitted.
- A complaint must belong to a room and have a category.
- Complaints are public-create but private-read.

## 2. The "Dirty Dozen" Payloads
1. **Oversized String Injection**: Trying to send a 1MB full name.
2. **Shadow Field Injection**: Adding `isVerified: true` to a registration.
3. **Identity Spoofing**: Trying to set `createdAt` to a past date instead of server time.
4. **Invalid Enum**: Setting `roomType` to "Penthouse".
5. **Unauthorized Read**: Anonymous user trying to list all registrations.
6. **Unauthorized Update**: Trying to change the `status` of a complaint from the public UI.
7. **Path Variable Poisoning**: Using a 1KB string as `registrationId`.
8. **Resource Exhaustion**: Sending an array of 1000 items in a field that should be a string.
9. **Missing Required Field**: Submitting registration without a phone number.
10. **Type Mismatch**: Sending a number for `fullName`.
11. **Status Shortcut**: Creating a complaint with status `resolved`.
12. **Immutable Field Change**: Trying to update `email` on an existing registration.

## 3. Test Runner (Conceptual)
The `firestore.rules.test.ts` would verify that:
- `allow create` passes with valid schema and server timestamp.
- `allow update, delete, list` fails for public users.
- `allow get` is restricted to admins (mocked).

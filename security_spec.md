# Security Specification - KigaliPulse

## Data Invariants
1. **User Identity**: A user profile must have a valid `uid` matching the Auth UID.
2. **Role Protection**: Users cannot self-assign `SuperAdmin` or `Business Admin` roles.
3. **Event Ownership**: An event must have an `organizerId` matching the creator's UID.
4. **Admin Override**: `SuperAdmin` users can manage all events.
5. **Private Data**: User profile details (email, phone) are restricted to the owner or SuperAdmin.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Role Spoofing**: Creating a user profile with `role: "SuperAdmin"`.
2. **Identity Theft**: Creating/Updating a user profile with a `uid` that doesn't match `request.auth.uid`.
3. **Unauthorized Event Delete**: A standard user deleting someone else's event.
4. **Admin Field Injection**: A user trying to update their own role.
5. **PII Leak**: A user trying to read another user's profile PII.
6. **Orphaned Event**: Creating an event without a valid `organizerId`.
7. **Timestamp Spoofing**: Providing a client-side `createdAt` that doesn't match `request.time`.
8. **Malicious ID**: Creating a document with a 2KB junk string ID.
9. **Spam Creation**: Creating an event with a 1MB title.
10. **Status Shortcut**: A standard user publishing an event without admin approval (if moderation is enforced).
11. **Shadow Field**: Adding `isVerified: true` to a user profile during an update.
12. **Recursive Attack**: Querying the entire `users` collection without a UID filter.

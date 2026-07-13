# Care Well Medical Centre — Forms Architecture

## Purpose

Define the contact form architecture including validation, submission flow, security, accessibility, and error handling. This is the only user input surface at launch.

## Responsibilities

- Contact form on `/contact` page.
- Client-side UX validation via React Hook Form + Zod.
- Server-side validation and submission via Server Action or API route.
- Spam protection without degrading accessibility.

## Architecture

```
Contact Page (Server Component)
  └── ContactForm (Client Component)
        ├── React Hook Form (state, field registration)
        ├── Zod schema (client validation)
        ├── onSubmit → Server Action
        │     ├── Zod schema (server validation)
        │     ├── Honeypot check
        │     ├── Rate limit check (future)
        │     └── External submission (Formspree / email API)
        └── Success / Error UI
```

---

## Form Fields

| Field | Name | Type | Required | Validation |
|-------|------|------|----------|------------|
| Full Name | `name` | text | Yes | Min 2 chars, max 100 |
| Email | `email` | email | Yes | Valid email format |
| Phone | `phone` | tel | No | Optional; valid phone pattern |
| Subject | `subject` | text | Yes | Min 3 chars, max 150 |
| Message | `message` | textarea | Yes | Min 10 chars, max 2000 |
| Honeypot | `website` | text (hidden) | No | Must be empty |

---

## Zod Schema Contract

### Location

`lib/validations/contact-form.ts`

```typescript
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine(
    (val) => !val || /^[\d\s\-\+\(\)]{7,20}$/.test(val),
    'Please enter a valid phone number'
  ),
  subject: z.string().min(3, 'Subject is required').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().max(0, 'Bot detected'), // honeypot
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

---

## Component Structure

```
components/features/contact/
├── ContactForm.tsx          # Client Component — form UI
├── ContactFormFields.tsx    # Field group (optional split)
└── ContactFormSuccess.tsx   # Success state message
```

### ContactForm Props

```typescript
interface ContactFormProps {
  className?: string;
}
```

---

## Server Action Contract

### Location

`lib/actions/submit-contact-form.ts`

```typescript
'use server';

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }>;
```

### Server Action Flow

1. Parse and validate with `contactFormSchema`.
2. Reject if honeypot `website` field is non-empty (return generic success to avoid bot feedback).
3. Submit to external service (`CONTACT_FORM_ENDPOINT` env var).
4. Return `{ success: true }` or `{ success: false, error: 'message' }`.
5. Never log full message content in production.

---

## External Submission

Use environment variable `CONTACT_FORM_ENDPOINT` pointing to:

- Formspree, Getform, Basin, or similar form backend.
- Client's existing WordPress contact form endpoint (if available).
- Email API (Resend, SendGrid) via server action.

**Do not** store submissions in a custom database.

---

## UI States

| State | UI |
|-------|-----|
| Default | Empty form with labels |
| Validating | Inline field errors below inputs |
| Submitting | Disabled fields, button loading spinner |
| Success | Replace form with success message + CTA to home |
| Error | Inline banner above form with retry option |

---

## Accessibility Requirements

- Every input has visible `<label>` associated via `htmlFor`/`id`.
- Error messages linked via `aria-describedby`.
- Invalid fields: `aria-invalid="true"`.
- Submit button: `aria-busy="true"` during submission.
- Focus first error field on validation failure.
- Success message announced via `aria-live="polite"` region.

---

## Security Requirements

- Server-side validation mandatory (client validation is UX only).
- Honeypot field hidden via CSS (`sr-only` positioning, `tabIndex={-1}`, `aria-hidden="true"`).
- Rate limiting via Cloudflare or Vercel middleware (future).
- No PII in URL query parameters.
- CSRF: Server Actions have built-in protection in Next.js.

---

## Error Messages

| Error | User Message |
|-------|-------------|
| Validation failure | Field-specific Zod messages |
| Submission failure | "We couldn't send your message. Please try again or call us at {phone}." |
| Rate limited | "Too many requests. Please wait a moment and try again." |

---

## Do's

- Use Shadcn `Input`, `Textarea`, `Button` components.
- Display business phone as fallback on submission failure.
- Reset form after successful submission.
- Test with keyboard-only navigation.

## Don'ts

- Do not use placeholder as sole label.
- Do not store form data in localStorage.
- Do not expose submission endpoint URL client-side.
- Do not use CAPTCHA that blocks accessibility (prefer honeypot).

## Future Expansion

- Appointment booking form (external widget).
- File upload for medical records (out of scope — legal review required).
- Multi-step form for service inquiries.

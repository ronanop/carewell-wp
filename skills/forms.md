# Forms Skill — Care Well Medical Centre

## When to Use

Apply when implementing contact forms, validation schemas, server actions, or form-related UI.

## Core Rules

- Use **React Hook Form** for form state + **Zod** for validation.
- Validate on **both client and server** — server is authoritative.
- Use **Server Actions** for submission — no custom API database.
- Include **honeypot field** for spam protection.
- Use Shadcn `Input`, `Textarea`, `Button` components.

## Schema Location

`lib/validations/contact-form.ts`

## Server Action Location

`lib/actions/submit-contact-form.ts`

## Required Fields

`name`, `email`, `subject`, `message` — optional: `phone`, honeypot: `website`

## UI States

Default → Validating → Submitting → Success | Error

## Accessibility

- Visible `<label>` on every input
- `aria-invalid` + `aria-describedby` on errors
- `aria-live="polite"` on success message
- Focus first error on validation failure

## Do's

- Show business phone as fallback on submission failure.
- Submit to `CONTACT_FORM_ENDPOINT` env var.
- Disable form during submission.

## Don'ts

- Do not store submissions in a database.
- Do not use placeholder as sole label.
- Do not expose submission endpoint client-side.
- Do not trust client validation alone.

## Reference

Read `docs/31_FORMS_ARCHITECTURE.md` and `docs/23_SECURITY_GUIDE.md`.

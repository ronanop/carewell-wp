"use client";

import { Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClassName = cn(
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5",
  "text-body text-foreground placeholder:text-muted-foreground",
  "transition-colors focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2"
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form — client-side UI only (validation + success state).
 * WordPress / forms plugin wiring comes later.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function clearFeedback() {
    setSuccess(false);
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    const digits = phone.replace(/\D/g, "");

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.trim() && !/^\d{10}$/.test(digits)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!trimmedSubject || trimmedSubject.length < 3) {
      setError("Please enter a subject.");
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setError("Please enter a message (at least 10 characters).");
      return;
    }

    setError(null);
    setSuccess(true);
    // TODO: Submit to WordPress / forms endpoint when wired.
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-white p-6",
        "shadow-[0_8px_30px_rgb(10_37_64/0.08)] sm:p-8"
      )}
    >
      <h2
        id="contact-form-heading"
        className="font-heading text-h3 font-semibold text-[#0A2540]"
      >
        Drop Us a Message
      </h2>
      <p className="mt-2 text-body text-muted-foreground">
        Send us your inquiry and our team will get back to you shortly.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-5"
        aria-labelledby="contact-form-heading"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="block text-small font-medium text-[#0A2540]"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFeedback();
            }}
            className={fieldClassName}
            aria-invalid={Boolean(error && name.trim().length < 2)}
            aria-describedby={error ? "contact-form-error" : undefined}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-small font-medium text-[#0A2540]"
          >
            Your Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFeedback();
            }}
            className={fieldClassName}
            aria-invalid={Boolean(
              error && !EMAIL_PATTERN.test(email.trim())
            )}
            aria-describedby={error ? "contact-form-error" : undefined}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="block text-small font-medium text-[#0A2540]"
          >
            Phone Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearFeedback();
            }}
            className={fieldClassName}
            aria-invalid={Boolean(
              error &&
                phone.trim() &&
                !/^\d{10}$/.test(phone.replace(/\D/g, ""))
            )}
            aria-describedby={error ? "contact-form-error" : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-small font-medium text-[#0A2540]"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              clearFeedback();
            }}
            className={fieldClassName}
            aria-invalid={Boolean(error && subject.trim().length < 3)}
            aria-describedby={error ? "contact-form-error" : undefined}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-small font-medium text-[#0A2540]"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clearFeedback();
            }}
            className={cn(fieldClassName, "min-h-[8.5rem] resize-y")}
            aria-invalid={Boolean(error && message.trim().length < 10)}
            aria-describedby={error ? "contact-form-error" : undefined}
            required
          />
        </div>

        {error ? (
          <p
            id="contact-form-error"
            role="alert"
            className="text-small text-destructive"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p role="status" className="text-small text-success-600">
            Thank you — your message has been received. We&apos;ll be in touch
            shortly.
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
        >
          Send Message
        </Button>

        <p className="flex items-start justify-center gap-2 text-center text-small text-muted-foreground">
          <Lock
            className="mt-0.5 size-3.5 shrink-0 text-[#0A2540]"
            aria-hidden
          />
          <span>Your details stay private. We never share your information.</span>
        </p>
      </form>
    </div>
  );
}

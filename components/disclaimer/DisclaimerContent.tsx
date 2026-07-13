import {
  disclaimerAgreement,
  disclaimerContact,
  disclaimerIntro,
  disclaimerNote,
  disclaimerSections,
} from "@/components/disclaimer/content";

export function DisclaimerContent() {
  return (
    <article className="bg-background">
      <div className="container-content section-padding">
        <header className="mx-auto max-w-3xl">
          <p className="text-label uppercase text-[#3B82F6]">Legal</p>
          <h1 className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]">
            Disclaimer
          </h1>
          <p className="mt-5 text-body leading-relaxed text-muted-foreground">
            {disclaimerIntro}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {disclaimerSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="font-heading text-h3 font-semibold text-[#0A2540]"
              >
                <span className="text-[#3B82F6]">{section.number}. </span>
                {section.title}
              </h2>
              <p className="mt-4 text-body leading-relaxed text-muted-foreground">
                {section.text}
              </p>
            </section>
          ))}

          <div className="space-y-4 border-t border-border/60 pt-8 text-body leading-relaxed text-muted-foreground">
            <p>{disclaimerAgreement}</p>
            <p>{disclaimerContact}</p>
          </div>

          <footer className="border-t border-border/60 pt-8">
            <p className="text-small leading-relaxed text-muted-foreground">
              <span className="font-medium text-[#0A2540]">Note: </span>
              {disclaimerNote}
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}

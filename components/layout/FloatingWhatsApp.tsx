import Image from "next/image";

const WHATSAPP_URL =
  "https://wa.me/919667977499?text=Hello%20Care%20Well%20Medical%20Centre";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Care Well Medical Centre on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex size-16 items-center justify-center rounded-full bg-white p-1 shadow-[0_10px_28px_rgba(10,37,64,0.22)] ring-1 ring-[#25D366]/25 transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-[0_14px_34px_rgba(10,37,64,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <Image
        src="/images/whatsapp.gif"
        alt=""
        width={64}
        height={64}
        unoptimized
        className="size-full rounded-full object-contain"
        aria-hidden
      />
    </a>
  );
}

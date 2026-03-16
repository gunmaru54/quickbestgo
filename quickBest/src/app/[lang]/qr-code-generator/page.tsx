import { Metadata } from 'next';
import QRCodeGenerator from '@/components/tools/QRCodeGenerator';
import { getDictionary, Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  
  return {
    title: dict?.qr_code_generator?.meta_title || "QR Code Generator - QuickBest",
    description: dict?.qr_code_generator?.meta_description || "Create high-quality QR codes for any text, URL, or contact information.",
    alternates: {
      languages: {
        'ko': `/ko/qr-code-generator`,
        'en': `/en/qr-code-generator`,
        'es': `/es/qr-code-generator`,
        'pt': `/pt/qr-code-generator`,
        'ja': `/ja/qr-code-generator`,
      }
    }
  };
}

export default async function QRCodeGeneratorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  
  const qrDict = dict?.qr_code_generator || {
    title: "QR Code Generator",
    about_title: "How to use the QR Code Generator?",
    about_p1: "",
    about_p2: "",
    about_p3: "",
    label_enter_text: "Enter Text or URL",
    placeholder_text: "https://example.com",
    btn_download: "Download QR Code",
    label_qr_code: "Your QR Code"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {qrDict.title}
        </h1>
        
        <div className="mb-12">
          <QRCodeGenerator dict={qrDict} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{qrDict.about_title}</h2>
          <p>{qrDict.about_p1}</p>
          <p>{qrDict.about_p2}</p>
          <p>{qrDict.about_p3}</p>
        </article>
      </div>
    </div>
  );
}

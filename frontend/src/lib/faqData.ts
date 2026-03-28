type FAQEntry = {
  question: string;
  answer: string;
};

export const compressImageFAQs: FAQEntry[] = [
  {
    question: "How do I compress an image for WhatsApp?",
    answer:
      "Upload your image, select the WhatsApp preset (reduces size to under 1MB), and click Compress. The file processes entirely in your browser - nothing is uploaded to any server. Download the compressed image and send it on WhatsApp directly.",
  },
  {
    question: "Will my image lose quality after compression?",
    answer:
      "At quality settings of 75-85%, the difference is invisible to the human eye for most photos. You can preview the compressed image before downloading. For government forms where you need under 200KB, a quality of 55-65% is usually acceptable.",
  },
  {
    question: "What is the maximum file size I can compress?",
    answer:
      "Up to 50MB per image. Since all processing happens in your browser, there are no server-side limits. However, very large files (above 20MB) may take a few seconds longer depending on your device speed.",
  },
  {
    question: "Which image formats can I compress?",
    answer:
      "JPG, JPEG, PNG, WebP, AVIF, and HEIC/HEIF are all supported. For HEIC files from iPhones, the tool automatically converts and compresses in one step.",
  },
  {
    question: "Is my image safe? Does it get uploaded to your server?",
    answer:
      "Your image never leaves your device. All compression happens using JavaScript directly in your browser. No file is sent to any server. This makes the tool completely private - safe for ID photos, documents, and personal images.",
  },
];

export const resizePassportPhotoFAQs: FAQEntry[] = [
  {
    question: "What is the standard passport photo size?",
    answer:
      "The standard passport photo size is 35mm x 45mm, which equals 413 x 531 pixels at 300 DPI. The photo must have a white background, and your face should cover 70-80% of the frame. This tool resizes your image to these exact dimensions automatically.",
  },
  {
    question: "Does the resized photo meet Ministry of External Affairs requirements?",
    answer:
      "Yes. This tool resizes to the 35x45mm standard specified by the Ministry of External Affairs (MEA) for passports. The output is 413x531 pixels at 300 DPI - accepted by Passport Seva Kendra (PSK) and online passport application portals.",
  },
  {
    question: "What background colour should a passport photo have?",
    answer:
      "Passport photos require a plain white background. If your photo has a different background, you should use a background removal tool first, then resize here. The photo should show a neutral facial expression with both eyes open.",
  },
  {
    question: "Can I use this tool for visa photos too?",
    answer:
      "Yes. The tool supports multiple photo standards. Use the Passport preset (35x45mm) for passports, or the 2x2 inch preset for US visa photos, UK visa photos, and other international applications that require the 51x51mm standard.",
  },
  {
    question: "What file size should a passport photo be for online upload?",
    answer:
      "Most government portals (including Passport Seva) require the photo to be between 10KB and 500KB in JPEG format. After resizing, if the file is too large, use the Compress Image tool to reduce it to under 200KB while keeping the correct dimensions.",
  },
];

export const resizeAadharPhotoFAQs: FAQEntry[] = [
  {
    question: "What is the correct photo size for Aadhaar card?",
    answer:
      "The Aadhaar card photo standard is 35mm x 35mm, which is 413 x 413 pixels at 300 DPI. This tool resizes your photo to exactly these dimensions. The file size should typically be under 200KB in JPEG format for UIDAI portal uploads.",
  },
  {
    question: "What is the maximum file size for Aadhaar photo upload on the UIDAI portal?",
    answer:
      "The UIDAI portal accepts JPEG photos up to 200KB for Aadhaar updates. After resizing your photo to 35x35mm using this tool, use the Resize to 200KB tool if needed to bring the file size within the limit before uploading.",
  },
  {
    question: "Can I update my Aadhaar card photo online?",
    answer:
      "Yes. You can update your Aadhaar photo online through the myAadhaar portal (myaadhaar.uidai.gov.in) or by visiting an Aadhaar enrolment centre. For online updates, the photo must be JPEG format, 35x35mm, and under 200KB.",
  },
  {
    question: "Does my photo need a white background for Aadhaar?",
    answer:
      "Yes. UIDAI requires a plain white or light background for Aadhaar photos. The face should be clearly visible, centred in the frame, with a neutral expression. Avoid sunglasses, heavy jewellery, or hats in the photo.",
  },
  {
    question: "Is this tool different from the passport photo resizer?",
    answer:
      "Yes. Passport photos are 35x45mm (portrait orientation), while Aadhaar photos are 35x35mm (square). Using the wrong size may cause your application to be rejected. This tool uses the correct 35x35mm Aadhaar dimensions automatically.",
  },
];

export const jpgToPdfFAQs: FAQEntry[] = [
  {
    question: "How do I convert a JPG photo to PDF for a government form?",
    answer:
      "Upload your JPG photo, click Convert to PDF, and download the PDF. The tool combines your images into a single PDF file, which is the accepted format for most government portals including UPSC, SSC, bank exams, and state government applications.",
  },
  {
    question: "Can I combine multiple JPG images into one PDF?",
    answer:
      "Yes. You can upload multiple JPG images and they will be merged into a single PDF - one image per page. This is useful for submitting multiple documents (photo + signature + certificates) as a single PDF file.",
  },
  {
    question: "Will the PDF have a watermark?",
    answer:
      "No watermark at all. The converted PDF is clean and ready to submit. This tool is completely free and does not add any watermarks, logos, or branding to your output file.",
  },
  {
    question: "What is the maximum JPG file size I can convert to PDF?",
    answer:
      "Up to 50MB per image. All conversion happens in your browser - no upload to any server, so there are no server-side file size restrictions. Larger images may take a few extra seconds to process.",
  },
  {
    question: "Does JPG to PDF work on mobile phones?",
    answer:
      "Yes. The tool works on Android and iPhone browsers including Chrome, Safari, and Firefox. You can upload directly from your phone gallery, convert to PDF, and download - no app installation needed.",
  },
];

export const pngToWebpFAQs: FAQEntry[] = [
  {
    question: "What is WebP and why should I convert PNG to WebP?",
    answer:
      "WebP is a modern image format developed by Google that produces files 25-35% smaller than PNG at the same visual quality. Smaller images mean your website loads faster, which improves Google PageSpeed scores and reduces mobile data usage - important for users on 4G.",
  },
  {
    question: "Will I lose image quality when converting PNG to WebP?",
    answer:
      "At 85% quality setting, WebP images look virtually identical to the original PNG but are significantly smaller. PNG files with transparent backgrounds are fully supported - transparency is preserved in the WebP output.",
  },
  {
    question: "Do all browsers support WebP images?",
    answer:
      "Yes. WebP is supported by all modern browsers including Chrome, Firefox, Safari (iOS 14+), Edge, and Samsung Internet. Over 97% of global browser users can view WebP images. For very old browsers, keep a JPG fallback.",
  },
  {
    question: "Can I convert PNG to WebP on mobile?",
    answer:
      "Yes. The conversion runs entirely in your browser using JavaScript - no file upload needed. It works on Android Chrome, iPhone Safari, and all modern mobile browsers. The converted WebP file downloads directly to your device.",
  },
  {
    question: "How much smaller will my PNG be after converting to WebP?",
    answer:
      "Typical savings are 25-40% smaller file size. A 500KB PNG often becomes 300-375KB as WebP. Photos with lots of detail compress particularly well. You can see the before and after file size on screen immediately after conversion.",
  },
];

export const resizeTo200kbFAQs: FAQEntry[] = [
  {
    question: "Why do government forms require images under 200KB?",
    answer:
      "Government portals like UPSC, SSC CGL, IBPS, railway recruitment (RRB), and state government job portals set file size limits to reduce server storage costs and ensure fast uploads on slow internet connections. The most common limits are 20KB, 50KB, 100KB, and 200KB for photos and signatures.",
  },
  {
    question: "Which government portals require images under 200KB?",
    answer:
      "Common portals with file size limits include UPSC (photo 300KB, signature 300KB), SSC (photo 50KB, signature 20KB), IBPS (photo 50KB, signature 20KB), RRB NTPC (photo 40KB), TNPSC, MPSC, and most state PSC portals. Always check the specific size requirement on each portal before uploading.",
  },
  {
    question: "Can I set a custom target file size other than 200KB?",
    answer:
      "Yes. You can enter any target size - 20KB for signatures, 50KB for photos, 100KB or 200KB for documents. The tool uses a smart compression algorithm that automatically finds the right quality setting to hit your target size without going over.",
  },
  {
    question: "Will my photo still look acceptable after being compressed to 200KB?",
    answer:
      "For a standard passport-size photo (413x531px), 200KB gives excellent quality - the image will look completely normal to human eyes. Even at 50KB, a passport-size photo is still clearly legible for government identity verification purposes.",
  },
  {
    question: "Does reducing to 200KB change the image dimensions?",
    answer:
      "No. This tool only changes the file size through compression - the pixel dimensions stay exactly the same. If you also need to resize dimensions (for example, to 35x45mm passport size), use the Passport Photo Resize tool first, then compress to your target file size here.",
  },
];

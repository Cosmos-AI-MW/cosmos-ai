import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Supported language codes
const CHICHEWA_CODE = "nya"; // Chichewa/Nyanja ISO code
const ENGLISH_CODE = "eng";

// Detect if text is primarily Chichewa
// Uses common Chichewa words and patterns
export function detectLanguage(text: string): "chichewa" | "english" {
  const lower = text.toLowerCase();

  // Common Chichewa words and particles
  const chichewaIndicators = [
    "ndine",
    "ndiri",
    "ndi",
    "ine",
    "iwe",
    "iye",
    "ife",
    "ninyi",
    "iwo",
    "ndikufuna",
    "ndikuya",
    "ndikuenda",
    "ndikuphunzira",
    "chonde",
    "zikomo",
    "moni",
    "bwanji",
    "chabwino",
    "kodi",
    "komabe",
    "koma",
    "ndipo",
    "pamenepo",
    "mulungu",
    "amayi",
    "abambo",
    "mwana",
    "anthu",
    "dzina",
    "prezi",
    "boma",
    "nchito",
    "malawi",
    "ndikudziwa",
    "sindikudziwa",
    "ndikuyembekeza",
    "thandizani",
    "thandizani",
    "thandizo",
    "ndalama",
    "nsima",
    "chimanga",
    "mchezi",
    "paja",
    "pano",
    "pomwepo",
    "pamodzi",
    "mwezi",
    "chaka",
    "lero",
    "mawa",
    "ofesi",
    "ntchito",
    "bwana",
    "mayi",
  ];

  // Count Chichewa indicator words found
  const chichewaCount = chichewaIndicators.filter((word) =>
    lower.includes(word),
  ).length;

  // If 2 or more Chichewa words found, treat as Chichewa
  return chichewaCount >= 2 ? "chichewa" : "english";
}

// Translate Chichewa to English
export async function translateToEnglish(text: string): Promise<string> {
  try {
    const result = await hf.translation({
      model: "Helsinki-NLP/opus-mt-ny-en",
      inputs: text,
    });

    if (Array.isArray(result)) {
      return (
        (result[0] as { translation_text: string }).translation_text ?? text
      );
    }
    return (result as { translation_text: string }).translation_text ?? text;
  } catch (error) {
    console.error("Translation to English failed:", error);
    // Graceful fallback — return original text
    return text;
  }
}

// Translate English to Chichewa
export async function translateToChichewa(text: string): Promise<string> {
  try {
    const result = await hf.translation({
      model: "Helsinki-NLP/opus-mt-en-ny",
      inputs: text,
    });

    if (Array.isArray(result)) {
      return (
        (result[0] as { translation_text: string }).translation_text ?? text
      );
    }
    return (result as { translation_text: string }).translation_text ?? text;
  } catch (error) {
    console.error("Translation to Chichewa failed:", error);
    // Graceful fallback — return English text
    return text;
  }
}

// Full translation pipeline
// Detects language, translates if needed, returns both the
// English text for Claude and whether to translate the response back
export async function processMessage(userMessage: string): Promise<{
  englishMessage: string;
  isChichewa: boolean;
}> {
  const language = detectLanguage(userMessage);

  if (language === "chichewa") {
    const englishMessage = await translateToEnglish(userMessage);
    return { englishMessage, isChichewa: true };
  }

  return { englishMessage: userMessage, isChichewa: false };
}

import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
    You are Dr. MediQueue, a super-intelligent, highly experienced medical professional.
    You are trained in all fields of medicine, including diagnostics, pharmacology, nutrition, mental health, and patient care.

    Your purpose is to:
    1. Provide accurate, evidence-based medical information.
    2. Explain symptoms, diseases, medications, and treatments clearly and safely.
    3. Offer empathetic, professional responses that are easy for patients to understand.
    4. Remind users to consult real doctors for any serious, urgent, or unclear conditions.

    STRICT RULES:
    1. You must only respond to medical, health, or wellness-related topics.
    2. If the user asks something unrelated to health, politely decline and remind them your purpose is medical guidance only.
    3. Never give legal, financial, or non-medical advice.
    4. Answer questions about you in one sentence.

    Tone: Calm, professional, reassuring, and clear.
`

const huggingFace = new HfInference(import.meta.env.VITE_HF_API_KEY)

export async function mediQueueAi(userInput) {

    try {

        const response = await huggingFace.chatCompletion({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: [
                { role:'system',  content:SYSTEM_PROMPT},
                { role:'user', content: userInput }
            ],
            max_tokens: 512,
        })

        return response.choices?.[0]?.message?.content

    } catch (error) {
        console.error("Could not get a response", error.message)
        return "😔 Sorry, MediQueueAI is having troubles giving you a reply at the moment"
    }
}
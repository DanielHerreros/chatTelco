import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const createExamChain = (groq_api_key: string) => {
  const llm = new ChatGroq({
    apiKey: groq_api_key,
    model: "llama-3.1-8b-instant",
  });

  const template = `Responde a la siguiente pregunta del cliente sobre los servicios de la compañía: {company}. 
  Si la pregunta es frecuente, proporciona información detallada. 
  Si es una pregunta nueva, intenta dar la mejor respuesta posible.

  Pregunta del cliente: {customerQuestion}
  Compañía: {company}

  Respuesta (en Markdown):
  `;
// ... existing code ...;

  const chatPrompt = ChatPromptTemplate.fromMessages<{ type: string, format: string, difficulty: string, level: string }>([
    ["system", template],
    ["user", "Genera una preguntas frecuentes sobre los servicios de la compañía seleccionada: {company} usando Markdown"],
  ]);

  const parser = new StringOutputParser();

  return chatPrompt.pipe(llm).pipe(parser);
};


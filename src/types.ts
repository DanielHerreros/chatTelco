export interface QuestionRequest {
    type: string; // Tipo de pregunta (frecuente, nueva, etc.)
    format: string; // Formato de la respuesta (Markdown, texto, etc.)
    difficulty: string; // Dificultad de la pregunta (opcional)
    level: string; // Nivel de servicio (opcional)
    company: string; // Compañía seleccionada por el usuario
    customerQuestion: string; // Pregunta del cliente
}

export interface EvaluateRequest {
    question: string;
    answer: string;
    format: string;
    difficulty: string;
    level: string;
}

export interface QuestionResponse {
    question: string;
}

export interface EvaluationResponse {
    evaluation: string;
}


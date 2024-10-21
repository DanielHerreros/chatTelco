import './style.css';
import { createExamChain } from './chains/examChain';
import { createEvaluationChain } from './chains/evaluationChain';
import { marked } from 'marked'; // Importar la biblioteca marked

// Elementos del DOM
const openApiKeyDialogBtn = document.getElementById('openApiKeyDialogBtn') as HTMLAnchorElement;
const apiKeyDialog = document.getElementById('apiKeyDialog') as HTMLDialogElement;
const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
const setApiKeyBtn = document.getElementById('setApiKeyBtn') as HTMLButtonElement;
const clearApiKeyBtn = document.getElementById('clearApiKeyBtn') as HTMLButtonElement;
const closeDialogBtn = document.getElementById('closeDialogBtn') as HTMLButtonElement;
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const evaluateBtn = document.getElementById('evaluateBtn') as HTMLButtonElement;
const questionDisplay = document.getElementById('questionDisplay') as HTMLDivElement;
const evaluationDisplay = document.getElementById('evaluationDisplay') as HTMLDivElement;
const questionType = document.getElementById('questionType') as HTMLSelectElement;
const questionFormat = document.getElementById('questionFormat') as HTMLSelectElement;
const difficultyLevel = document.getElementById('difficultyLevel') as HTMLSelectElement;
const educationLevel = document.getElementById('educationLevel') as HTMLSelectElement;
const answerInput = document.getElementById('answerInput') as HTMLTextAreaElement; // Campo para la pregunta del cliente
const companySelect = document.getElementById('companySelect') as HTMLSelectElement; // Selección de compañía

// Variables globales
let groqApiKey = localStorage.getItem('groqApiKey') || '';

// Funciones para manejar la modal
function openModal() {
    apiKeyDialog.showModal();
}

function closeModal() {
    apiKeyDialog.close();
}

// Event listeners para la modal
openApiKeyDialogBtn.addEventListener('click', openModal);
closeDialogBtn.addEventListener('click', closeModal);
apiKeyDialog.addEventListener('click', (event) => {
    const rect = apiKeyDialog.getBoundingClientRect();
    const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
        && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        apiKeyDialog.close();
    }
});

// Event listeners para manejar la API Key
setApiKeyBtn.addEventListener('click', () => {
    groqApiKey = apiKeyInput.value;
    localStorage.setItem('groqApiKey', groqApiKey);
    alert('API Key establecida correctamente.');
    closeModal();
});

clearApiKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('groqApiKey');
    groqApiKey = '';
    apiKeyInput.value = '';
    alert('API Key limpiada.');
});

// Event listener para manejar la selección de la compañía
companySelect.addEventListener('change', async () => {
    const selectedCompany = companySelect.value;
    const questionData = {
        company: selectedCompany,
        customerQuestion: '', // Inicialmente vacío
        type: questionType.value,
        format: questionFormat.value,
        difficulty: difficultyLevel.value,
        level: educationLevel.value,
    };
    
    // Generar preguntas relevantes para la compañía seleccionada
    const examChain = createExamChain(groqApiKey);
    const questionResponse = await examChain.invoke(questionData);
    const responseString = await questionResponse; // Asegurarse de que sea un string
    questionDisplay.innerHTML = await marked(responseString); // Aplicar marked aquí
});

// Modificar la función generateQuestion para incluir la pregunta del cliente
async function generateQuestion() {
    const customerQuestion = answerInput.value; // Obtener la pregunta del cliente
    const questionData = {
        company: companySelect.value, // Compañía seleccionada
        customerQuestion: customerQuestion, // Pregunta del cliente
        type: 'frequent', // Tipo de pregunta, puedes ajustarlo según sea necesario
        format: 'markdown', // Formato de respuesta
        difficulty: 'easy', // Dificultad, ajusta según sea necesario
        level: 'basic', // Nivel de servicio, ajusta según sea necesario
    };
    
    const examChain = createExamChain(groqApiKey);
    const questionResponse = await examChain.invoke(questionData);
    const responseString = await questionResponse; // Asegurarse de que sea un string
    questionDisplay.innerHTML = await marked(responseString); // Aplicar marked aquí
}

async function evaluateAnswer() {
    const evaluationData = {
        question: questionDisplay.innerText,
        answer: answerInput.value,
        format: questionFormat.value,
        difficulty: difficultyLevel.value,
        level: educationLevel.value,
        company: 'Compañía seleccionada', // Añadir la compañía seleccionada
    };
    const evaluationChain = createEvaluationChain(groqApiKey);

    const evaluationResponse = await evaluationChain.invoke(evaluationData);
    const responseString = await evaluationResponse; // Asegurarse de que sea un string
    evaluationDisplay.innerHTML = await marked(responseString); // Aplicar marked aquí
}

// Event listeners para generar pregunta y evaluar respuesta
generateBtn.addEventListener('click', generateQuestion);
evaluateBtn.addEventListener('click', evaluateAnswer);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (!apiKeyDialog) {
        console.error('No se pudo encontrar el elemento del diálogo');
    } else {
        console.log('Diálogo inicializado correctamente');
    }
});

console.log('Script main.ts cargado');

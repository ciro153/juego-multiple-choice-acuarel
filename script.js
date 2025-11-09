// --- 🎨 CONFIGURACIÓN CENTRAL: LISTA DE PREGUNTAS ---
const QUIZ_DATA = [
    {
        question: "¿Qué aglutinante principal se utiliza tradicionalmente para dar cohesión a los pigmentos de la acuarela?",
        correct_answer: "Goma arábiga",
        options: ["Aceite de linaza", "Cera de abeja", "Goma arábiga", "Caseína"]
    },
    {
        question: "¿Cuál es la función principal de la 'tempera' (gouache) en comparación con la acuarela simple?",
        correct_answer: "Ser opaca y cubriente",
        options: ["Secar más rápido", "Ser totalmente transparente", "Ser opaca y cubriente", "Necesitar aguarrás"]
    },
    {
        question: "¿Qué herramienta es esencial para crear reservas de blanco en la acuarela?",
        correct_answer: "Líquido de enmascarar",
        options: ["Borrador de grafito", "Goma maleable", "Líquido de enmascarar", "Cinta adhesiva"]
    },
    {
        question: "¿Qué color se obtiene al mezclar azul y amarillo?",
        correct_answer: "Verde",
        options: ["Púrpura", "Naranja", "Verde", "Marrón"]
    },
    {
        question: "¿Qué tipo de pincel es ideal para la técnica de 'lavado' (grandes áreas de color) en acuarela?",
        correct_answer: "Pincel plano grande",
        options: ["Pincel de abanico", "Pincel plano grande", "Pincel fino de detalle", "Esponja vegetal"]
    },
    {
        question: "¿Cuál es el pigmento blanco más común y utilizado en casi todas las pinturas, incluyendo témperas?",
        correct_answer: "Dióxido de titanio",
        options: ["Dióxido de titanio", "Óxido de hierro", "Negro de humo", "Sulfato de bario"]
    }
];
// ---------------------------------------------------

// --- CONFIGURACIÓN DEL PREMIO ---
const CODIGO_DESCUENTO = "PINTURA-15"; // 👈 ¡PERSONALIZA ESTO!
const PORCENTAJE_DESCUENTO = "15%"; 
const ENLACE_CATALOGO = "https://www.tuempresa.com/catalogo"; // 👈 ¡PERSONALIZA ESTE ENLACE REAL!
// ---------------------------------

const LAST_PLAY_KEY = 'lastPlayDate';
const resultMessage = document.getElementById('resultMessage');
const quizContainer = document.getElementById('quiz-container');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function cleanAnswer(answer) {
    if (!answer) return "";
    return answer.toLowerCase().trim().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/,/g, '');
}

function checkPlayStatus() {
    const lastPlay = localStorage.getItem(LAST_PLAY_KEY);
    const today = new Date().toDateString();

    if (lastPlay === today) {
        showResult(`❌ Límite diario alcanzado. Ya respondiste hoy. Vuelve mañana para un nuevo acertijo.`, 'failure');
        return;
    }
    
    loadQuiz();
}

function loadQuiz() {
    const randomQuestionIndex = Math.floor(Math.random() * QUIZ_DATA.length);
    const quizItem = QUIZ_DATA[randomQuestionIndex];
    
    const shuffledOptions = shuffleArray([...quizItem.options]);

    let optionsHtml = shuffledOptions.map(option => `
        <label>
            <input type="radio" name="answer" value="${option}">
            ${option}
        </label>
    `).join('<br>');

    quizContainer.innerHTML = `
        <h2>${quizItem.question}</h2>
        <form id="quizForm">
            ${optionsHtml}
            <button type="submit" id="submitButton" data-correct-answer="${cleanAnswer(quizItem.correct_answer)}">ENVIAR RESPUESTA</button>
        </form>
    `;

    document.getElementById('quizForm').addEventListener('submit', function(e) {
        e.preventDefault(); 
        checkAnswer(e);
    });
}

function checkAnswer(e) {
    const form = e.target;
    const selectedOption = form.querySelector('input[name="answer"]:checked');
    const submitButton = form.querySelector('#submitButton');
    const correctAnswerCleaned = submitButton.getAttribute('data-correct-answer');

    if (!selectedOption) {
        alert("Por favor, selecciona una opción antes de enviar.");
        return;
    }
    
    const userAnswerCleaned = cleanAnswer(selectedOption.value);
    
    localStorage.setItem(LAST_PLAY_KEY, new Date().toDateString());
    submitButton.disabled = true;

    if (userAnswerCleaned === correctAnswerCleaned) {
        const winMessage = `
            <h2>🎉 ¡¡RESPUESTA CORRECTA!! ¡HAS GANADO! 🎉</h2>
            <p>Tu beneficio es: <strong>¡${PORCENTAJE_DESCUENTO} DE DESCUENTO!</strong></p>
            <p>CÓDIGO DE CUPÓN: <strong>${CODIGO_DESCUENTO}</strong></p>
            <a href="${ENLACE_CATALOGO}" target="_blank" class="catalogo-link">VER CATÁLOGO AHORA</a>
        `;
        showResult(winMessage, 'success');
    } else {
        const loseMessage = `
            <h2>😔 Respuesta Incorrecta.</h2>
            <p>Vuelve mañana para intentar un nuevo acertijo.</p>
        `;
        showResult(loseMessage, 'failure');
    }
}

function showResult(htmlContent, className) {
    document.getElementById('quiz-container').classList.add('hidden'); 
    resultMessage.innerHTML = htmlContent;
    resultMessage.className = className;
    resultMessage.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', checkPlayStatus);

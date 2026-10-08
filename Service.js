const { GoogleGenAI } = require("@google/genai")

// Recomenda-se colocar a chave em variável de ambiente (process.env.GEMINI_API_KEY)
const gemini = new GoogleGenAI()
const MODELO = "gemini-flash-latest"



class Service {


    async enviarPrompt(assunto, texto) {

        const prompt = `Você é interpretador de texto e um analisa de texto especializados. 
        
            Sua missão é:
                1 - compreender o texto enviado referente  ao assunto: ${assunto}, 
                2 - Analisar o conceito geral do que esta sendo trato e os ponto principais.
                3 - Traduzir palavras e termos complexos para um linguagem acessivel e simples
            
            Formado de saida:
                - Separe os topicos e pontos principais.
                - Escreva para cada topico um breve resumo explicativo.
            
            Se houver trechos confusos ou falta de informações, entregue o resumo do que foi compreendido e solicite os esclarecimentos necessários ao final.

            --- INICIO DO TEXTO PARA ANÁLISE ---
                ${texto}
            --- FIM DO TEXTO ---
            `

        try {
            const response = await gemini.models.generateContent({
                model: MODELO,
                contents: prompt
            })

            return { resposta: response.text }

        } catch (error) {
            console.error("Erro de integração com o modelo:", error)
            throw error 
        }
    }
}

module.exports = Service
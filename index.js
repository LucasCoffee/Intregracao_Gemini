const express = require("express")
const app = express()

const ServiceClass = require("./Service")
const service = new ServiceClass()

const cors = require("cors")

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    return res.json({ mensagem: "Olá, seja bem-vindo!" })
})

app.post("/prompt", async (req, res) => {
    const { assunto, texto } = req.body ?? {}

    if (typeof texto !== "string" || texto.trim().length === 0) {
        return res.status(400).json({ mensagem: "Você não informou nenhum texto válido para a análise" })
    }

    if (typeof assunto !== "string" || assunto.trim().length === 0) {
        return res.status(400).json({ mensagem: "Você não informou o assunto do texto" })
    }

    if (assunto.trim().length > 100) {
        return res.status(400).json({ mensagem: "O assunto deve ter no máximo 100 caracteres" })
    }

    if (texto.trim().length < 50) {
        return res.status(400).json({ mensagem: "O texto é muito curto para análise (mínimo de 50 caracteres)" })
    }

    if (texto.length > 20000) {
        return res.status(400).json({ mensagem: "O texto é muito longo (máximo de 20.000 caracteres)" })
    }

    try {
        const resultado = await service.enviarPrompt(assunto.trim(), texto.trim())

        return res.json({ resposta: resultado.resposta })

    } catch (error) {
        return res.status(503).json({
            error: "O serviço está indisponível."
        })
    }
})

app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ mensagem: "O corpo da requisição não é um JSON válido" })
    }
    if (error.type === "entity.too.large") {
        return res.status(413).json({ mensagem: "O texto enviado é grande demais" })
    }
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno no servidor" })
})

app.listen(5050, (error) => {
    if (error) {
        console.log("SERVIDOR OFF: " + error)
        return
    }
    console.log("SERVIDOR ON")
})
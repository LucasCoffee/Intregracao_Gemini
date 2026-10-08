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
    const { assunto, texto } = req.body 

    if (!texto || texto.trim().length === 0) {
        return res.status(400).json({ mensagem: "Você não informou nenhum texto válido para a análise" })
    }

    if (!assunto || assunto.trim().length === 0) {
        return res.status(400).json({ mensagem: "Você não informou nenhum texto válido para a análise" })
    }

    try {
        const resultado = await service.enviarPrompt(assunto, texto)

        return res.json({ resposta: resultado.resposta })

    } catch (error) {
        return res.status(503).json({
            error: "O serviço está indisponível."
        })
    }
})

app.listen(5050, (error) => {
    if (error) {
        console.log("SERVIDOR OFF: " + error)
        return
    }
    console.log("SERVIDOR ON")
})
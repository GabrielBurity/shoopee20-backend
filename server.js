import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO MERCADO PAGO
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// ROTA PARA CRIAR PREFERENCE
app.post("/create-preference", async (req, res) => {
    try {
        const body = req.body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        title: body.title,
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: Number(body.price)
                    }
                ],
                back_urls: {
                    success: "https://seusite.com/sucesso",
                    failure: "https://seusite.com/erro",
                    pending: "https://seusite.com/pendente"
                },
                auto_return: "approved"
            }
        });

        res.json({ id: result.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar preference" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online");
});

// PORT PARA RENDER
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});

import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN   // <-- coloque no Render
});

// ROTA PARA CRIAR PREFERÊNCIA
app.post("/create-preference", async (req, res) => {
    try {
        const { items } = req.body;

        const mpItems = items.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.qty),
            currency_id: "BRL"
        }));

        const preference = {
            items: mpItems,
            auto_return: "approved",
            back_urls: {
                success: "https://seusite.com/sucesso",
                failure: "https://seusite.com/erro",
                pending: "https://seusite.com/pendente"
            }
        };

        const result = await mercadopago.preferences.create(preference);

        return res.json({
            init_point: result.body.init_point
        });

    } catch (error) {
        console.log("ERRO NO MERCADO PAGO:", error);
        return res.status(500).json({ error: "Erro ao criar pagamento" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online!");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

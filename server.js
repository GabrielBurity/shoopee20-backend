import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAR SDK CORRETAMENTE
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN   // Certifique-se de criar no Render
});

// ROTA PARA TESTE
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online!");
});

// ROTA DE PAGAMENTO
app.post("/create-preference", async (req, res) => {
    try {
        console.log("Recebendo pedido:", req.body);

        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Formato inválido" });
        }

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
                success: "https://shoopee20.vercel.app/sucesso.html",
                failure: "https://shoopee20.vercel.app/erro.html",
                pending: "https://shoopee20.vercel.app/pendente.html"
            }
        };

        const result = await mercadopago.preferences.create(preference);

        return res.json({ init_point: result.body.init_point });

    } catch (error) {
        console.error("Erro Mercado Pago:", error);
        return res.status(500).json({ error: "Erro interno" });
    }
});

// PORTA DO RENDER
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando!");
});

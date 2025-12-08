import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG MPL
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// rota teste
app.get("/", (req, res) => {
    res.send("Backend Shoopee20 Funcionando ✓");
});

// rota para criar pagamento
app.post("/create-preference", async (req, res) => {
    try {
        console.log("Items recebidos:", req.body);

        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Formato inválido" });
        }

        const preference = {
            items: items.map(item => ({
                title: item.name,
                quantity: Number(item.qty),
                unit_price: Number(item.price),
                currency_id: "BRL"
            })),
            auto_return: "approved",
            back_urls: {
                success: "https://shoopee20.vercel.app/sucesso.html",
                failure: "https://shoopee20.vercel.app/erro.html",
                pending: "https://shoopee20.vercel.app/pendente.html"
            }
        };

        const result = await mercadopago.preferences.create(preference);

        console.log("Preferência criada:", result.body.init_point);

        return res.json({ init_point: result.body.init_point });

    } catch (err) {
        console.error("Erro Mercado Pago:", err);
        return res.status(500).json({ error: "Erro interno ao gerar pagamento" });
    }
});

// porta do Render
app.listen(process.env.PORT || 3000, () =>
    console.log("Servidor rodando...")
);

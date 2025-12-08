import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAR MERCADO PAGO COM VARIÁVEL DE AMBIENTE
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN
});

// ROTA PARA CRIAR A PREFERÊNCIA DO CARRINHO
app.post("/create_preference", async (req, res) => {
    try {
        const { items } = req.body;

        const mpItems = items.map(item => ({
            title: item.name,
            unit_price: item.price,
            quantity: item.qty,
            currency_id: "BRL"
        }));

        const preference = {
            items: mpItems,
            back_urls: {
                success: "https://seusite.com/sucesso",
                pending: "https://seusite.com/pendente",
                failure: "https://seusite.com/erro"
            },
            auto_return: "approved"
        };

        const result = await mercadopago.preferences.create(preference);

        // RETORNAR O ID PARA O FRONTEND
        res.json({
            id: result.body.id,
            init_point: result.body.init_point
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar pagamento" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online!");
});

// PORTA AUTOMÁTICA DO RENDER
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});

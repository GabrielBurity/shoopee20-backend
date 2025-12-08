import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
    access_token: "APP_USR-2769810183965214-120719-4ecd26c6c611a5e845c71de4c6fedd66-3044196386"
});

// ROTA PARA CRIAR UMA PREFERÊNCIA BASEADA NO CARRINHO
app.post("/create-preference", async (req, res) => {
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
                success: "https://SEU_SITE/sucesso",
                pending: "https://SEU_SITE/pendente",
                failure: "https://SEU_SITE/erro"
            },
            auto_return: "approved"
        };

        const result = await mercadopago.preferences.create(preference);
        result.body.sandbox_init_point
        result.body.init_point

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar pagamento" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online!");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
import express from "express";
import cors from "cors";
import MercadoPago, { Payment } from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// SDK nova
const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

// Instanciar pagamento
const payment = new Payment(client);

// Teste
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online ✓");
});

// Criar PIX
app.post("/create-pix", async (req, res) => {
    try {
        const items = req.body.items;
        const total = items.reduce((t, i) => t + i.price * i.qty, 0);

        const result = await payment.create({
            body: {
                transaction_amount: total,
                description: "Compra Shoopee20",
                payment_method_id: "pix",
                payer: {
                    email: "cliente@teste.com",
                },
            },
        });

        const data = result.response.point_of_interaction.transaction_data;

        return res.json({
            qr: data.qr_code_base64,
            code: data.qr_code,
        });

    } catch (error) {
        console.error("ERRO PIX:", error);
        return res.status(500).json({ error: "Erro ao gerar PIX" });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});

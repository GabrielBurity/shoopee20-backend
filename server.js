import express from "express";
import cors from "cors";
import MercadoPago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 INICIALIZAÇÃO CORRETA DA SDK NOVA
const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// Novo client para pagamentos
const payment = new MercadoPago.Payment(client);

// Teste
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online ✓");
});

// 📌 ROTA PIX – GERA O QR CODE CORRETAMENTE
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
                    email: "cliente@teste.com"
                }
            }
        });

        return res.json({
            qr: result.point_of_interaction.transaction_data.qr_code_base64,
            code: result.point_of_interaction.transaction_data.qr_code
        });

    } catch (error) {
        console.log("ERRO PIX:", error);
        return res.status(500).json({ error: "Erro ao gerar PIX" });
    }
});

// Render
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});

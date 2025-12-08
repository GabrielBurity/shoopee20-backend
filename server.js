import express from "express";
import cors from "cors";
import MercadoPago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Inicializar SDK corretamente
const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN // <-- VOCÊ PRECISA CRIAR ISSO NO RENDER
});

// 🔹 Cliente de pagamento (PIX / Cartão / QR)
const paymentClient = new MercadoPago.Payment(client);

// ======================================
// ROTA TESTE
// ======================================
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online ✓");
});

// ======================================
// GERAR PIX E ENVIAR QR CODE
// ======================================
app.post("/create-pix", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Formato inválido" });
        }

        // 🔹 Soma do valor do carrinho
        const total = items.reduce((t, i) => t + i.price * i.qty, 0);

        // 🔹 Chamada ao MP para gerar PIX
        const result = await paymentClient.create({
            transaction_amount: Number(total),
            description: "Compra Shoopee20",
            payment_method_id: "pix",
            payer: {
                email: "cliente@teste.com" // Pode ser dinâmico depois
            }
        });

        return res.json({
            qr: result.point_of_interaction.transaction_data.qr_code_base64,
            code: result.point_of_interaction.transaction_data.qr_code
        });

    } catch (error) {
        console.log("❌ ERRO PIX:", error);
        res.status(500).json({ error: "Erro ao gerar PIX" });
    }
});

// ======================================
// PORTA RENDER
// ======================================
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});

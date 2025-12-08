import express from "express";
import cors from "cors";
import MercadoPago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar SDK da forma nova
const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN // <- Preencher no Render
});

// Payment client para gerar PIX
const paymentClient = new MercadoPago.Payment(client);

// Teste
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 Online ✓");
});

// ROTA PIX - GERA QR CODE
app.post("/create-pix", async (req, res) => {
    try {
        const items = req.body.items;
        const total = items.reduce((t, i) => t + i.price * i.qty, 0);

        const response = await paymentClient.create({
            transaction_amount: total,
            description: "Compra Shoopee20",
            payment_method_id: "pix",
            payer: {
                email: "cliente@teste.com" // depois pode trocar para email real
            }
        });

        return res.json({
            qr: response.point_of_interaction.transaction_data.qr_code_base64,
            code: response.point_of_interaction.transaction_data.qr_code
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao gerar PIX" });
    }
});

// Porta Render
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});

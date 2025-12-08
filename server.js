import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG MERCADO PAGO SDK
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// ROTA TESTE
app.get("/", (req, res) => {
    res.send("Backend da Shoopee20 OK!");
});

// ROTA PIX - GERA QR CODE
app.post("/create-pix", async (req, res) => {
    try {
        const items = req.body.items;
        const total = items.reduce((t, i) => t + i.price * i.qty, 0);

        const payment = await mercadopago.payment.create({
            transaction_amount: total,
            description: "Compra Shoopee20",
            payment_method_id: "pix",
            payer: {
                email: "cliente@teste.com" // Pode trocar depois
            }
        });

        return res.json({
            qr: payment.body.point_of_interaction.transaction_data.qr_code_base64,
            code: payment.body.point_of_interaction.transaction_data.qr_code
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao gerar Pix" });
    }
});


// PORTA
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});



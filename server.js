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

// ROTA DE PAGAMENTO
app.post("/create-preference", async (req, res) => {
    try {
        console.log("REQ:", req.body);

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: req.body.items.map(item => ({
                    title: item.name,
                    quantity: item.qty,
                    unit_price: Number(item.price),
                    currency_id: "BRL"
                })),
                auto_return: "approved",
                back_urls: {
                    success: "https://shoopee20.vercel.app/sucesso.html",
                    failure: "https://shoopee20.vercel.app/erro.html",
                    pending: "https://shoopee20.vercel.app/pendente.html"
                }
            }
        });

        console.log("RESULT:", result);

        return res.json({ init_point: result.init_point });

    } catch (error) {
        console.error("Erro Mercado Pago:", error);
        return res.status(500).json({ error: "Erro interno ao gerar pagamento" });
    }
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


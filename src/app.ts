import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import Promotion from "./models/promotionModel";

const app: Express = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const emailApiUrl = process.env.EMAIL_API_URL as string;

app.post("/promotion", async (req: Request, res: Response) => {
  const promotion: Promotion = {
    promotionId: req.body.promotionId,
    promotionName: req.body.promotionName,
    promotionDescription: req.body.promotionDescription,
    promotionReceivers: req.body.promotionReceivers,
  };

  if (promotion) {
    for (let i = 0; i < promotion.promotionReceivers.length; i++) {
      try {
        await axios.post(
          emailApiUrl,
          {
            email: promotion.promotionReceivers[i],
            subject: promotion.promotionName,
            message: promotion.promotionDescription,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(error);
        break;
      }
    }
  }
  console.log(`Email sent to ${promotion.promotionReceivers.length} receivers`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

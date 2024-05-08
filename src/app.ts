import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import Promotion from "./models/promotionModel";
import { receiveQueue } from "./services/receiveQueue";
import { Stream } from "stream";

const app: Express = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const emailApiUrl = process.env.EMAIL_API_URL as string;

receiveQueue(function (err: any, promotionStream: Stream) {
  promotionStream.on("data", async (promotion: Promotion) => {
    if (promotion) {
      for (let i = 0; i < promotion.promotionReceivers.length; i++) {
        try {
          await axios.post(
            `${emailApiUrl}/send-mail/promotion`,
            {
              emailAddress: promotion.promotionReceivers[i].email,
              name: promotion.promotionReceivers[i].name,
              subject: promotion.promotionSubject,
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
          return;
        }
      }
    }
    console.log(
      `Email sent to ${promotion.promotionReceivers.length} receivers`
    );
  });
});

app.post("/promotion", async (req: Request, res: Response) => {
  const promotion: Promotion = req.body;

  if (promotion) {
    for (let i = 0; i < promotion.promotionReceivers.length; i++) {
      try {
        await axios.post(
          `${emailApiUrl}/send-mail/promotion`,
          {
            emailAddress: promotion.promotionReceivers[i].email,
            name: promotion.promotionReceivers[i].name,
            subject: promotion.promotionSubject,
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
        return;
      }
    }
  }
  console.log(`Email sent to ${promotion.promotionReceivers.length} receivers`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

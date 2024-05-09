import dotenv from "dotenv";
import axios from "axios";
import Promotion from "./models/Promotion.js";
import { receiveQueue } from "./services/receiveQueue.js";
import { Stream } from "stream";

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
              auth: {
                username: process.env.SIMPLE_LOGIN_USERNAME as string,
                password: process.env.SIMPLE_LOGIN_PASSWORD as string,
              },
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

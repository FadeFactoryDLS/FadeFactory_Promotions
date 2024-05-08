import dotenv from "dotenv";
import axios from "axios";
import Promotion from "./models/Promotion";
import { receiveQueue } from "./services/receiveQueue";
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

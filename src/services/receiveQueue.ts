import {
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusReceivedMessage,
} from "@azure/service-bus";
import dotenv from "dotenv";
import { Stream } from "stream";
import Promotion from "../models/Promotion";

dotenv.config();
const connectionString = process.env
  .SERVICE_BUS_QUEUE_CONNECTION_STRING as string;

const queueName = process.env.SERVICE_BUS_QUEUE_NAME as string;

export function receiveQueue(
  cb: (err: Error | null, promotionStream: Stream) => void
): void {
  const promotionStream = new Stream();
  cb(null, promotionStream);

  const sbClient = new ServiceBusClient(connectionString);

  const receiver = sbClient.createReceiver(queueName);

  const myMessageHandler = async (
    messageReceived: ServiceBusReceivedMessage
  ) => {
    promotionStream.emit("data", messageReceived.body.data);
  };

  const myErrorHandler = async (error: ProcessErrorArgs) => {
    console.log(error);
  };

  receiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler,
  });
}

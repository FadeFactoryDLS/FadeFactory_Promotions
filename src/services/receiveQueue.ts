import {
  delay,
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceivedMessage,
} from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env
  .SERVICE_BUS_QUEUE_CONNECTION_STRING as string;

const queueName = process.env.SERVICE_BUS_QUEUE_NAME as string;

export const receiveQueue = async () => {
  const sbClient = new ServiceBusClient(connectionString);

  const receiver = sbClient.createReceiver(queueName);

  const myMessageHandler = async (
    messageReceived: ServiceBusReceivedMessage
  ) => {
    console.log(`Received message: ${messageReceived.body}`);
  };

  const myErrorHandler = async (error: ProcessErrorArgs) => {
    console.log(error);
  };

  receiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler,
  });
};

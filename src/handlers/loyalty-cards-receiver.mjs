import loyaltyCard from "../repositories/loyalty-card-repository.mjs";

// import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

// const sqsClient = new SQSClient({
//   region: "ap-northeast-1",
// });

// const SQS_URL = process.env.LOYALTY_CARD_SQS;

export const handler = async (event) => {
  try {
    // const command = new ReceiveMessageCommand({
    //   MaxNumberOfMessages: 10,
    //   MessageAttributeNames: ["All"],
    //   QueueUrl: SQS_URL,
    //   VisibilityTimeout: 10,
    //   WaitTimeSeconds: 5,
    // });

    // const response = await sqsClient.send(command);

    console.log("SQS RECEIVE RESPONSE", JSON.stringify(event));

    // response = await loyaltyCard.create(JSON.parse(event.body));

    const getLoyaltyCard = event.Records[0].body;

    if (getLoyaltyCard) {
      const splitLoyaltyCard = getLoyaltyCard.split(",");

      const loyaltyCardParams = {
        CardNumber: splitLoyaltyCard[0],
        FirstName: splitLoyaltyCard[1],
        LastName: splitLoyaltyCard[2],
        Points: splitLoyaltyCard[3],
      };

      console.log("LOYALTY CARD PARAMETER", loyaltyCardParams);

      const response = await loyaltyCard.create(loyaltyCardParams);

      const buildResponse = {
        statusCode: 200,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      };

      return buildResponse;
    }

    const buildResponse = {
      statusCode: 500,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: "Server Error",
    };

    return buildResponse;
  } catch (e) {
    console.log(e);
  }


};

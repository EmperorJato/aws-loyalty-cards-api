import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
const client = new S3Client({
  region: "ap-northeast-1",
});

const sqsClient = new SQSClient({region: "ap-northeast-1",});
const mySQS = process.env.LOYALTY_CARD_SQS

export const handler = async (event) => {

  console.log("EVENT", JSON.stringify(event));

  const s3Object = event.Records[0].s3;
  const s3Key = s3Object.object.key;
  const s3BucketName = s3Object.bucket.name;

  const s3params = {
    Bucket: s3BucketName,
    Key: s3Key,
  };

  const s3Command = new GetObjectCommand(s3params);

  try {
    const s3response = await client.send(s3Command);

    const s3responseStr = await s3response.Body.transformToString();

    const loyaltyCardsToArray = s3responseStr.split("\r\n");

    const loyaltyCards = loyaltyCardsToArray.slice(1);

    // loyaltyCards.slice(1).forEach((i) => {
    //   const sqsParams = {
    //     QueueUrl: mySQS,
    //     MessageAttributes: {
    //       Title: {
    //         DataType: "String",
    //         StringValue: "The Whistler",
    //       },
    //       Author: {
    //         DataType: "String",
    //         StringValue: "John Grisham",
    //       },
    //       WeeksOn: {
    //         DataType: "Number",
    //         StringValue: "6",
    //       },
    //     },
    //     MessageBody:
    //       i,
    //   };
    //   const sendMessageCommand = new SendMessageCommand(sqsParams);
    //   const responseSendMessage = sqsClient.send(sendMessageCommand);
    //   console.log("SQS SEND MESSAGE", responseSendMessage)
    // });

    for(const loyaltyCard of loyaltyCards){

      const sqsParams = {
        DelaySeconds: 10,
        QueueUrl: mySQS,
        MessageAttributes: {
          Title: {
            DataType: "String",
            StringValue: "The Whistler",
          },
          Author: {
            DataType: "String",
            StringValue: "John Grisham",
          },
          WeeksOn: {
            DataType: "Number",
            StringValue: "6",
          },
        },
        MessageBody:
          loyaltyCard,
      };
      const sendMessageCommand = new SendMessageCommand(sqsParams);
      const responseSendMessage = await sqsClient.send(sendMessageCommand);
      console.log("SQS SEND MESSAGE", responseSendMessage)
    }



    const buildResponse = {
      statusCode: 200,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: s3responseStr,
    };

    return buildResponse;
  } catch (err) {
    console.log(err);
  }
};

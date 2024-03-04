import client, { buildResponse } from "../utils/database.mjs";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import messageResponse from "../utils/http-message.mjs";

const docClient = DynamoDBDocumentClient.from(client);

const dynamoDBTable = process.env.LOYALTY_CARD_TABLE;

const loyaltyCard = {
  getAll: async () => {
    try {
      let responseBody = {};

      const params = {
        TableName: dynamoDBTable,
      };

      const command = new ScanCommand(params);
      const response = await docClient.send(command);
      if (response["Items"]) {
        responseBody = {
          success: true,
          message: messageResponse.FETCH,
          data: response["Items"],
        };

        return buildResponse(200, responseBody);
      }

      return buildResponse(200, {
        success: false,
        message: messageResponse.EMPTY,
        data: [],
      });
    } catch (err) {
      console.log(err);
      return buildResponse(500, {
        success: false,
        message: err.message,
        data: null,
      });
    }
  },
  get: async (cardNumber) => {
    try {
      let responseBody = {};
      const params = {
        TableName: dynamoDBTable,
        Key: {
          CardNumber: cardNumber,
        },
      };

      const command = new GetCommand(params);

      const response = await docClient.send(command);

      if (response["Item"] !== undefined) {
        responseBody = {
          success: true,
          message: messageResponse.FETCH,
          data: response["Item"],
        };

        return buildResponse(200, responseBody);
      }

      responseBody = {
        success: false,
        message: messageResponse.EMPTY,
        data: null,
      };

      return buildResponse(404, responseBody);
    } catch (e) {
      console.log(e);
      return buildResponse(500, e);
    }
  },
  create: async (LoyaltyCard) => {
    try {
      const params = {
        TableName: dynamoDBTable,
        Item: LoyaltyCard,
      };

      const command = new PutCommand(params);

      const response = await docClient.send(command);

      const responseBody = {
        success: true,
        message: messageResponse.CREATE,
        data: LoyaltyCard,
      };

      return buildResponse(200, responseBody);
    } catch (e) {
      return buildResponse(500, e.message);
    }
  },
  update: async (cardNumber, loyaltyCard) => {
    try {
      const params = {
        TableName: dynamoDBTable,
        Key: {
          CardNumber: cardNumber,
        },
        UpdateExpression:
          "set FirstName = :firstName, LastName = :lastName, Points = :points",
        ExpressionAttributeValues: {
          ":firstName": loyaltyCard.FirstName,
          ":lastName": loyaltyCard.LastName,
          ":points": loyaltyCard.Points,
        },
        ReturnValues: "ALL_NEW",
      };

      const command = new UpdateCommand(params);

      const response = await docClient.send(command);

      const responseBody = {
        success: true,
        message: messageResponse.UPDATE,
        data: loyaltyCard,
      };

      return buildResponse(200, responseBody);
    } catch (err) {
      return buildResponse(500, err.message);
    }
  },
  delete: async (cardNumber) => {
    try {
      const params = {
        TableName: dynamoDBTable,
        Key: {
          CardNumber: cardNumber,
        },
      };

      const command = new DeleteCommand(params);
      const response = await docClient.send(command);

      if (response.$metadata.httpStatusCode === 200) {
        const responseBody = {
          success: true,
          message: messageResponse.DELETE,
          data: null,
        };

        return buildResponse(200, responseBody);
      }

      return buildResponse(500, "Server Error");
    } catch (err) {
      console.log(err);
      return buildResponse(500, err.message);
    }
  },
};

export default loyaltyCard;

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: 'ap-northeast-1'
})

export default client

export const buildResponse = (responseCode, responseBody) => {

    const response = {
        statusCode: responseCode,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(responseBody)
    }
    return response;
}
import loyaltyCard from "../repositories/loyalty-card-repository.mjs";

export const handler = async (event) => {
  let response;
  const httpMethod = event.requestContext.http.method;
  const cardNumber = event.queryStringParameters?.CardNumber || '';

  switch (true) {
    case httpMethod === "GET":
      response = await loyaltyCard.get(cardNumber);
      break;
    case httpMethod === "POST":
      response = await loyaltyCard.create(JSON.parse(event.body));
      break;
    case httpMethod === "PUT":
      response = await loyaltyCard.update(cardNumber, JSON.parse(event.body));
      break;
    case httpMethod === "DELETE":
      response = await loyaltyCard.delete(cardNumber);
      break;
    default:
      const responseBody = {
        success: false,
        message: "No Record(s) Found",
        data: null,
      };
      response = {
        statusCode: 404,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responseBody),
      };
  }

  return response;
};
 
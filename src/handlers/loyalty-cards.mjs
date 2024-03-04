import loyaltyCard from "../repositories/loyalty-card-repository.mjs";

export const handler = async (event) => {
  try {

    return await loyaltyCard.getAll();
    
  } catch (err) {
    console.log(err);
    const responseBody = {
      success: false,
      message: err.message,
      data: null,
    };

    return buildResponse(500, responseBody);
  }
};

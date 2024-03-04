export const handler = async (event) => {
  const auth = event.headers.authorization || "";

  console.log(event);

  const userPermission = {
    "user-allow": "Allow",
    "user-deny": "Deny",
  };

  let response = {};
  const effect = userPermission[auth];
  const routeArn = event.routeArn;

  response.principalId = auth;

  if (effect && routeArn) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: effect,
          Action: "execute-api:Invoke",
          Resource: routeArn,
        },
      ],
    };

    response.policyDocument = policyDocument;
  } 

  response.context = {
    "powerd-by": "Steto Javellana",
  };

  console.log(JSON.stringify(response));

  return response;
};

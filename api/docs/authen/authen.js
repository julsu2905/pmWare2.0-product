module.exports = {
  // method of operation
  post: {
    tags: ["Authentication"], // operation's tag.
    description: "Login user", // operation's desc.
    operationId: "postLoginUser", // unique operation id.
    parameters: [], // expected params.
    // expected responses
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "abc@gmail.com" },
              password: { type: "string", example: "Aa123456" },
            },
          },
        },
      },
    },
    responses: {
      // response code
      200: {
        description: "Login successfully", // response desc.
        content: {
          // content-type
          "application/json": {
            status: "success",
            user: {
              schema: {
                $ref: "#/components/schemas/User", // Todo model
              },
              token: { $ref: "#/components/securitySchemes/cookieAuth" },
            },
          },
        },
      },
      400: {
        description: "Authen error", // response desc
      },
      500: {
        description: "Server error", // response desc
      },
    },
  },
  post: {
    tags: ["Authentication"], // operation's tag.
    description: "Login admin user", // operation's desc.
    operationId: "postAdminuser", // unique operation id.
    parameters: [], // expected params.
    // expected responses
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "abc@gmail.com" },
              password: { type: "string", example: "Aa123456" },
            },
          },
        },
      },
    },
    responses: {
      // response code
      200: {
        description: "Login successfully", // response desc.
        content: {
          // content-type
          "application/json": {
            status: "success",
            user: {
              schema: {
                $ref: "#/components/schemas/AdminUser", // Todo model
              },
              token: { $ref: "#/components/securitySchemes/cookieAuth" },
            },
          },
        },
      },
      400: {
        description: "Authen error", // response desc
      },
      500: {
        description: "Server error", // response desc
      },
    },
  },
  get: {
    tags: ["Authentication"], // operation's tag.
    description: "Logout", // operation's desc.
    operationId: "getLogout", // unique operation id.
    parameters: [], // expected params.
    // expected responses
    requestBody: {},
    responses: {
      // response code
      200: {
        description: "Logout successfully", // response desc.
        content: {
          // content-type
          "application/json": {
            status: "success",
          },
        },
      },
      400: {
        description: "Authen error", // response desc
      },
      500: {
        description: "Server error", // response desc
      },
    },
  },
};

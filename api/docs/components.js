module.exports = {
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "jwt" },
      bearerAuth: { type: "apiKey", in: "header", name: "Authorization" },
    },
    security: {
      cookieAuth: [],
    },
    schemas: {
      // todo model
      User: {
        type: "object",
        required: ["name", "email", "password", "passwordConfirm"], // data type
        properties: {
          name: {
            type: "string", // data-type
            format: "email",
            description: "User's Name", // desc
            example: "User A", // example of a title
          },
          email: {
            type: "string", // data type
            description: "User's Email", // desc
            example: "email@abc.com", // example of a completed value
          },
          password: {
            type: "string", // data type
            description: "User's Password", // desc
            example: "Aa123456", // example of a completed value
          },
          passwordConfirm: {
            type: "string", // data type
            description: "User's Password", // desc
            example: "Aa123456", // example of a completed value
          },

          bio: {
            type: "string", // data type
            description: "User's Bio", // desc
            example: "My name is Jeff", // example of a completed value
          },
          avatar: {
            type: "string", // data type
            description: "User's Avatar", // desc
            example: "avatar.jpg", // example of a completed value
          },
          active: {
            type: "boolean", // data type
            description: "User's Active", // desc
            default: true,
            example: true, // example of a completed value
          },
          premium: {
            type: "number", // data type
            description: "User's Premium days", // desc
            default: 0,
            example: 0, // example of a completed value
          },
          watchTasks: {
            type: "array", // data type
            items: {
              $ref: "#/components/schemas/Task",
            },
            description: "User's Watch Task", // desc
          },
          myProjects: {
            type: "array", // data type
            items: {
              $ref: "#/components/schemas/Project",
            },
            description: "User's Projects", // desc
          },
          assignedSubTasks: {
            type: "array", // data type
            items: {
              $ref: "#/components/schemas/SubTask",
            },
            description: "User's SubTask", // desc
          },
        },
      },
      AdminUser: {
        type: "object",
        required: ["name", "email", "password", "passwordConfirm"], // data type
        properties: {
          name: {
            type: "string", // data-type
            format: "email",
            description: "User's Name", // desc
            example: "User A", // example of a title
          },
          email: {
            type: "string", // data type
            description: "User's Email", // desc
            example: "email@abc.com", // example of a completed value
          },
          password: {
            type: "string", // data type
            description: "User's Password", // desc
            example: "Aa123456", // example of a completed value
          },
          passwordConfirm: {
            type: "string", // data type
            description: "User's Password", // desc
            example: "Aa123456", // example of a completed value
          },
          bio: {
            type: "string", // data type
            description: "User's Bio", // desc
            example: "My name is Jeff", // example of a completed value
          },
          avatar: {
            type: "string", // data type
            description: "User's Avatar", // desc
            example: "avatar.jpg", // example of a completed value
          },
          active: {
            type: "boolean", // data type
            description: "User's Active", // desc
            default: true,
            example: true, // example of a completed value
          },
          role: {
            type: "string", // data type
            description: "User's Active",
            enum: ["Admin", "Operator"],
            default: "Admin",
            example: "Admin", // example of a completed value
          },
        },
      },
      Project: {
        type: "object", // data type
        required: ["code", "name", "memberQuantity"],
        properties: {
          code: {
            type: "string", // data type
            description: "Project's Code", // desc
            example: "PMP", // example of a title
          },
          name: {
            type: "string", // data type
            description: "Project's name", // desc
            example: "PM Project", // example of a completed value
          },
          memberQuantity: {
            type: "number", // data type
            description: "Project's member quantity", // desc
            example: 3, // example of a completed value
          },
          description: {
            type: "string", // data type
            description: "Project's description", // desc
            example: "sample description", // example of a completed value
          },
          admin: {
            type: "string", // data type
            description: "Project's admin Id", // desc
            example: "60ea591e01e4ac7520cff93c", // example of a completed value
          },
          members: {
            type: "array", // data typeitems:
            items: {
              $ref: "#/components/schemas/User",
            },
            description: "Project's members's id", // desc
            example:
              "[60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c]", // example of a completed value
          },
          moderators: {
            type: "array", // data typeitems:
            items: {
              $ref: "#/components/schemas/User",
            },
            description: "Project's moderators's id", // desc
            example:
              "[60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c]", // example of a completed value
          },
          active: {
            type: "boolean", // data typeitems:
            default: true,
            description: "Project's active status", // desc
            example: true, // example of a completed value
          },
          visibility: {
            type: "string", // data typeitems:
            enum: ["private", "open"],
            default: "open",
            description: "Project's visibility", // desc
            example: "open", // example of a completed value
          },
          projectTasks: {
            type: "array", // data type
            items: {
              $ref: "#/components/schemas/Task",
            },
            description: "Project's tasks", // desc
            example: "60ea591e01e4ac7520cff93c", // example of a completed value
          },
        },
      },
      Task: {
        type: "object", // data type
        required: ["code", "name", "startDate", "dueDate", "project"],
        properties: {
          code: {
            type: "string", // data type
            description: "Task's Code", // desc
            example: "PMP-0", // example of a title
          },
          name: {
            type: "string", // data type
            description: "Task's name", // desc
            example: "Task name", // example of a completed value
          },
          description: {
            type: "string", // data type
            description: "Task's description", // desc
            example: "sample description", // example of a completed value
          },
          project: {
            type: "string", // data type
            description: "Project's Id", // desc
            example: "60ea591e01e4ac7520cff93c", // example of a completed value
          },
          attachment: {
            type: "string", // data typeitems:
            description: "Task's attachment", // desc
            example: "filename.pdf", // example of a completed value
          },
          priority: {
            type: "string", // data typeitems:
            enum: ["Critical", "Normal", "High", "Low"],
            default: "Normal",
            description: "Task's priority", // desc
            example: "Normal", // example of a completed value
          },
          startDate: {
            type: "string", // data type
            description: "Task's start date", // desc
            example: "2021-18-07", // example of a completed value
          },
          dueDate: {
            type: "string", // data type
            description: "Task's due date", // desc
            example: "2021-19-07", // example of a completed value
          },
          subTasks: {
            type: "array", // data typeitems:
            items: {
              $ref: "#/components/schemas/SubTask",
            },
            description: "Task's subtask's id", // desc
            example:
              "[60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c]", // example of a completed value
          },
          prerequisiteTasks: {
            type: "array", // data typeitems:
            items: {
              $ref: "#/components/schemas/Task",
            },
            description: "Task's prerequisite Tasks", // desc
            example:
              "[60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c]", // example of a completed value
          },
          watchers: {
            type: "array", // data typeitems:
            items: {
              $ref: "#/components/schemas/User",
            },
            description: "Task's watchers's id", // desc
            example:
              "[60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c,60ea591e01e4ac7520cff93c]", // example of a completed value
          },
        },
      },
      SubTask: {
        type: "object", // data type
        required: ["code", "name", "startDate", "dueDate", "task"],
        properties: {
          code: {
            type: "string", // data type
            description: "SubTask's Code", // desc
            example: "PMP-0", // example of a title
          },
          name: {
            type: "string", // data type
            description: "SubTask's name", // desc
            example: "SubTask name", // example of a completed value
          },
          description: {
            type: "string", // data type
            description: "SubTask's description", // desc
            example: "sample description", // example of a completed value
          },
          task: {
            type: "string", // data type
            description: "Task's Id", // desc
            example: "60ea591e01e4ac7520cff93c", // example of a completed value
          },
          attachment: {
            type: "string", // data typeitems:
            description: "SubTask's attachment", // desc
            example: "filename.pdf", // example of a completed value
          },
          status: {
            type: "string", // data typeitems:
            enum: ["assigned", "working", "pending", "done"],
            default: "assigned",
            description: "SubTask's status", // desc
            example: "Normal", // example of a completed value
          },
          startDate: {
            type: "string", // data type
            description: "SubTask's start date", // desc
            example: "2021-18-07", // example of a completed value
          },
          dueDate: {
            type: "string", // data type
            description: "SubTask's due date", // desc
            example: "2021-19-07", // example of a completed value
          },
        },
      },
      // error model
      Error: {
        type: "object", //data type
        properties: {
          message: {
            type: "string", // data type
            description: "Error message", // desc
            example: "Not found", // example of an error message
          },
          internal_code: {
            type: "string", // data type
            description: "Error internal code", // desc
            example: "Invalid parameters", // example of an error internal code
          },
        },
      },
    },
  },
};

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SaveUserFunctionDefinition = DefineFunction({
  callback_id: "save_user_function",
  title: "Save user and channel to datastore function",
  description: "A function for save the user and channel to datastore.",
  source_file: "functions/save_user.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["user", "channel_id"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  SaveUserFunctionDefinition,
  async ({ inputs, client }) => {
    const uuid = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const putResponse = await client.apps.datastore.put({
      datastore: "users",
      item: {
        id: uuid,
        user: inputs.user,
        channel: inputs.channel_id,
        ts: timestamp,
      },
    });

    if (!putResponse.ok) {
      console.log("Error calling apps.datastore.put:");
    }

    return { outputs: {} };
  },
);

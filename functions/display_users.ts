import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Custom function for showing usernames
 */

export const DisplayUsersFunctionDefinition = DefineFunction({
  callback_id: "display_users_function",
  title: "Display users in the datastore function",
  description:
    "A function for displaying the users that ran the setup workflow.",
  source_file: "functions/display_users.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  DisplayUsersFunctionDefinition,
  async ({ inputs, client }) => {
    const result = await client.apps.datastore.query({
      datastore: "users",
    });
    const userArray: string[] = [];
    // deno-lint-ignore no-explicit-any
    result.items.forEach((item: any) => {
      const user = `<@${item.user}>`;
      if (userArray.indexOf(user) === -1) userArray.push(user);
    });

    console.log(inputs.channel_id);

    // threads feedback under parent message
    const msgResponse = await client.chat.postMessage({
      channel: inputs.user_id,
      mrkdwn: true,
      text: userArray.join("\n"),
    });

    if (!msgResponse.ok) {
      console.log(
        "Error during request chat.postMessage!",
        msgResponse.error,
      );
    }

    return { outputs: {} };
  },
);

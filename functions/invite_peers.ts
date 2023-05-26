import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const InvitePeersFunctionDefinition = DefineFunction({
  callback_id: "invite_peers_function",
  title: "Invite peers function",
  description: "A function for inviting peers to give feedback.",
  source_file: "functions/invite_peers.ts",
  input_parameters: {
    properties: {
      requestor: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      peers: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
        description: "Channels for the message to be posted",
      },
    },
    required: ["requestor", "channel_id", "peers"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  InvitePeersFunctionDefinition,
  async ({ inputs, client }) => {
    const peers: string[] = inputs.peers;
    // const message = `_*From <@${inputs.user}>*:_ \n> ${inputs.message}`;

    peers.forEach(async function (peer) {
      const msgResponse = await client.chat.postMessage({
        channel: peer,
        mrkdwn: true,
        text: message,
        blocks: [
          ty,
        ],
      });

      if (!msgResponse.ok) {
        console.log(
          "Error during request chat.postMessage!",
          msgResponse.error,
        );
      }
    });

    const channelMsgResponse = await client.chat.postMessage({
      channel: inputs.channel_id,
      mrkdwn: true,
      text: `Requested peer feedback from ${
        peers.join(", ").replace(/,(?=[^,]+$)/, ", and")
      }.`,
    });

    if (!channelMsgResponse.ok) {
      console.log(
        "Error during request chat.postMessage!",
        channelMsgResponse.error,
      );
    }

    return { outputs: {} };
  },
);

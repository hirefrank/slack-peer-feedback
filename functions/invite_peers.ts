import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { TriggerContextData } from "deno-slack-api/mod.ts";
import PeerFeedbackWorkflow from "../workflows/feedback.ts";

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
    const peersFormatted: string[] = [];
    const trigger = await feedbackTrigger(
      client,
      inputs.requestor,
      inputs.channel_id,
    );

    peers.forEach(async function (peer) {
      peersFormatted.push(`<@${peer}>`);
      const msgResponse = await client.chat.postMessage({
        channel: peer,
        mrkdwn: true,
        text:
          `:wave: <@${inputs.requestor}> has requested peer feedback from you! \n ${trigger.shortcut_url}`,
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
        peersFormatted.join(", ").replace(/,(?=[^,]+$)/, ", and")
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

export async function feedbackTrigger(
  client: SlackAPIClient,
  requestor: string,
  channel_id: string,
): Promise<{ ok: boolean; shortcut_url?: string; error?: string }> {
  const triggerResponse = await client.workflows.triggers.create<
    typeof PeerFeedbackWorkflow.definition
  >({
    type: "shortcut",
    name: "Give peer feedback",
    description:
      `A workflow for giving <@${requestor}> feedback. (Bug: descriptions should support encoded user ids.)`,
    workflow: `#/workflows/${PeerFeedbackWorkflow.definition.callback_id}`,
    inputs: {
      requestor: { value: requestor },
      channel_id: { value: channel_id },
      peer: { value: TriggerContextData.Shortcut.user_id },
      interactivity: { value: TriggerContextData.Shortcut.interactivity },
    },
  });
  if (!triggerResponse.ok) {
    return { ok: false, error: triggerResponse.error };
  }
  return { ok: true, shortcut_url: triggerResponse.trigger?.shortcut_url };
}

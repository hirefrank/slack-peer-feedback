import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { TriggerContextData } from "deno-slack-api/mod.ts";
import RequestFeedbackWorkflow from "../workflows/request.ts";

/**
 * Custom function for requesting which peers to give the requestor feedback
 * Creates a link trigger that only the requestor can run to initiate the
 * workflow to collect a list of peers to collect feedback from
 */

export const RequestPeersFunctionDefinition = DefineFunction({
  callback_id: "request_peers_function",
  title: "Request peers function",
  description: "A function for requesting peers to give feedback.",
  source_file: "functions/request_peers.ts",
  input_parameters: {
    properties: {
      requestor: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["requestor", "channel_id"],
  },
  output_parameters: {
    properties: {
      feedbackShortcut: {
        type: Schema.types.string,
      },
    },
    required: ["feedbackShortcut"],
  },
});

export default SlackFunction(
  RequestPeersFunctionDefinition,
  async ({ inputs, client }) => {
    // generates runtime link trigger
    const trigger = await requestTrigger(
      client,
      inputs.requestor,
      inputs.channel_id,
    );

    // set ACL to requestor for newly created shortcut
    // TODO: Setting trigger ACL doesn't currently work with JIT tokens (bug)
    // const aclResponse = await client.apiCall(
    //   "workflows.triggers.permissions.set",
    //   {
    //     "permission_type": "named_entities",
    //     "user_ids": inputs.requestor,
    //     "trigger_id": trigger.id,
    //     // incase you want to override the JIT token
    //     // "token":
    //     //   "",
    //   },
    // );

    // if (!aclResponse.ok) {
    //   console.log(aclResponse.error);
    //   console.log("setting acl failed");
    // } else {
    //   console.log("setting acl succeeded");
    // }

    if (trigger.shortcut_url) {
      return { outputs: { feedbackShortcut: trigger.shortcut_url } };
    } else {
      throw "failed to create request peers shortcut";
    }
  },
);

/**
 * Function for creating a runtime link trigger for each requestor to
 * be able to provide a list of users who they want peer reviews from
 * I used this instead of a workflow button because I didn't want
 * to have to generate the block kit items in a custom function.
 */

export async function requestTrigger(
  client: SlackAPIClient,
  requestor: string,
  channel_id: string,
): Promise<
  { ok: boolean; shortcut_url?: string; error?: string; id: string }
> {
  const triggerResponse = await client.workflows.triggers.create<
    typeof RequestFeedbackWorkflow.definition
  >({
    type: "shortcut",
    name: "Request peers for feedback",
    description:
      `A workflow for requesting which peers to give <@${requestor}> feedback. (Bug: descriptions should support encoded user ids.)`,
    workflow: `#/workflows/${RequestFeedbackWorkflow.definition.callback_id}`,
    inputs: {
      requestor: { value: requestor },
      channel_id: { value: channel_id },
      interactivity: { value: TriggerContextData.Shortcut.interactivity },
    },
  });
  if (!triggerResponse.ok) {
    throw triggerResponse.error;
  }
  return {
    ok: true,
    shortcut_url: triggerResponse.trigger.shortcut_url,
    id: triggerResponse.trigger.id,
  };
}

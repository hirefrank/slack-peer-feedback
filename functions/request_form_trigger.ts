// functions/example_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import RequestFeedbackWorkflow from "../workflows/request.ts";

export const CreateInviteTrigger = DefineFunction({
  callback_id: "create_invite_trigger",
  title: "Trigger for inviting peers",
  source_file: "functions/request_form_trigger.ts",
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
      trigger_id: {
        type: Schema.types.string,
      },
      shortcut_url: {
        type: Schema.types.string,
      },
    },
    required: ["trigger_id", "shortcut_url"],
  },
});

export default SlackFunction(
  CreateInviteTrigger,
  async ({ inputs, client }) => {
    const triggerResponse = await client.workflows.triggers.create<
      typeof RequestFeedbackWorkflow.definition
    >({
      type: "shortcut",
      name: `${RequestFeedbackWorkflow.definition.title}`,
      workflow: `#/workflows/${RequestFeedbackWorkflow.definition.callback_id}`,
      inputs: {
        requestor: {
          value: inputs.requestor,
        },
        channel_id: {
          value: inputs.channel_id,
        },
        peer: {
          value: "{{data.user_id}}",
        },
        interactivity: {
          value: "{{data.interactivity}}",
        },
      },
    });

    const trigger_id = triggerResponse.trigger?.id ?? "";
    const shortcut_url = triggerResponse.trigger?.shortcut_url ?? "";
    console.log(shortcut_url);
    return {
      outputs: {
        trigger_id: trigger_id,
        shortcut_url: shortcut_url,
      },
    };
  },
);

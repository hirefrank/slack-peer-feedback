import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SaveUserFunctionDefinition } from "../functions/save_user.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
 */
const SetupPeerFeedbackWorkflow = DefineWorkflow({
  callback_id: "setup_peer_feedback",
  title: "Request feedback from your peers.",
  description: "A workflow for requesting feedback from peers.",
  input_parameters: {
    properties: {
      requestor: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["requestor"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

// setup private channel
const createChannelStep = SetupPeerFeedbackWorkflow.addStep(
  Schema.slack.functions.CreateChannel,
  {
    channel_name: "peer-feedback",
    is_private: true,
    manager_ids: [SetupPeerFeedbackWorkflow.inputs.requestor],
  },
);

// custom function, save user/channel to datastore
SetupPeerFeedbackWorkflow.addStep(
  SaveUserFunctionDefinition,
  {
    channel_id: createChannelStep.outputs.channel_id,
    user: SetupPeerFeedbackWorkflow.inputs.requestor,
  },
);

// invite requestor to private channel
SetupPeerFeedbackWorkflow.addStep(
  Schema.slack.functions.InviteUserToChannel,
  {
    channel_ids: [createChannelStep.outputs.channel_id],
    user_ids: [SetupPeerFeedbackWorkflow.inputs.requestor],
  },
);

console.log(Deno.env.get("workflow_request"));

const instructions = SetupPeerFeedbackWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: createChannelStep.outputs.channel_id,
    message: `*:rocket: Congrats! This is your private peer feedback channel!*
    
:writing_hand: When you receive peer feedback it will appear in this channel.
:bulb: Feel free to rename this channel to something more memorable
:thinking_face: Consider inviting your manager to this channel.
`,
    interactive_blocks: [
      {
        type: "actions",
        elements: [
          {
            type: "workflow_button",
            text: {
              type: "plain_text",
              text: "Request feedback from peers",
            },
            workflow: {
              trigger: {
                url: Deno.env.get("workflow_request"),
                customizable_input_parameters: [
                  {
                    name: "requestor",
                    value: SetupPeerFeedbackWorkflow.inputs.requestor,
                  },
                  {
                    name: "channel_id",
                    value: createChannelStep.outputs.channel_id,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
);

// pin this to the channel
SetupPeerFeedbackWorkflow.addStep(
  Schema.slack.functions.AddPin,
  {
    channel_id: createChannelStep.outputs.channel_id,
    message: instructions.outputs.message_link,
  },
);

export default SetupPeerFeedbackWorkflow;

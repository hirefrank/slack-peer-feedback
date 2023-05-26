import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InvitePeersFunctionDefinition } from "../functions/invite_peers.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
 */
const RequestFeedbackWorkflow = DefineWorkflow({
  callback_id: "request_peer_feedback",
  title: "Invite peers for feedback.",
  description: "A workflow for requesting feedback from peers.",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      requestor: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["requestor", "channel_id", "interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

const inputForm = RequestFeedbackWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Request peer feedback",
    interactivity: RequestFeedbackWorkflow.inputs.interactivity,
    submit_label: "Request",
    description: "We'll send them a form to submit feedback.",
    fields: {
      elements: [{
        name: "peers",
        title: "Peers",
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      }],
      required: ["peers"],
    },
  },
);

// custom function
// send dm with instructions/form link to those invited
// send message to channel as confirmation they were invited
RequestFeedbackWorkflow.addStep(
  InvitePeersFunctionDefinition,
  {
    requestor: RequestFeedbackWorkflow.inputs.requestor,
    channel_id: RequestFeedbackWorkflow.inputs.channel_id,
    peers: inputForm.outputs.fields.peers,
  },
);

export default RequestFeedbackWorkflow;

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InvitePeersFunctionDefinition } from "../functions/invite_peers.ts";

/**
 * Workflow for requesting peers to give feedback.
 * Peers are sent a DM and link to a form for submitting.
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

// opens form to submit peers
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

// custom function to dm peers and setup runtime link trigger
RequestFeedbackWorkflow.addStep(
  InvitePeersFunctionDefinition,
  {
    requestor: RequestFeedbackWorkflow.inputs.requestor,
    channel_id: RequestFeedbackWorkflow.inputs.channel_id,
    peers: inputForm.outputs.fields.peers,
  },
);

export default RequestFeedbackWorkflow;

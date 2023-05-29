import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendFeedbackFunctionDefinition } from "../functions/send_feedback.ts";

/**
 * Feedback workflow for peers to write their feedback
 * and then the feedback is sent to the private channel.
 * Peer has the option of sending the feedback as anonymous.
 */

const PeerFeedbackWorkflow = DefineWorkflow({
  callback_id: "peer_feedback_workflow",
  title: "Peer Feedback Form",
  description: "A workflow for submitting peer feedback.",
  input_parameters: {
    properties: {
      requestor: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      peer: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["requestor", "channel_id", "peer", "interactivity"],
  },
});

// open form for writing feedback
const inputForm = PeerFeedbackWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: `Peer Feedback`,
    description:
      `You are submitting feedback for <@${PeerFeedbackWorkflow.inputs.requestor}>.`,
    interactivity: PeerFeedbackWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [{
        name: "anon",
        title: "Do you want to submit your feedback anonymously?",
        type: Schema.types.boolean,
        default: false,
      }, {
        name: "continue",
        title: "What should they continue doing?",
        type: Schema.types.string,
        long: true,
        default: `* Helped navigate ambiguity or uncertainty?
* Follow through on things promised?
* Done things that were particularly helpful?
        `,
      }, {
        name: "start",
        title: "What should they start doing?",
        type: Schema.types.string,
        long: true,
        default: `* Give clearer direction or goals?
* Increased follow through on commitments?
* Could they have been more helpful on an effort?
        `,
      }, {
        name: "stop",
        title: "What should they stop doing?",
        type: Schema.types.string,
        long: true,
        default: `* Created confusion or got in the way?
* Didn't follow through and wasn't dependable?
* When were they particularly unhelpful?
        `,
      }],
      required: ["anon", "continue", "start", "stop"],
    },
  },
);

// custom function for adding the message in channel
PeerFeedbackWorkflow.addStep(
  SendFeedbackFunctionDefinition,
  {
    channel_id: PeerFeedbackWorkflow.inputs.channel_id,
    peer: PeerFeedbackWorkflow.inputs.peer,
    feedback: {
      anon: inputForm.outputs.fields.anon,
      continue: inputForm.outputs.fields.continue,
      start: inputForm.outputs.fields.start,
      stop: inputForm.outputs.fields.stop,
    },
  },
);

// send confirmation message to peer
PeerFeedbackWorkflow.addStep(
  Schema.slack.functions.SendDm,
  {
    user_id: PeerFeedbackWorkflow.inputs.peer,
    message:
      `Thanks for submitting peer feedback for <@${PeerFeedbackWorkflow.inputs.requestor}>.`,
  },
);

export default PeerFeedbackWorkflow;

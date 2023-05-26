import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/future/forms#add-interactivity
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

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */

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
        name: "continue",
        title: "Do you want to submit your feedback anonymously?",
        type: Schema.types.boolean,
        description: "We hope you don't.",
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
      required: ["continue", "start", "stop"],
    },
  },
);

// add message in channel

export default PeerFeedbackWorkflow;

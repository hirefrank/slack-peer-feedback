import { Trigger } from "deno-slack-sdk/types.ts";
import PeerFeedbackWorkflow from "../workflows/feedback.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */

const trigger: Trigger<typeof PeerFeedbackWorkflow.definition> = {
  type: "shortcut",
  name: "Give Feedback",
  description: "Give peer feedback.",
  workflow: "#/workflows/peer_feedback_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    requestor: {
      customizable: true,
    },
    peer: {
      value: "{{data.user_id}}",
    },
    channel_id: {
      customizable: true,
    },
  },
};

export default trigger;

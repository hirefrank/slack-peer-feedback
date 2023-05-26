import { Trigger } from "deno-slack-sdk/types.ts";
import SetupPeerFeedbackWorkflow from "../workflows/setup.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */

const trigger: Trigger<typeof SetupPeerFeedbackWorkflow.definition> = {
  type: "shortcut",
  name: "Peer Feedback",
  description: "Quite possibly the easiest way to get peer feedback.",
  workflow: "#/workflows/setup_peer_feedback",
  inputs: {
    requestor: {
      value: "{{data.user_id}}",
    },
  },
};

export default trigger;

import { Trigger } from "deno-slack-sdk/types.ts";
import SetupPeerFeedbackWorkflow from "../workflows/setup.ts";

/**
 * Intial trigger for the setup workflow. Must be created manually
 * when deployed.
 */

const trigger: Trigger<typeof SetupPeerFeedbackWorkflow.definition> = {
  type: "shortcut",
  name: "Peer Feedback",
  description: "Quite possibly the easiest way to receive peer feedback.",
  workflow: "#/workflows/setup_peer_feedback",
  inputs: {
    requestor: {
      value: "{{data.user_id}}",
    },
  },
};

export default trigger;

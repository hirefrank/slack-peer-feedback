import { Trigger } from "deno-slack-sdk/types.ts";
import RequestFeedbackWorkflow from "../workflows/request.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */

const trigger: Trigger<typeof RequestFeedbackWorkflow.definition> = {
  type: "shortcut",
  name: "Request Peers",
  description: "Request peers to give feedback.",
  workflow: "#/workflows/request_peer_feedback",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    requestor: {
      customizable: true,
    },
    channel_id: {
      customizable: true,
    },
  },
};

export default trigger;

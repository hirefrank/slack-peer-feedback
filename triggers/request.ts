import { Trigger } from "deno-slack-sdk/types.ts";
import RequestFeedbackWorkflow from "../workflows/request.ts";

/**
 * Trigger for the workflow to request peers. This workflow
 * uses Workflow Buttons so it must be created manually when deployed.
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

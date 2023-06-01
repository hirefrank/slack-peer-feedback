import { Trigger } from "deno-slack-sdk/types.ts";
import StatsWorkflow from "../workflows/stats.ts";

/**
 * Link trigger for workflow stats
 */

const trigger: Trigger<typeof StatsWorkflow.definition> = {
  type: "shortcut",
  name: "Peer Feedback Stats",
  description: "Show simple stats for this workflow.",
  workflow: "#/workflows/stats",
  inputs: {
    user_id: {
      value: "{{data.user_id}}",
    },
  },
};

export default trigger;

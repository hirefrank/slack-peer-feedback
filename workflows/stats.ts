import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { DisplayUsersFunctionDefinition } from "../functions/display_users.ts";

/**
 * Workflow for showing stats.
 */

const StatsWorkflow = DefineWorkflow({
  callback_id: "stats",
  title: "Show stats for this pack of workflow.",
  description: "A workflow for showing stats.",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
});

// custom function, display users
StatsWorkflow.addStep(
  DisplayUsersFunctionDefinition,
  {
    user_id: StatsWorkflow.inputs.user_id,
  },
);

export default StatsWorkflow;

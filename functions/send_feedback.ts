import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SendFeedbackFunctionDefinition = DefineFunction({
  callback_id: "send_feedback_function",
  title: "Send peer feedback function",
  description: "A function for sending peer's feedback to channel.",
  source_file: "functions/send_feedback.ts",
  input_parameters: {
    properties: {
      peer: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      feedback: {
        type: Schema.types.object,
      },
    },
    required: ["peer", "channel_id", "feedback"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  SendFeedbackFunctionDefinition,
  async ({ inputs, client }) => {
    const byline = (!inputs.feedback.anon) ? `<@${inputs.peer}>` : "Anonymous";
    const message = `:wave: You've received feedback from ${byline}.

*What should they continue doing?*
${inputs.feedback.continue}

*What should they start doing?*
${inputs.feedback.start}

*What should they stop doing?*
${inputs.feedback.stop}

:v:
`;

    const msgResponse = await client.chat.postMessage({
      channel: inputs.channel_id,
      mrkdwn: true,
      text: message,
    });

    if (!msgResponse.ok) {
      console.log(
        "Error during request chat.postMessage!",
        msgResponse.error,
      );
    }

    return { outputs: {} };
  },
);

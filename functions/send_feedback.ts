import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Custom function for posting the peer feedback in the
 * requestor's private channel.
 */

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
    const feedback = `
*What should you continue doing?*
${inputs.feedback.continue}

*What should you start doing?*
${inputs.feedback.start}

*What should you stop doing?*
${inputs.feedback.stop}`;

    // posts message announcing feedback has been submitted
    const msgResponse = await client.chat.postMessage({
      channel: inputs.channel_id,
      mrkdwn: true,
      text: `:wave: You've received feedback from ${byline}.`,
    });

    if (!msgResponse.ok) {
      console.log(
        "Error during request chat.postMessage!",
        msgResponse.error,
      );
    } else {
      // threads feedback under parent message
      const feedbackResponse = await client.chat.postMessage({
        channel: inputs.channel_id,
        thread_ts: msgResponse.ts,
        mrkdwn: true,
        text: feedback,
      });

      if (!feedbackResponse.ok) {
        console.log(
          "Error during request chat.postMessage!",
          msgResponse.error,
        );
      }
    }

    return { outputs: {} };
  },
);

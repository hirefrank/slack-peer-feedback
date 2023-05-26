import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/future/datastores
 */
const UsersDatastore = DefineDatastore({
  name: "users",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    user: {
      type: Schema.slack.types.user_id,
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    ts: {
      type: Schema.types.string,
    },
  },
});

export default UsersDatastore;

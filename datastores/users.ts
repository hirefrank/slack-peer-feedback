import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Simple datastore to collect the requestor and the channel
 * In the future I can send messages to each of these channels
 * if I have updates to the workflows.
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

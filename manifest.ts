import { Manifest } from "deno-slack-sdk/mod.ts";
import SetupPeerFeedbackWorkflow from "./workflows/setup.ts";
import PeerFeedbackWorkflow from "./workflows/feedback.ts";
import RequestFeedbackWorkflow from "./workflows/request.ts";
import StatsWorkflow from "./workflows/stats.ts";
import UsersDatastore from "./datastores/users.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Peer Feedback",
  description: "Quite possibly the easiest way to get peer feedback.",
  icon: "assets/feedback-white.png",
  functions: [],
  workflows: [
    SetupPeerFeedbackWorkflow,
    PeerFeedbackWorkflow,
    RequestFeedbackWorkflow,
    StatsWorkflow,
  ],
  datastores: [UsersDatastore],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:manage",
    "groups:write",
    "triggers:write",
    "pins:write",
    "datastore:read",
    "datastore:write",
  ],
});

import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncUserCreation, syncUserUpdate, syncUserDeletion } from "../../../inngest/functions";

// Create an API that serves all user sync functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        syncUserCreation,
        syncUserUpdate,
        syncUserDeletion,
    ],
});
// lib/webinyClient.ts
import { GraphQLClient } from "graphql-request";

const webinyEndpoint = process.env.NEXT_PUBLIC_WEBINY_API_URL!;

export const webinyClient = new GraphQLClient(webinyEndpoint, {
  headers: {
    // If Webiny needs authentication token later, add here
    // Authorization: `Bearer ${token}`
  },
});

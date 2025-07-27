// lib/webinyQueries.ts
import { gql } from "graphql-request";

export const GET_CAMPAIGN_BY_SLUG = gql`
  query GetCampaignBySlug($slug: String!) {
    getCampaign(slug: $slug) {
      data {
        id
        title
        description
        goal
        heroImage
        owner {
          id
          name
        }
      }
      error {
        message
      }
    }
  }
`;

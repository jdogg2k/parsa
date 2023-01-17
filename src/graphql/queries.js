/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSegment = /* GraphQL */ `
  query GetSegment($id: ID!) {
    getSegment(id: $id) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listSegments = /* GraphQL */ `
  query ListSegments(
    $filter: ModelSegmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSegments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCustomerinfo = /* GraphQL */ `
  query GetCustomerinfo($id: ID!) {
    getCustomerinfo(id: $id) {
      id
      segment
      customer_name
      annual_product_sales
      products_purchased
      cost_of_products
      services_purchased
      annual_service_sales
      cost_of_services
      createdAt
      updatedAt
    }
  }
`;
export const listCustomerinfos = /* GraphQL */ `
  query ListCustomerinfos(
    $filter: ModelCustomerinfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomerinfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        segment
        customer_name
        annual_product_sales
        products_purchased
        cost_of_products
        services_purchased
        annual_service_sales
        cost_of_services
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($filter: ModelSubscriptionNoteFilterInput) {
    onCreateNote(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($filter: ModelSubscriptionNoteFilterInput) {
    onUpdateNote(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($filter: ModelSubscriptionNoteFilterInput) {
    onDeleteNote(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSegment = /* GraphQL */ `
  subscription OnCreateSegment($filter: ModelSubscriptionSegmentFilterInput) {
    onCreateSegment(filter: $filter) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSegment = /* GraphQL */ `
  subscription OnUpdateSegment($filter: ModelSubscriptionSegmentFilterInput) {
    onUpdateSegment(filter: $filter) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSegment = /* GraphQL */ `
  subscription OnDeleteSegment($filter: ModelSubscriptionSegmentFilterInput) {
    onDeleteSegment(filter: $filter) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCustomerinfo = /* GraphQL */ `
  subscription OnCreateCustomerinfo(
    $filter: ModelSubscriptionCustomerinfoFilterInput
  ) {
    onCreateCustomerinfo(filter: $filter) {
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
export const onUpdateCustomerinfo = /* GraphQL */ `
  subscription OnUpdateCustomerinfo(
    $filter: ModelSubscriptionCustomerinfoFilterInput
  ) {
    onUpdateCustomerinfo(filter: $filter) {
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
export const onDeleteCustomerinfo = /* GraphQL */ `
  subscription OnDeleteCustomerinfo(
    $filter: ModelSubscriptionCustomerinfoFilterInput
  ) {
    onDeleteCustomerinfo(filter: $filter) {
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

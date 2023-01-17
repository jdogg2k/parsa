/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createSegment = /* GraphQL */ `
  mutation CreateSegment(
    $input: CreateSegmentInput!
    $condition: ModelSegmentConditionInput
  ) {
    createSegment(input: $input, condition: $condition) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateSegment = /* GraphQL */ `
  mutation UpdateSegment(
    $input: UpdateSegmentInput!
    $condition: ModelSegmentConditionInput
  ) {
    updateSegment(input: $input, condition: $condition) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteSegment = /* GraphQL */ `
  mutation DeleteSegment(
    $input: DeleteSegmentInput!
    $condition: ModelSegmentConditionInput
  ) {
    deleteSegment(input: $input, condition: $condition) {
      id
      userID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createCustomerinfo = /* GraphQL */ `
  mutation CreateCustomerinfo(
    $input: CreateCustomerinfoInput!
    $condition: ModelCustomerinfoConditionInput
  ) {
    createCustomerinfo(input: $input, condition: $condition) {
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
export const updateCustomerinfo = /* GraphQL */ `
  mutation UpdateCustomerinfo(
    $input: UpdateCustomerinfoInput!
    $condition: ModelCustomerinfoConditionInput
  ) {
    updateCustomerinfo(input: $input, condition: $condition) {
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
export const deleteCustomerinfo = /* GraphQL */ `
  mutation DeleteCustomerinfo(
    $input: DeleteCustomerinfoInput!
    $condition: ModelCustomerinfoConditionInput
  ) {
    deleteCustomerinfo(input: $input, condition: $condition) {
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

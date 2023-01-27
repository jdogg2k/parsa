/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCustomer = /* GraphQL */ `
  mutation CreateCustomer(
    $input: CreateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    createCustomer(input: $input, condition: $condition) {
      id
      name
      segmentID
      CustomerData {
        items {
          id
          row_num
          product_name
          cost_of_goods_sold
          unit_revenue
          service_revenue
          cost_of_services
          quantity
          customerID
          services_purchased
          service_type
          transaction_date
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateCustomer = /* GraphQL */ `
  mutation UpdateCustomer(
    $input: UpdateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    updateCustomer(input: $input, condition: $condition) {
      id
      name
      segmentID
      CustomerData {
        items {
          id
          row_num
          product_name
          cost_of_goods_sold
          unit_revenue
          service_revenue
          cost_of_services
          quantity
          customerID
          services_purchased
          service_type
          transaction_date
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteCustomer = /* GraphQL */ `
  mutation DeleteCustomer(
    $input: DeleteCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    deleteCustomer(input: $input, condition: $condition) {
      id
      name
      segmentID
      CustomerData {
        items {
          id
          row_num
          product_name
          cost_of_goods_sold
          unit_revenue
          service_revenue
          cost_of_services
          quantity
          customerID
          services_purchased
          service_type
          transaction_date
          createdAt
          updatedAt
        }
        nextToken
      }
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
      Customers {
        items {
          id
          name
          segmentID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      Customers {
        items {
          id
          name
          segmentID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      Customers {
        items {
          id
          name
          segmentID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createCustomerData = /* GraphQL */ `
  mutation CreateCustomerData(
    $input: CreateCustomerDataInput!
    $condition: ModelCustomerDataConditionInput
  ) {
    createCustomerData(input: $input, condition: $condition) {
      id
      row_num
      product_name
      cost_of_goods_sold
      unit_revenue
      service_revenue
      cost_of_services
      quantity
      customerID
      services_purchased
      service_type
      transaction_date
      createdAt
      updatedAt
    }
  }
`;
export const updateCustomerData = /* GraphQL */ `
  mutation UpdateCustomerData(
    $input: UpdateCustomerDataInput!
    $condition: ModelCustomerDataConditionInput
  ) {
    updateCustomerData(input: $input, condition: $condition) {
      id
      row_num
      product_name
      cost_of_goods_sold
      unit_revenue
      service_revenue
      cost_of_services
      quantity
      customerID
      services_purchased
      service_type
      transaction_date
      createdAt
      updatedAt
    }
  }
`;
export const deleteCustomerData = /* GraphQL */ `
  mutation DeleteCustomerData(
    $input: DeleteCustomerDataInput!
    $condition: ModelCustomerDataConditionInput
  ) {
    deleteCustomerData(input: $input, condition: $condition) {
      id
      row_num
      product_name
      cost_of_goods_sold
      unit_revenue
      service_revenue
      cost_of_services
      quantity
      customerID
      services_purchased
      service_type
      transaction_date
      createdAt
      updatedAt
    }
  }
`;

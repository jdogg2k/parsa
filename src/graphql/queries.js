/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCustomer = /* GraphQL */ `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
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
export const listCustomers = /* GraphQL */ `
  query ListCustomers(
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        segmentID
        CustomerData {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const customersBySegmentID = /* GraphQL */ `
  query CustomersBySegmentID(
    $segmentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    customersBySegmentID(
      segmentID: $segmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        segmentID
        CustomerData {
          nextToken
        }
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
        Customers {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCustomerData = /* GraphQL */ `
  query GetCustomerData($id: ID!) {
    getCustomerData(id: $id) {
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
export const listCustomerData = /* GraphQL */ `
  query ListCustomerData(
    $filter: ModelCustomerDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomerData(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const customerDataByCustomerID = /* GraphQL */ `
  query CustomerDataByCustomerID(
    $customerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCustomerDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    customerDataByCustomerID(
      customerID: $customerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;

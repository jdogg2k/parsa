/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCustomer = /* GraphQL */ `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      name
      customerGroupID
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
        customerGroupID
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
export const customersByCustomerGroupID = /* GraphQL */ `
  query CustomersByCustomerGroupID(
    $customerGroupID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    customersByCustomerGroupID(
      customerGroupID: $customerGroupID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        customerGroupID
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
export const getCustomerGroup = /* GraphQL */ `
  query GetCustomerGroup($id: ID!) {
    getCustomerGroup(id: $id) {
      id
      userID
      name
      description
      Customers {
        items {
          id
          name
          customerGroupID
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
export const listCustomerGroups = /* GraphQL */ `
  query ListCustomerGroups(
    $filter: ModelCustomerGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomerGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

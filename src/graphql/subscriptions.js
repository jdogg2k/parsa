/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCustomer = /* GraphQL */ `
  subscription OnCreateCustomer($filter: ModelSubscriptionCustomerFilterInput) {
    onCreateCustomer(filter: $filter) {
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
export const onUpdateCustomer = /* GraphQL */ `
  subscription OnUpdateCustomer($filter: ModelSubscriptionCustomerFilterInput) {
    onUpdateCustomer(filter: $filter) {
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
export const onDeleteCustomer = /* GraphQL */ `
  subscription OnDeleteCustomer($filter: ModelSubscriptionCustomerFilterInput) {
    onDeleteCustomer(filter: $filter) {
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
export const onCreateCustomerGroup = /* GraphQL */ `
  subscription OnCreateCustomerGroup(
    $filter: ModelSubscriptionCustomerGroupFilterInput
  ) {
    onCreateCustomerGroup(filter: $filter) {
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
export const onUpdateCustomerGroup = /* GraphQL */ `
  subscription OnUpdateCustomerGroup(
    $filter: ModelSubscriptionCustomerGroupFilterInput
  ) {
    onUpdateCustomerGroup(filter: $filter) {
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
export const onDeleteCustomerGroup = /* GraphQL */ `
  subscription OnDeleteCustomerGroup(
    $filter: ModelSubscriptionCustomerGroupFilterInput
  ) {
    onDeleteCustomerGroup(filter: $filter) {
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
export const onCreateCustomerData = /* GraphQL */ `
  subscription OnCreateCustomerData(
    $filter: ModelSubscriptionCustomerDataFilterInput
  ) {
    onCreateCustomerData(filter: $filter) {
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
export const onUpdateCustomerData = /* GraphQL */ `
  subscription OnUpdateCustomerData(
    $filter: ModelSubscriptionCustomerDataFilterInput
  ) {
    onUpdateCustomerData(filter: $filter) {
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
export const onDeleteCustomerData = /* GraphQL */ `
  subscription OnDeleteCustomerData(
    $filter: ModelSubscriptionCustomerDataFilterInput
  ) {
    onDeleteCustomerData(filter: $filter) {
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

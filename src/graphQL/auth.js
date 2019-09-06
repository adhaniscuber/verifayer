import gql from 'graphql-tag'

export const LOGIN_QUERY = gql`
  mutation LoginQuery($input: LoginInput!) {
    Login(input: $input) {
      _id
      token
      email
      roles
      manager
      company
      profile {
        first_name
        last_name
        image
        marital_status
      }
    }
  }
`
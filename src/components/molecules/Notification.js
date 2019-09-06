import React from 'react'
import styled from 'styled-components'
import Loading from '../atoms/Loading'
import { colors } from '../variables'

const Icon = styled(Loading)`
  max-width: 64px;
  background-color: ${colors.primary};
`

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  margin: 16px;
  background-color: white;
  padding: 32px;
  min-width: 240px;
  box-shadow: 4px 4px 8px -5px ${colors.shadows};
`

const Notification = ({ message, handleClose }) => {
  return (
    <Wrapper>
      <Icon />
      <p>{message}</p>
      <Icon onClick={handleClose} />
    </Wrapper>
  )
} 

export default Notification

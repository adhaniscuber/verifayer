import React from 'react'
import styled from 'styled-components'
import puff from '../../assets/puff.svg'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: auto;
  display: grid;
`

const Icon = styled.img``

const Loading = () => (
  <Wrapper>
    <Icon src={puff} alt='loading' />
  </Wrapper>
)

export default Loading

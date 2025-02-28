import images from 'assets/images/Images'
import React from 'react'
import MainCard from 'ui-component/cards/MainCard'

const Template3 = () => {
  return (
    <MainCard title="1-ICYMI" contentSX={{padding:2}}>
      <img src={images.ICYMI_Internal} alt='Template 3'/>
    </MainCard>
  )
}

export default Template3

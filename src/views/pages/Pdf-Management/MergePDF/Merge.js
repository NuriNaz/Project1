import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import MainCard from 'ui-component/cards/MainCard'
import ComingSoon from 'views/pages/comingsoon/comingSoon'

const Merge = () => {
    const dispatch = useDispatch();
    useEffect(() => {
    dispatch({ type: MENU_OPEN, id: 'merge-pdf' });
  },[])
  return (
    <MainCard title="Merge PDF">
      <ComingSoon /> 
    </MainCard>
  )
}

export default Merge

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function Recovery() {
   useEffect(()=>{

   },[])
  return (
    <div className='container'>
    <div className='row'>
    <form className='col s12 offset-m1 m10 offset-l2 l8 offset-xl4 xl4 z-depth-3 p-5 mt-6 rounded-block' >
        <div className='row g-2'>
            
        <div class="col s12"><h4 className='center-align'>Восстановление пароля</h4></div>
        <div class="col s12 ">
            Введите адрес почты на которую зарегистрирован аккаунт
          </div>
          <div class="col s12 input-field outlined">
          <input id="email" type="text" placeholder=" " maxlength="50"/>
          <label for="email">Почта</label>
          </div>
          <div className='col s12'>
          <button class="btn s12 filled waves-effect waves-light full-width center-content">
            <p className='center-align'>Продолжить</p>
          </button>
          </div>
          <div className='col s12'>
            <div className='section'>
            <div class="divider"></div>
            <div className='row center-content g-2'>
              <Link to="/login">Войти в аккаунт</Link>
            </div>
            </div>
          </div>
      </div>
    </form>
    </div>
  </div>
  );
}

export default Recovery;

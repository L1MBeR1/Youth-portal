import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
   useEffect(()=>{

   },[])
  return (
    <div className='container'>
      <div className='row'>
      <form className='col s12 offset-m1 m10 offset-l2 l8 offset-xl4 xl4 z-depth-3 p-5 mt-6 rounded-block' >
          <div className='row g-2'>
          <div class="col s12"><h4 className='center-align'>Вход в аккаунт</h4></div>
            <div class="col s12 input-field outlined">
            <input id="email" type="text" placeholder=" " maxlength="50"/>
            <label for="email">Почта</label>
            </div>
            <div class="col s12 input-field outlined">
            <input id="password" type="text" placeholder=" " maxlength="50"/>
            <label for="password">Пароль</label>
            </div>
            <div class="col s12"><Link to="/recovery">Забыли пароль?</Link></div>
            <div className='col s12'>
            <button class="btn s12 filled waves-effect waves-light full-width center-content">
              <p className='center-align'>Войти</p>
            </button>
            </div>
            <div className='col s12'>
              <div className='section'>
              <div class="divider"></div>
              <div className='row center-content g-2'>
                <div>Нет аккаунта?</div>
                <Link to="/registration">Зарегистрироваться</Link>
              </div>
              </div>
            </div>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Login;

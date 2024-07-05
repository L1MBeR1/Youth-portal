import React, { useEffect, useRef,useState } from 'react';
import { Link } from 'react-router-dom';

import { M } from '../js/materialize';
function Registration() {
  const datepickerRef = useRef(null);
   useEffect(()=>{
    M.Datepicker.init(datepickerRef.current, {
      yearRange: 100
    });
   },[])
  return (
    <div className='container'>
    <div className='row'>
    <form className='col s12 offset-m1 m10 offset-l2 l8 offset-xl4 xl4 z-depth-3 p-5 mt-6 rounded-block' >
        <div className='row g-2'>
        <div class="col s12"><h4 className='center-align'>Регистрация</h4></div>
          <div class="col s12 input-field outlined">
          <input id="surname" type="text" placeholder=" " maxlength="50"/>
          <label for="last_name">Фамилия</label>
          </div>
          <div class="col s12 input-field outlined">
          <input id="name" type="text" placeholder=" " maxlength="50"/>
          <label for="name">Имя</label>
          </div>
          <div class="col s12 input-field outlined">
          <input id="patronymic" type="text" placeholder=" " maxlength="50"/>
          <label for="patronymic">Отчество</label>
          </div>
          <div className="input-field col s12 outlined">
          <input ref={datepickerRef} id="birthdate" type="text" placeholder=" " className="datepicker" />
          <label htmlFor="birthdate">Дата рождения</label>
          </div> 
          <div class="col s12 input-field outlined">
          <input id="login" type="text" placeholder=" " maxlength="50"/>
          <label for="login">Логин</label>
          </div>
          <div class="col s12 input-field outlined">
          <input id="email" type="text" placeholder=" " maxlength="50"/>
          <label for="email">Почта</label>
          </div>
          <div class="col s12 input-field outlined">
          <input id="password" type="text" placeholder=" " maxlength="50"/>
          <label for="password">Пароль</label>
          </div>
          <div className='col s12'>
          <button class="btn s12 filled waves-effect waves-light full-width center-content">
            <p className='center-align'>Зарегистрироваться</p>
          </button>
          </div>
          <div className='col s12'>
            <div className='section'>
            <div class="divider"></div>
            <div className='row center-content g-2'>
              <div>Уже есть аккаунт?</div>
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

export default Registration;

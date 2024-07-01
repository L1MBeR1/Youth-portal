// src/Header.js
import React,{useEffect}from 'react';
import { Link } from 'react-router-dom';
import {M} from '../js/materialize';

function Header() {
    useEffect(() => {

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});

        },[])
  return (
    <header className='navbar-fixed'>
        <nav>
            <div className="nav-wrapper  grey darken-3">
                <Link to="/" className="brand-logo">Logo</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    <li><Link to="/login">Войти</Link></li>
                    <li><Link to="/login">Регистрация</Link></li>
                </ul>
            </div>
        </nav>

        <ul className="sidenav" id="mobile-demo">
            <li><Link to="/login">Войти</Link></li>
            <li><Link to="/login">Регистрация</Link></li>

        </ul>
    </header>
  );
}

export default Header;
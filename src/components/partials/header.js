import React,{useRef,useEffect}from 'react';
import { Link } from 'react-router-dom';
import {M} from '../../js/materialize';

function Header() {
    const header  = useRef(null);
    useEffect(() => {

        M.Sidenav.init(header.current, {});

        },[])
  return (
    <header >
        <nav className='navbar-fixed'>
            <div className="nav-wrapper  grey darken-3">
                <Link to="/" className="brand-logo">Logo</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    <li><Link to="/login">Войти</Link></li>
                    <li><Link to="/registration">Регистрация</Link></li>
                </ul>
            </div>
        </nav>

        <ul ref={header} className="sidenav" id="mobile-demo">
            <li><Link to="/login">Войти</Link></li>
            <li><Link to="/registration">Регистрация</Link></li>

        </ul>
    </header>
  );
}

export default Header;
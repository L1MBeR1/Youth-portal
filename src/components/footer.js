// src/Header.js
import React from 'react';

function Header() {
  return (
        <footer className="page-footer">
        <div className="container">
            <div className="row">
            <div className="l6 s12">
                <h5>Footer Content</h5>
                <p>You can use rows and columns here to organize your footer content.</p>
            </div>
            <div className="l4 offset-l8 s12">
                <h5>Links</h5>
                <ul>
                <li><a href="#!">Link 1</a></li>
                <li><a href="#!">Link 2</a></li>
                <li><a href="#!">Link 3</a></li>
                <li><a href="#!">Link 4</a></li>
                </ul>
            </div>
            </div>
        </div>
        <div className="footer-copyright">
            <div className="container">
            © 2014 Copyright Text
            <a className="right" href="#!">More Links</a>
            </div>
        </div>
        </footer>
  );
}

export default Header;
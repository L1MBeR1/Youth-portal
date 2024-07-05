import React from 'react';
import BlankImage from '../img/blank.png'
function EventCart(props) {
    return (
        <div class="col s12 m6">
            <div class="card medium">
            <div class="card-image">
                <img src={BlankImage}/>
            
            </div>
            <div class="card-content">
                <span class="card-title">{props.title}</span>
                <p>{props.description}</p>
            </div>
            </div>
        </div>
    );
  }
  
  export default EventCart;
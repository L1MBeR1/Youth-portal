import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/carousel.css'; 

const NextArrow = (props) => {
  const { className, style,onClick } = props;
  return (
    <div
      className={`${className} custom-arrow`}
      style={{...style,display: 'block' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};
const Carousel = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay:true,
    autoplaySpeed: 3500,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1650,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index} className="carousel-item">
          {item}
        </div>
      ))}
    </Slider>
  );
};


export default Carousel;

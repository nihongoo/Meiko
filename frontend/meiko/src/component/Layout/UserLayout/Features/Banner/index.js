import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "../../styles/styles";
import { BaseLinkWhite } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import CustomNextArrow from "../common/CustomNextArrow";
import CustomPrevArrow from "../common/CustomPrevArrow";

const SectionHeroWrapper = styled.section`
  background-color: #f2f2f2;
`;

const HeroSliderWrapper = styled.div`
  .custom-prev-arrow {
    left: 30px !important;
    background-color: ${defaultTheme.color_white};
    svg {
      color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.md}) {
      left: 16px !important;
    }
  }

  .custom-next-arrow {
    right: 30px !important;
    background-color: ${defaultTheme.color_white};
    svg {
      color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.md}) {
      right: 16px !important;
    }
  }
`;

const HeroSliderItemWrapper = styled.div`
  position: relative;
  height: 600px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${defaultTheme.color_black_04};
  }

  img {
    display: block;
  }
`;

const HeroSlideContent = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1100px;
  z-index: 10;

  .btn {
    height: 42px;
    min-width: 120px;
    margin-top: 20px;
    @media (max-width: ${breakpoints.md}) {
      margin-top: 12px;
    }
  }

  .container {
    max-width: 840px;
    margin-left: 0;

    @media (max-width: ${breakpoints.xxl}) {
      margin-left: 80px;
    }
    @media (max-width: ${breakpoints.md}) {
      margin-left: 16px;
      margin-right: 16px;
    }
    @media (max-width: ${breakpoints.sm}) {
      margin: 0;
      text-align: center;
    }
  }

  .hero-text-top {
    padding-top: 100px;
    font-size: 32px;
    color: rgba(var(--bs-white-rgb), var(--bs-text-opacity));

    @media (max-width: ${breakpoints.lg}) {
      font-size: 26px;
    }
  }

  .hero-text-large {
    font-size: 78px;
    letter-spacing: 0.315px;
    line-height: 1.2;
    margin-bottom: 20px;

    @media (max-width: ${breakpoints.lg}) {
      font-size: 60px;
    }
    @media (max-width: ${breakpoints.lg}) {
      font-size: 48px;
    }
    @media (max-width: ${breakpoints.lg}) {
      font-size: 36px;
    }
    @media (max-width: ${breakpoints.lg}) {
      font-size: 32px;
    }
  }

  .hero-text-bottom {
    font-size: 26px;
    margin-bottom: 24px;
    color: rgba(var(--bs-white-rgb), var(--bs-text-opacity));

    @media (max-width: ${breakpoints.lg}) {
      font-size: 20px;
    }
  }

  .hero-btn {
    font-size: 18px;
    height: 46px;
    min-width: 160px;
  }
`;

const Hero = () => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };
  const bannerData = [
    {
      id: 1,
      imgSource: "https://res.cloudinary.com/dtsqxauba/image/upload/v1733486335/Banner1_ffqb2v.jpg",
      topText: "Khuyến mãi đặc biệt",
      titleText: "Mua Túi Xách Hàng Hiệu",
      bottomText: "Giảm ngay 20% khi mua hôm nay",
      buttonLink: "/collections/tui-xach-nu",
      buttonText: "Khám Phá Ngay",
    },
    {
      id: 3,
      imgSource: "https://res.cloudinary.com/dtsqxauba/image/upload/v1733486335/Banner2_ewdjzl.png",
      topText: "Sản phẩm mới",
      titleText: "Túi Xách Công Sở Thanh Lịch",
      bottomText: "Vừa vặn, Tiện lợi, Thời trang",
      buttonLink: "/collections/tui-xach-cong-so",
      buttonText: "Xem Ngay",
    },
  ];
  
  return (
    <SectionHeroWrapper>
      <HeroSliderWrapper>
        <Slider
          nextArrow={<CustomNextArrow />}
          prevArrow={<CustomPrevArrow />}
          {...settings}
        >
          {bannerData?.map((banner) => {
            return (
              <HeroSliderItemWrapper key={banner.id}>
                <img src={banner.imgSource} className="" />
                <HeroSlideContent className="flex items-center">
                  <Container className="container text-white">
                    <p className="hero-text-top font-bold italic">
                      {banner.topText}
                    </p>
                    <h2 className="hero-text-large font-extrabold">
                      {banner.titleText}
                    </h2>
                    <p className="hero-text-bottom font-semibold uppercase">
                      {banner.bottomText}
                    </p>
                    <BaseLinkWhite to={banner.buttonLink} className="hero-btn">
                      {banner.buttonText}
                    </BaseLinkWhite>
                  </Container>
                </HeroSlideContent>
              </HeroSliderItemWrapper>
            );
          })}
        </Slider>
      </HeroSliderWrapper>
    </SectionHeroWrapper>
  );
};

export default Hero;

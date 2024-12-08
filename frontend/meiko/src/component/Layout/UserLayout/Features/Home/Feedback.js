import styled from "styled-components";
import { Container, Section } from "../../styles/styles";
import Title from "../common/Title";
import Slider from "react-slick";
import CustomNextArrow from "../common/CustomNextArrow";
import CustomPrevArrow from "../common/CustomPrevArrow";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const feedbackData = [
  {
    id: "feedback-1",
    imgSource: "",
    name: "Nguyễn Văn A",
    designation: "Giám đốc Marketing",
    rating: 3,
    feedbackText:
      "Tôi vô cùng hài lòng với trải nghiệm mua sắm gần đây trên trang thương mại điện tử này. Giao diện dễ sử dụng giúp tôi dễ dàng duyệt qua rất nhiều lựa chọn thời trang đa dạng. Sự đa dạng về kích thước và kiểu dáng thật ấn tượng, và tôi đã tìm được bộ trang phục hoàn hảo cho một dịp đặc biệt.",
  },
  {
    id: "feedback-2",
    imgSource: "",
    name: "Nguyễn Văn B",
    designation: "Giáo viên",
    rating: 4,
    feedbackText:
      "Trang web này đã trở thành điểm đến yêu thích của tôi khi tìm kiếm những món đồ thời trang. Bộ sưu tập rất đa dạng, đáp ứng được nhiều sở thích khác nhau. Từ trang phục thường ngày cho đến các món đồ thanh lịch, tôi luôn tìm được những món độc đáo và hợp thời trang. Giao diện của trang web rõ ràng, dễ dàng để chọn lựa.",
  },
  {
    id: "feedback-3",
    imgSource: "",
    name: "Nguyễn Văn C",
    designation: "Sinh viên",
    rating: 4,
    feedbackText:
      "Tôi muốn gửi lời cảm ơn đến đội ngũ hỗ trợ khách hàng của trang web này. Không chỉ giao diện dễ sử dụng, mà đội ngũ chăm sóc khách hàng còn nhiệt tình hỗ trợ tôi khi tôi có câu hỏi cần giải đáp.",
  },
  {
    id: "feedback-4",
    imgSource: "",
    name: "Nguyễn Văn D",
    designation: "Nhà thiết kế thời trang",
    rating: 4,
    feedbackText:
      "Tôi vừa mua sắm từ trang web này và rất hài lòng với trải nghiệm của mình. Trang web được thiết kế rất dễ dàng để tìm kiếm và duyệt qua các sản phẩm. Mô tả sản phẩm rất chi tiết giúp tôi đưa ra quyết định mua sắm chính xác.",
  },
];

const FeedbackItemWrapper = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  @media (max-width: ${breakpoints.sm}) {
    padding: 0;
  }

  .feedback-item-wrap {
  border-radius: 10px;
  border: 1px solid ${defaultTheme.color_platinum};
  padding: 20px;
  height: 320px;
  transition: ${defaultTheme.default_transition};
  
  /* Màu mặc định của chữ */
  color: ${defaultTheme.color_black};

  /* Các thuộc tính này không thay đổi khi hover */
  .rating {
    color: ${defaultTheme.color_black};
  }

  .feedback-icon {
    border-color: ${defaultTheme.color_black};
  }

  .feedback-body,
  .feedback-intro {
    p,
    span {
      color: ${defaultTheme.color_black};
    }
  }
}


  .feedback-top {
    column-gap: 18px;
  }

  .feedback-icon {
    border-radius: 100%;
    overflow: hidden;
    border: 2px solid ${defaultTheme.color_white};

    img {
      scale: 1.1;
    }
  }

  .rating {
    margin: 14px 0;
    column-gap: 4px;
  }
`;

const Feedback = () => {
  const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Section>
      <Container>
        <Title titleText={"Phản Hồi Khách Hàng"} />
        <Slider
          nextArrow={<CustomNextArrow />}
          prevArrow={<CustomPrevArrow />}
          {...settings}
        >
          {feedbackData?.map((feedback) => {
            return (
              <FeedbackItemWrapper key={feedback.id}>
                <div className="feedback-item-wrap bg-white">
                  <div className="feedback-top flex items-center">
                    <div className="feedback-icon">
                      <img
                        src={feedback.imgSource}
                        className="object-fit-cover"
                        alt=""
                      />
                    </div>
                    <div className="feedback-intro">
                      <p className="font-semibold text-base">{feedback.name}</p>
                      <span className="text-sm">{feedback.designation}</span>
                    </div>
                  </div>
                  <ul className="rating text-yellow flex items-center">
                    {[...Array(feedback.rating).keys()].map((index) => (
                      <li key={index}>
                        <i className="bi bi-star-fill"></i>
                      </li>
                    ))}
                    {[...Array(5 - feedback.rating).keys()].map((index) => (
                      <li key={index + feedback.rating}>
                        <i className="bi bi-star"></i>
                      </li>
                    ))}
                  </ul>
                  <div className="feedback-body text-gray">
                    <p className="text-base">{feedback.feedbackText}</p>
                  </div>
                </div>
              </FeedbackItemWrapper>
            );
          })}
        </Slider>
      </Container>
    </Section>
  );
};

export default Feedback;

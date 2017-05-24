import './Slider.styl';

import React, {
  Component,
  PropTypes as Type,
} from 'react';

export default class ImageSlider extends Component {
  /**
   * Validates passed properties
   */
  static propTypes = {
    slides: Type.arrayOf(Type.object),
    descriptionHtml: Type.string
  };

  constructor() {
    super();

    this.slideBack = ::this.slideBack;
    this.slideForward = ::this.slideForward;

    this.state = {
      activeSlideIndex: 0
    };
  }

  setActiveIndex(activeSlideIndex) {
    this.setState({
      activeSlideIndex
    });
  }

  slideBack() {
    const slidesLength = this.props.slides.length;
    const { activeSlideIndex } = this.state;

    const newActiveIndex = (activeSlideIndex + slidesLength - 1) % slidesLength;

    this.setActiveIndex(newActiveIndex);
  }

  slideForward() {
    const slidesLength = this.props.slides.length;
    const { activeSlideIndex } = this.state;

    const newActiveIndex = (activeSlideIndex + slidesLength + 1) % slidesLength;

    this.setActiveIndex(newActiveIndex);
  }

  /**
   * Renders 'ImageSlider' component
   */
  render() {
    const { activeSlideIndex } = this.state;
    const { slides, descriptionHtml } = this.props;

    return (
      <div className="c-image-slider">
        <div>
          <div className="slides-container">
            <div
              className="slides"
              style={{ left: `-${ activeSlideIndex * 100 }%` }}
            >
              {
                slides.map((slide, index) => (
                  <div
                    key={index}
                    className="slide"
                  >
                    <div className="slide-inner">
                      <img src={slide.url} alt="" />
                    </div>
                  </div>
                ))
              }
            </div>
            <div
              className="arrow left"
              onClick={this.slideBack}
            >
              <div className="chevron-arrow-left"></div>
            </div>
            <div
              className="arrow right"
              onClick={this.slideForward}
            >
              <div className="chevron-arrow-right"></div>
            </div>
          </div>
          <div className="slider-footer">
            <div className="slides-text-container">
              <div
                className="slide-text"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

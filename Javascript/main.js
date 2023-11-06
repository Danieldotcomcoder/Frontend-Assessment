import data from './data.js';

class Slider {
  constructor(elementId, data, autoPlay = false, autoPlayTime = 1) {
    this.element = this.createSliderElement(elementId);
    this.data = data;
    this.currentSlide = 0;
    this.autoPlay = autoPlay;
    this.autoPlayTime = autoPlayTime;
    this.isAnimating = false;
    this.init();
  }

  init = () => {
    this.createDots();
    this.createAutoPlayControl();
    this.addEventListeners();
    this.updateSlide();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  };

  startAutoPlay = () => {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayTime * 1000);
  };

  stopAutoPlay = () => {
    clearInterval(this.autoPlayInterval);
  };

  createSliderElement = (id) => {
    // Create slider element
    const slider = document.createElement('div');
    slider.id = id;
    slider.className = 'slider';

    // Create left arrow
    const leftArrow = document.createElement('img');
    leftArrow.className = 'left-arrow';
    leftArrow.src = './Images/left-arrow.png';
    slider.appendChild(leftArrow);

    // Create slide
    const slide = document.createElement('div');
    slide.className = 'slide';
    slider.appendChild(slide);

    // Create right arrow
    const rightArrow = document.createElement('img');
    rightArrow.className = 'right-arrow';
    rightArrow.src = './Images/right-arrow.png';
    slider.appendChild(rightArrow);

    // Append slider to main section
    const mainSection = document.querySelector('.main-section');
    mainSection.appendChild(slider);

    return slider;
  };

  createAutoPlayControl = () => {
    // Create auto-play control element
    const autoPlayControl = document.createElement('div');
    autoPlayControl.className = 'auto-play-control';

    // Create auto-play toggle button
    const autoPlayToggle = document.createElement('img');
    autoPlayToggle.className = 'auto-play-toggle';
    autoPlayToggle.src = this.autoPlay
      ? '../Images/pause-icon.png'
      : '../Images/play-icon.png';
    autoPlayControl.appendChild(autoPlayToggle);

    // Create auto-play time input
    const autoPlayTimeInput = document.createElement('input');
    autoPlayTimeInput.className = 'auto-play-time-input';
    autoPlayTimeInput.type = 'number';
    autoPlayTimeInput.min = '1';
    autoPlayTimeInput.value = this.autoPlayTime;
    autoPlayTimeInput.style.display = this.autoPlay ? 'flex' : 'none';

    autoPlayControl.appendChild(autoPlayTimeInput);

    // Append auto-play control to the slide element
    const slideElement = this.element.querySelector('.slide');
    slideElement.appendChild(autoPlayControl);

    // Add event listeners
    autoPlayToggle.addEventListener('click', () => {
      this.autoPlay = !this.autoPlay;
      autoPlayToggle.src = this.autoPlay
        ? '../Images/pause-icon.png'
        : '../Images/play-icon.png';
      autoPlayTimeInput.style.display = this.autoPlay ? 'flex' : 'none';
      if (this.autoPlay) {
        this.startAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    });

    autoPlayTimeInput.addEventListener('change', (event) => {
      this.autoPlayTime = event.target.value;
      if (this.autoPlay) {
        this.stopAutoPlay();
        this.startAutoPlay();
      }
    });
  };

  createDots = () => {
    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slide-dots';

    // Append dots container to the slide element
    const slideElement = this.element.querySelector('.slide');
    slideElement.appendChild(dotsContainer);

    // Create a dot for each slide
    for (let i = 0; i < this.data.length; i++) {
      const dot = document.createElement('img');
      dot.className = 'slide-dot';

      dot.src = './Images/greydot.png'; // Use the grey dot image by default

      dotsContainer.appendChild(dot);
    }
  };

  updateDots = () => {
    const dots = Array.from(this.element.querySelectorAll('.slide-dot'));
    dots.forEach((dot, i) => {
      dot.src = `./Images/${
        i === this.currentSlide ? 'blackdot' : 'greydot'
      }.png`;
      // Use the black dot image for the active slide and the grey dot image for all other slides
    });
  };

  addEventListeners = () => {
    const leftArrow = this.element.querySelector('.left-arrow');
    const rightArrow = this.element.querySelector('.right-arrow');

    // add on click EventListener for the dots
    this.element.querySelectorAll('.slide-dot').forEach((item, id) => {
      item.addEventListener('click', (event) => {
        this.goToSlide(id);
      });
    });

    // // add on click EventListener for the arrows
    leftArrow.addEventListener('click', this.prevSlide);
    rightArrow.addEventListener('click', this.nextSlide);
  };

  updateSlide = () => {
    const slideData = this.data[this.currentSlide];

    // Clear the current slide contents
    let slideContentElement = this.element.querySelector('.slide-content');
    if (!slideContentElement) {
      // If the slide content element doesn't exist, create it
      slideContentElement = document.createElement('div');
      slideContentElement.className = 'slide-content';
      this.element.querySelector('.slide').appendChild(slideContentElement);

      this.addSlideContents(slideData, slideContentElement);
    } else {
      slideContentElement.innerHTML = '';
      this.addSlideContents(slideData, slideContentElement);
    }
  };

  addSlideContents = (slideData, slideContentElement) => {
    // The order of elements the will be shwon
    const order = ['message', 'image', 'name', 'role', 'button'];

    // Add the contents in the specified order
    for (const key of order) {
      const value = slideData[key];

      // Created a new element for the data
      let dataElement;
      switch (key) {
        case 'message':
        case 'role':
          dataElement = document.createElement('p');
          break;
        case 'image':
          dataElement = document.createElement('img');
          dataElement.src = value;
          break;
        case 'name':
          dataElement = document.createElement('h2');
          break;
        case 'button':
          dataElement = document.createElement('button');
          dataElement.textContent = value || 'View CV Sample'; // Use a default value if none is provided
          break;
        default:
          continue; // Skip any keys that are not in the order array
      }
      dataElement.className = `slide-${key}`;
      if (key !== 'image' && key !== 'button') {
        dataElement.textContent = value;
      }

      // Append the data element to the slide content
      if (slideContentElement) {
        slideContentElement.appendChild(dataElement);
      }
    }

    this.updateDots();
  };

  animateSlideLeft = () => {
    return new Promise((resolve) => {
      // Animate the outgoing slide
      const oldSlideContentElement =
        this.element.querySelector('.slide-content');
      oldSlideContentElement.style.animation = 'slide-right 0.5s forwards';

      // Create a new slide content element for the incoming slide
      const newSlideContentElement = document.createElement('div');
      newSlideContentElement.className = 'slide-content';
      newSlideContentElement.style.animation = 'slide-in-left 0.5s forwards';
      this.element.querySelector('.slide').appendChild(newSlideContentElement);

      // Add the new contents
      this.addSlideContents(
        this.data[this.currentSlide],
        newSlideContentElement
      );

      // Remove the old slide after the animation finishes
      setTimeout(() => {
        oldSlideContentElement.remove();
        resolve();
      }, 300); // Animation time
    });
  };

  animateSlideRight = () => {
    return new Promise((resolve) => {
      // Animate the outgoing slide
      const oldSlideContentElement =
        this.element.querySelector('.slide-content');
      oldSlideContentElement.style.animation = 'slide-left 0.5s forwards';

      // Create a new slide content element for the incoming slide
      const newSlideContentElement = document.createElement('div');
      newSlideContentElement.className = 'slide-content';
      newSlideContentElement.style.animation = 'slide-in-right 0.5s forwards';
      this.element.querySelector('.slide').appendChild(newSlideContentElement);

      // Add the new contents
      this.addSlideContents(
        this.data[this.currentSlide],
        newSlideContentElement
      );

      // Remove the old slide after the animation finishes
      setTimeout(() => {
        oldSlideContentElement.remove();
        resolve();
      }, 300); // Animation time
    });
  };

  nextSlide = async () => {
    if (this.isAnimating) return;

    this.isAnimating = true;
    // Disable the arrows to prevent fast multiple clicks
    this.element.querySelector('.left-arrow').disabled = true;
    this.element.querySelector('.right-arrow').disabled = true;

    // Update the current slide index
    this.currentSlide = (this.currentSlide + 1) % this.data.length;

    // Animate and update the slide
    await this.animateSlideRight();

    // Enable the arrows after the animation finishes
    this.element.querySelector('.left-arrow').disabled = false;
    this.element.querySelector('.right-arrow').disabled = false;

    this.isAnimating = false;
  };

  prevSlide = async () => {
    if (this.isAnimating) return;

    this.isAnimating = true;
    // Disable the arrows to prevent fast multiple clicks
    this.element.querySelector('.left-arrow').disabled = true;
    this.element.querySelector('.right-arrow').disabled = true;

    // Update the current slide index
    this.currentSlide =
      (this.currentSlide - 1 + this.data.length) % this.data.length;

    // Animate and update the slide
    await this.animateSlideLeft();

    // Enable the arrows after the animation finishes
    this.element.querySelector('.left-arrow').disabled = false;
    this.element.querySelector('.right-arrow').disabled = false;

    this.isAnimating = false;
  };

  goToSlide = async (index) => {
    // If the index is the same as the current slide, do nothing
    if (index === this.currentSlide) {
      return;
    }

    // Ensure the index is within the bounds of the slides array
    if (index >= 0 && index < this.data.length && !this.isAnimating) {
      // Set the isAnimating flag to true
      this.isAnimating = true;

      // Determine the direction of navigation
      const direction = index > this.currentSlide ? 'right' : 'left';

      // Update the current slide index
      this.currentSlide = index;

      // Call the appropriate animation method based on the direction
      if (direction === 'right') {
        await this.animateSlideRight();
      } else {
        await this.animateSlideLeft();
      }

      // Update the slide display based on the new current slide
      this.updateSlide();

      // Set the isAnimating flag back to false
      this.isAnimating = false;
    }
  };
}

// Two instances of the component with different configuration per instance
new Slider('.slider1', data); // no autoplay
new Slider('.slider2', data, true, 3); // autoplay with custom time of 3 seconds.

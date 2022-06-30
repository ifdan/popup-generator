class PageVisit {
  #lastScrollTop = 0;
  #windowHeight = window.innerHeight;
  #containers = [document.querySelector('#intro-header'), document.querySelector('#container-modal-configuration')];

  init() {
    this.#sizeContainers(this.#containers, this.#windowHeight);
    // refactor
    document.querySelector('#modal-configuration').style.display = 'flex';
    this.#addWindowListener(this.#containers, this.#windowHeight);
  }

  #addWindowListener(containers, windowHeight) {
    this.#fadeBackground(windowHeight);
    const callback = this.#fadeBackground(windowHeight);
    document.addEventListener('scroll', callback);
    window.addEventListener('resize', () => {
      const windowHeight = window.innerHeight;
      this.#sizeContainers(containers, windowHeight)
      this.#fadeBackground(windowHeight);
    });
  }

  #fadeBackground(windowHeight) {
    const scrollEventCallback = () => {
      if (window.pageYOffset > 20) {
        const opacity = (window.pageYOffset / windowHeight).toString();
        document.body.style.background = `linear-gradient(rgba(245, 245, 245, ${opacity}), rgba(245, 245, 245, ${opacity})), rgba(14, 115, 179, 1)`;
      } else {
        // refactor
        if (document.querySelector('.build-component').style.display === 'flex') {
          document.body.style.background = `rgb(245, 245, 245)`;
        } else {
          document.body.style.background = `rgba(14, 115, 179, 1)`;
        }
      }
      this.#controlModalPlacement(scrollEventCallback);
    }
    scrollEventCallback();
    return scrollEventCallback;
  }

  #controlModalPlacement(scrollEventCallback) {
    const distance = window.scrollY;
    const modalContainer = document.querySelector('#container-modal-configuration');
    const modalHeading = document.querySelector('#modal-configuration-header');
    const modal = document.querySelector('#modal-configuration');
    const bounding = modalContainer.getBoundingClientRect();
    const scrollTopDistance = window.pageYOffset || document.documentElement.scrollTop;
    bounding.top >= 0 ? modal.style.transform = `translateY(${distance * 0.3}px)` : modal.style.transform = modal.style.transform;
    if (bounding.top <= 400 && bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      if (scrollTopDistance > this.#lastScrollTop) {
        this.#showContent(modal, modalContainer, modalHeading, scrollEventCallback);
        modalContainer.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      } else {
        this.#removeContent(modal, modalContainer, modalHeading);
      }
      this.#lastScrollTop = scrollTopDistance <= 0 ? 0 : scrollTopDistance;
    }
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }

  #showContent(modal, modalContainer, modalHeading, scrollEventCallback) {
    this.#changeHeadingDisplay([modalHeading], 'block', modal.getBoundingClientRect().y, modalContainer.style.height);
    new Promise(resolve => {
      setTimeout(resolve, 200);
    }).then(() => {
      this.#changeOpacity([modalHeading], '1');
      this.#startBuildDemo(modal, modalContainer, modalHeading, scrollEventCallback);
    }).then(() => {
      new Promise(resolve => {
        setTimeout(resolve, 200);
      }).then(() => {
        this.#addPulseAnimation(modal, modalHeading);
      });
    });
  }

  #removeContent(modal, modalContainer, modalHeading) {
    this.#changeOpacity([modalHeading], '0');
    this.#removePulseAnimation(modal, modalHeading);
    this.#cancelBuildDemo(modal, modalContainer);
    new Promise(resolve => {
      setTimeout(resolve, 200);
    }).then(() => {
      this.#changeHeadingDisplay([modalHeading], 'none', modal.getBoundingClientRect().y, modalContainer.style.height);
      this.#cancelModalDemo(modal);
    });
  }

  #changeOpacity(elements, opacity) {
    if (opacity === '1') {
      elements.forEach((element) => {
        element.style.opacity = '1';
      });
    } else {
      elements.forEach((element) => {
        element.style.opacity = '0';
      });
    }
  }

  #changeHeadingDisplay(elements, display, offsetSibling, offsetHeight) {
    const heightLength = offsetHeight.length - 2;
    const validString = parseInt(offsetHeight.slice(0, heightLength));
    const topPosition = `${(validString + offsetSibling) - 140}px`;
    const leftPosition = `${(window.innerWidth / 2) + 20}px`;
    if (display === 'block') {
      elements.forEach((element) => {
        element.style.display = 'block';
        element.style.top = topPosition;
        element.style.right = leftPosition;
      });
    } else {
      elements.forEach((element) => {
        element.style.display = 'none';
      });
    }
  }

  #startBuildDemo(modal, modalContainer, header, scrollEventCallback) {
    modalContainer.style.background = 'rgb(207, 207, 207)';
    modal.classList.add('special-hover');
    modal.style.width = '700px';
    modal.style.height = '400px';
    modal.addEventListener('click', () => {
      document.removeEventListener('scroll', scrollEventCallback);
      this.#removePulseAnimation(modal, header);
      this.#cancelBuildDemo(modal, modalContainer);
      document.querySelector('#intro-header').style.display = 'none';
      header.style.display = 'none';
      document.querySelectorAll('.container-build-btns-modal')[0].classList.add('col-xl-8');
      document.querySelector('#forced-demo').style.height = '100%';
      document.querySelectorAll('.container-build-control')[0].style.display = 'flex';
      document.querySelectorAll('.container-btn-tool')[0].style.display = 'flex';
      modal.style.transform = 'none';
      modal.style.bottom = '0';
    });
  }

  #addPulseAnimation(modal) {
    modal.style.animation = 'pulse 1.5s ease-out infinite';
  }

  #cancelBuildDemo(modal, modalContainer) {
    modalContainer.style.background = 'none';
    modal.classList.remove('special-hover');
  }

  #cancelModalDemo(modal) {
    modal.style.width = '650px';
    modal.style.height = '350px';
  }

  #removePulseAnimation(modal) {
    modal.style.animation = 'none';
  }
}

window.onload = () => new PageVisit().init();
class PageVisit {
  #lastScrollTop = 0;
  #windowHeight = window.innerHeight;
  #modal = document.querySelector('#modal-configuration');
  #modalContainer = document.querySelector('#container-modal-configuration');
  #modalHeading = document.querySelector('#modal-configuration-header');
  #containers = [document.querySelector('#intro-header'), document.querySelector('#container-modal-configuration')];

  init() {
    this.#sizeContainers(this.#containers, this.#windowHeight);
    this.#firstVisitShowModal();
    this.#addWindowListener(this.#modal, this.#modalContainer, this.#modalHeading, this.#containers, this.#windowHeight);
  }

  #addWindowListener(modal, modalContainer, header ,containers, windowHeight) {
    this.#fadeBackground(modal, modalContainer, header, windowHeight);

    const scrollCallback = this.#fadeBackground(modal, modalContainer, header, windowHeight);
    document.addEventListener('scroll', scrollCallback);

    const clickCallback = this.#showBuild(modal, modalContainer, header, scrollCallback);
    modal.addEventListener('click', clickCallback);    

    window.addEventListener('resize', () => {
      const windowHeight = window.innerHeight;
      this.#sizeContainers(containers, windowHeight)
      this.#fadeBackground(modal, modalContainer, header, windowHeight);
    });
  }

  #fadeBackground(modal, modalContainer, header, windowHeight) {
    const scrollEventCallback = () => {
      if (window.pageYOffset > 20) {
        const opacity = (window.pageYOffset / windowHeight).toString();
        document.body.style.background = `linear-gradient(rgba(245, 245, 245, ${opacity}), rgba(245, 245, 245, ${opacity})), rgba(14, 115, 179, 1)`;
      } else {
        this.#updateBackgroundColor();
      }
      this.#controlModalPlacement(modal, modalContainer, header, scrollEventCallback);
    }
    scrollEventCallback();
    return scrollEventCallback;
  }

  #controlModalPlacement(modal, header, modalContainer) {
    const distance = window.scrollY;
    const bounding = modalContainer.getBoundingClientRect();
    const scrollTopDistance = window.pageYOffset || document.documentElement.scrollTop;

    bounding.top >= 0 ? modal.style.transform = `translateY(${distance * 0.3}px)` : modal.style.transform = modal.style.transform;

    if (bounding.top <= 400 && bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      if (scrollTopDistance > this.#lastScrollTop) {
        this.#showContent(modal, modalContainer, header);
        modalContainer.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      } else {
        // breaking change here
        this.#removeContent(modal, modalContainer, header);
      }
      this.#lastScrollTop = scrollTopDistance <= 0 ? 0 : scrollTopDistance;
    }
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }

  #firstVisitShowModal() {
    document.querySelector('#modal-configuration').style.display = 'flex';
  };

  #updateBackgroundColor() {
    document.querySelector('.build-component').style.display === 'flex' ? document.body.style.background = `rgb(245, 245, 245)` : document.body.style.background = `rgba(14, 115, 179, 1)`;
  }

  #showContent(modal, modalContainer, modalHeading) {
    this.#changeHeadingDisplay(modalHeading, 'block', modal.getBoundingClientRect().y, modalContainer.style.height);

    new Promise(resolve => {
      setTimeout(resolve, 200);
    }).then(() => {
      this.#changeOpacity(modalHeading, '1');
      this.#startBuildDemo(modal, modalContainer, modalHeading);
    }).then(() => {
      new Promise(resolve => {
        setTimeout(resolve, 200);
      }).then(() => {
        this.#addPulseAnimation(modal, modalHeading);
      });
    });
  }

  #removeContent(modal, modalContainer, modalHeading) {
    this.#changeOpacity(modalHeading, '0');
    this.#removePulseAnimation(modal, modalHeading);
    this.#cancelBuildDemo(modal, modalContainer);
    new Promise(resolve => {
      setTimeout(resolve, 200);
    }).then(() => {
      this.#changeHeadingDisplay(modalHeading, 'none', modal.getBoundingClientRect().y, modalContainer.style.height);
      this.#cancelModalDemo(modal);
    });
  }

  #changeOpacity(element, opacity) {
    opacity === '1' ? element.style.opacity = '1' : element.style.opacity = '0';
  }

  #changeHeadingDisplay(header, display, offsetSibling, offsetHeight) {
    const heightLength = offsetHeight.length - 2;
    const validString = parseInt(offsetHeight.slice(0, heightLength));
    const topPosition = `${(validString + offsetSibling) - 140}px`;
    const leftPosition = `${(window.innerWidth / 2) + 20}px`;
    if (display === 'block') {
      header.style.display = 'block';
      header.style.top = topPosition;
      header.style.right = leftPosition;
    } else {
      header.style.display = 'none';
    }
  }

  #startBuildDemo(modal, modalContainer) {
    modalContainer.style.background = 'rgb(207, 207, 207)';
    modal.style.width = '700px';
    modal.style.height = '400px';
  }

  #addPulseAnimation(modal) {
    modal.style.animation = 'pulse 1.5s ease-out infinite';
  }

  #cancelBuildDemo(modalContainer) {
    modalContainer.style.background = 'none';
  }

  #cancelModalDemo(modal) {
    modal.style.width = '650px';
    modal.style.height = '350px';
  }

  #removePulseAnimation(modal) {
    modal.style.animation = 'none';
  }

  #showBuild(modal, modalContainer, header, scrollEventCallback) {
    const showBuildCallback = () => {
      document.removeEventListener('scroll', scrollEventCallback);
      this.#removePulseAnimation(modal, header);
      this.#cancelBuildDemo(modal, modalContainer);
      document.querySelector('#intro-header').style.display = 'none';
      document.querySelectorAll('.container-build-btns-modal')[0].classList.add('col-xl-8');
      document.body.style.background = `rgb(245, 245, 245)`;
      document.querySelector('#forced-demo').style.height = '100%';
      document.querySelectorAll('.container-build-control')[0].style.display = 'flex';
      document.querySelectorAll('.container-btn-tool')[0].style.display = 'flex';
      header.style.display = 'none';
      modal.classList.remove('build-hover');
      modal.style.transform = 'none';
      modal.style.bottom = '0';
      this.#modalBuildButtons();
    }
    return showBuildCallback;
  }

  #modalBuildButtons() {
    const button = document.querySelector('#build-test');
    button.addEventListener('click', e => {
      document.querySelector('.second-build-control').style.display = 'block';
      document.querySelector('.main-build-control').style.display = 'none';
    });
  }
}

window.onload = () => new PageVisit().init();
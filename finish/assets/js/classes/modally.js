class Modally {

    constructor(config) {
        this.animations = ['fade-up', 'fade-down'];
        this.triggerDataAttLabel = 'data-modally-trigger';
        this.closerDataAttLabel = 'data-modally-close';
        this.modalDataAttLabel = 'data-modally-id';
        this.showModalCSS = 'show-modal';
        this.options = {
            blur: true,
            centered: true,
            animation: this.animations[0]
        }
        this.currentModal = '';

        if (typeof config === 'object') {
            this.options = {...this.options, ...config}
        }
        

        //call our init function
        this.init();
    }

    // Run our init 
    init() {
        this.setupTriggers();
        this.setupClosers();
        this.setupModalClasses();
    }

    // setup triggers
    setupTriggers() {
        const triggers = document.querySelectorAll(`[${this.triggerDataAttLabel}]`);

        if (triggers.length > 0) {
            triggers.forEach((trigger) => {
                trigger.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.openModal({ modalID: event.target.getAttribute(`${this.triggerDataAttLabel}`)});
                });
            })
        }
    }

    // setup closers
    setupClosers() {
        const modals = document.querySelectorAll(`[${this.modalDataAttLabel}]`);
        const closeBtns = document.querySelectorAll(`[${this.closerDataAttLabel}]`);

        if (modals.length > 0) {
            modals.forEach((modal) => {
                modal.querySelector('.modally-backdrop').addEventListener('click', (event) => {
                    this.closeModal({ modalID: event.target.parentElement.getAttribute(`${this.modalDataAttLabel}`) });
                })
            });
        }

        if (closeBtns.length > 0) {
            closeBtns.forEach((btn) => {
                btn.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.closeModal({ modalID: event.target.getAttribute(`${this.closerDataAttLabel}`) })
                })
            })
        }        
    }

    // setup our modal classes
    setupModalClasses() {
        const modals = document.querySelectorAll(`[${this.modalDataAttLabel}]`);
        if (modals.length > 0) {
            modals.forEach((modal) => {
                modal.classList.add(...this.calculateModalClasses());
            });
        }
    }

    // calculate modal classes
    calculateModalClasses() {
        const cssClasses = [];

        if (this.options.centered) {
            cssClasses.push('modal-centered');
        }

        if (this.options.blur) {
            cssClasses.push('modal-blur');
        }

        if (this.isValidAnimation(this.options.animation)) {
            cssClasses.push(this.options.animation);
        } else {
            cssClasses.push(this.animations[0]);
        }

        return cssClasses;
    }

    // check if animation is valid
    isValidAnimation(animation) {
        return this.animations.includes(animation);
    }

    // open modal
    openModal({ modalID }) {
        const modal = document.querySelector(`[${this.modalDataAttLabel}=${modalID}]`);

        if (this.currentModal.length > 0) {
            this.closeModal({ modalID: this.currentModal });
        }

        this.handleCustomEvent({ type: 'before_open', modal });
        modal.classList.add(this.showModalCSS);
        this.currentModal = modalID;
        this.handleCustomEvent({ type: 'after_open', modal });
    }

    // close modal
    closeModal({ modalID }) {
        const modal = document.querySelector(`[${this.modalDataAttLabel}=${modalID}]`);

        this.handleCustomEvent({ type: 'before_close', modal });
        modal.classList.remove(this.showModalCSS);
        this.currentModal = '';
        this.handleCustomEvent({ type: 'after_close', modal });
    }

    // handle our custom event
    handleCustomEvent({ type, modal }) {
        const event = new CustomEvent(type, { bubbles: true, detail: modal });
        modal.dispatchEvent(event);
    }
}
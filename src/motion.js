export const slideIn = (direction, delay) => ({
  initial: {
    y: direction === "up" ? 30 : -30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: delay * 0.1,
      duration: 0.45,
      ease: 'easeOut',
    },
  },
});

export const fadeIn = (direction, index) => ({
  initial: {
    y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  animate: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: index == null ? 1 : index * 0.05,
      ease: 'easeOut',
    },
  },
});

export const zoomIn = (index, min) => ({
  initial: {
    scale: min === "min" ? 0.8 : 0,
    opacity: min === "min" ? 0.8 : 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.05,
      ease: 'easeOut',
    },
  },
});

export const fadeStagger = {
  initial: {
    y: -40,
  },
  animate: {
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5,
      delayChildren: 2.4,
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

export const answerTransition = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};
import React from 'react'
import PropTypes from 'prop-types'
import { getAlt, getSrc, getSrcSet } from '../utils/utils'

// Ideally, this component will take in an image object formatted by our images API and spit out an image with a proper srcset. However, I also thought I should provide a couple of fallback options, in case you want to use an image from somewhere else entirely: fallbackSrcSet and fallbackSrc. The last one will just create a normal img tag, so I really don't recommend it.

const Image = (props) => {
  return (
    <img
      className={props.elementClass}
      src={getSrc(props)}
      alt={getAlt(props)}
      srcSet={getSrcSet(props)}
      sizes={props.sizes}
      loading={props.loading}
    />
  )
}

const aspectRatioType = PropTypes.shape({
  instances: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number
    })
  ),
  slug: PropTypes.string
})

Image.propTypes = {
  image: PropTypes.shape({
    preferredAspectRatio: aspectRatioType,
    aspect_ratios: PropTypes.shape({
      normal: aspectRatioType,
      square: aspectRatioType,
      thumbnail: aspectRatioType,
      widescreen: aspectRatioType,
      portrait: aspectRatioType,
      uncropped: aspectRatioType
    }),
    fallback: PropTypes.string.isRequired,
    long_caption: PropTypes.string,
    short_caption: PropTypes.string,
    width: PropTypes.string,
    preferred_aspect_ratio_slug: PropTypes.string,
    id: PropTypes.string,
    url: PropTypes.string,
    srcset: PropTypes.string
  }),
  aspectRatio: PropTypes.oneOf([
    'normal',
    'square',
    'thumbnail',
    'widescreen',
    'portrait',
    'uncropped'
  ]),
  elementClass: PropTypes.string,
  fallbackSrcSet: PropTypes.string,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string,
  sizes: PropTypes.string,
  loading: PropTypes.string,
  mustProvideOne: function(props) {
    if (!props['image'] && !props['fallbackSrc']) {
      return new Error(
        'Please provide either a properly formatted image JSON object or an image src'
      )
    }
  },
  mustProvideAlt: function(props) {
    if (!props['image'] && !props['alt'] && props['alt'] !== '') {
      return new Error(
        'Please provide either a properly formatted image JSON object or an image alt'
      )
    }
  },
  mustProvideSrcWithSrcset: function(props) {
    if (!props['image'] && !props['fallbackSrc'] && props['fallbackSrcSet']) {
      return new Error(
        'You cannot provide a fallbackSrcSet without providing a fallbackSrc'
      )
    }
  }
}

Image.defaultProps = {
  elementClass: ''
}

export default Image
